import { createXai } from "@ai-sdk/xai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

import { messagesContainImageParts } from "@/lib/chat-has-image";
import { NEXT_ELEVEN_CHAT_SYSTEM } from "@/lib/chat-system";
import { nextElevenChatTools } from "@/lib/chat-tools";

export const maxDuration = 120;

const xai = createXai({
  apiKey: process.env.XAI_API_KEY ?? "",
});

function resolveModelId(raw: unknown): string {
  const fallback = process.env.XAI_MODEL ?? "grok-4";
  if (typeof raw !== "string") return fallback;
  const t = raw.trim();
  if (/^grok-[a-z0-9._-]+$/i.test(t)) return t;
  return fallback;
}

function pickModel(messages: UIMessage[], bodyModel: unknown): string {
  const hasImage = messagesContainImageParts(messages);
  if (hasImage) {
    const visionDefault =
      process.env.XAI_VISION_MODEL ?? process.env.XAI_MODEL ?? "grok-4";
    return resolveModelId(visionDefault);
  }
  return resolveModelId(bodyModel);
}

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "Chat is not configured. Add XAI_API_KEY to your environment.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = (
    body as {
      messages?: UIMessage[];
      model?: unknown;
    }
  ).messages;

  if (!messages?.length) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const bodyModel = (body as { model?: unknown }).model;
  const modelId = pickModel(messages, bodyModel);

  const modelMessages = await convertToModelMessages(messages, {
    tools: nextElevenChatTools,
  });

  const result = streamText({
    model: xai(modelId),
    system: NEXT_ELEVEN_CHAT_SYSTEM,
    messages: modelMessages,
    tools: nextElevenChatTools,
    stopWhen: stepCountIs(14),
  });

  return result.toUIMessageStreamResponse();
}
