#!/usr/bin/env node
/**
 * Local WebSocket bridge: browser (no API key) → this proxy → xAI Realtime Voice API.
 * Requires XAI_API_KEY. Optional: XAI_VOICE_PROXY_PORT (default 8787), XAI_REALTIME_MODEL.
 *
 * Usage: npm run voice-proxy
 */

import { WebSocketServer } from "ws";
import WebSocket from "ws";

const PORT = Number(process.env.XAI_VOICE_PROXY_PORT || "8787") || 8787;
const apiKey = process.env.XAI_API_KEY;
const model =
  process.env.XAI_REALTIME_MODEL?.trim() || "grok-voice-think-fast-1.0";

if (!apiKey) {
  console.error("[xai-voice-proxy] Missing XAI_API_KEY");
  process.exit(1);
}

const upstreamUrl = `wss://api.x.ai/v1/realtime?model=${encodeURIComponent(model)}`;

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`[xai-voice-proxy] ws://127.0.0.1:${PORT} → ${upstreamUrl}`);
});

wss.on("connection", (clientWs) => {
  const upstream = new WebSocket(upstreamUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const pending = [];

  upstream.on("open", () => {
    while (pending.length) upstream.send(pending.shift());
  });

  clientWs.on("message", (data) => {
    if (upstream.readyState === WebSocket.OPEN) {
      upstream.send(data);
      return;
    }
    if (upstream.readyState === WebSocket.CONNECTING) {
      pending.push(data);
    }
  });

  upstream.on("message", (data, isBinary) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data, { binary: Boolean(isBinary) });
    }
  });

  function closeBoth() {
    try {
      clientWs.close();
    } catch {
      /* ignore */
    }
    try {
      upstream.close();
    } catch {
      /* ignore */
    }
  }

  upstream.on("close", closeBoth);
  upstream.on("error", closeBoth);
  clientWs.on("close", closeBoth);
  clientWs.on("error", closeBoth);
});

wss.on("error", (err) => {
  console.error("[xai-voice-proxy]", err);
  process.exit(1);
});
