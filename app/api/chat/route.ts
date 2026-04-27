import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

import { NEXT_ELEVEN_CHAT_SYSTEM } from "@/lib/chat-system";

export const maxDuration = 60;

const xai = createOpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY ?? "",
});

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
      messages?: { role: string; content: string }[];
    }
  ).messages;

  if (!messages?.length) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const modelId =
    process.env.XAI_MODEL ??
    "grok-2-latest";

  const validMessages = messages.filter(
    (m): m is { role: "user" | "assistant"; content: string } =>
      (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
  );

  if (!validMessages.length) {
    return new Response(
      JSON.stringify({ error: "At least one user or assistant message required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = streamText({
    model: xai(modelId),
    system: NEXT_ELEVEN_CHAT_SYSTEM,
    messages: validMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return result.toTextStreamResponse();
}
