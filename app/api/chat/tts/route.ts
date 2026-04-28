import { plainTextForTts } from "@/lib/chat-tts-plain";
import type { XaiVoiceId } from "@/lib/xai-voices";
import { DEFAULT_VOICE, XAI_VOICES } from "@/lib/xai-voices";

export const maxDuration = 60;

const ALLOWED = new Set<string>(XAI_VOICES.map((v) => v.id));

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return Response.json(
      { error: "Voice is not configured. Add XAI_API_KEY to your environment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw =
    body &&
    typeof body === "object" &&
    "text" in body &&
    typeof (body as { text: unknown }).text === "string"
      ? (body as { text: string }).text.trim()
      : "";

  if (!raw) {
    return Response.json({ error: "text required" }, { status: 400 });
  }

  const voiceRaw =
    body &&
    typeof body === "object" &&
    "voice_id" in body &&
    typeof (body as { voice_id: unknown }).voice_id === "string"
      ? (body as { voice_id: string }).voice_id
      : DEFAULT_VOICE;

  const voice_id = (ALLOWED.has(voiceRaw) ? voiceRaw : DEFAULT_VOICE) as XaiVoiceId;

  const language =
    body &&
    typeof body === "object" &&
    "language" in body &&
    typeof (body as { language: unknown }).language === "string"
      ? (body as { language: string }).language
      : "en";

  const text = plainTextForTts(raw);
  if (!text) {
    return Response.json({ error: "Nothing to speak after cleaning text" }, { status: 400 });
  }

  const upstream = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_id,
      language,
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    return Response.json(
      { error: errText || `TTS failed (${upstream.status})` },
      { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
    );
  }

  const buf = await upstream.arrayBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
