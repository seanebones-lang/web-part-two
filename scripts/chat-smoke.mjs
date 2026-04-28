#!/usr/bin/env node
/**
 * Minimal end-to-end smoke test for /api/chat SSE behavior.
 *
 * Usage:
 *   node scripts/chat-smoke.mjs
 *   CHAT_BASE_URL=https://web-part-two.vercel.app node scripts/chat-smoke.mjs
 */

const baseUrl = (process.env.CHAT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const endpoint = `${baseUrl}/api/chat`;

const scenarios = [
  {
    name: "plain greeting",
    prompt: "hello",
    expectTool: false,
  },
  {
    name: "tool path (capabilities)",
    prompt: "what are all the new features you have?",
    expectTool: true,
  },
];

function parseSseEvents(text) {
  const events = [];
  const chunks = text.split(/\n\n+/);
  for (const c of chunks) {
    const line = c
      .split("\n")
      .find((l) => l.startsWith("data: "));
    if (!line) continue;
    const payload = line.slice("data: ".length).trim();
    if (payload === "[DONE]") {
      events.push({ type: "done" });
      continue;
    }
    try {
      events.push(JSON.parse(payload));
    } catch {
      events.push({ type: "raw", payload });
    }
  }
  return events;
}

async function runScenario({ name, prompt, expectTool }) {
  const body = {
    messages: [
      {
        id: `u-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role: "user",
        parts: [{ type: "text", text: prompt }],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${name}] HTTP ${res.status}: ${text || res.statusText}`);
  }

  const text = await res.text();
  const events = parseSseEvents(text);

  const err = events.find((e) => e?.type === "error");
  if (err) {
    throw new Error(`[${name}] SSE error: ${err.errorText || JSON.stringify(err)}`);
  }

  const hasToolOutput = events.some((e) => e?.type === "tool-output-available");
  const hasTextDelta = events.some((e) => e?.type === "text-delta");
  const hasFinish = events.some((e) => e?.type === "finish");

  if (expectTool && !hasToolOutput) {
    throw new Error(`[${name}] expected tool output event, got none`);
  }
  if (!hasTextDelta || !hasFinish) {
    throw new Error(`[${name}] missing text or finish events`);
  }

  return { name, ok: true, hasToolOutput };
}

async function main() {
  console.log(`Chat smoke target: ${endpoint}`);
  for (const s of scenarios) {
    const result = await runScenario(s);
    console.log(
      `✓ ${result.name}${result.hasToolOutput ? " (tool step observed)" : ""}`,
    );
  }
  console.log("All chat smoke checks passed.");
}

main().catch((err) => {
  console.error("Chat smoke failed.");
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});

