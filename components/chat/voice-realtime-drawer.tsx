"use client";

import { Headphones, PlugZap, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_WS = "ws://127.0.0.1:8787";
const MAX_EVENTS = 120;

type LogLine = { id: string; at: number; kind: "in" | "out" | "sys"; text: string };

function summarizeRealtimePayload(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.length) return "(empty)";
  try {
    const o = JSON.parse(trimmed) as { type?: string };
    const t = o.type ?? "";
    if (
      t.includes("output_audio.delta") ||
      t.includes("input_audio_buffer.append") ||
      t === "response.audio.delta"
    ) {
      return `{ "type": "${t}", … } (audio omitted)`;
    }
    const s = JSON.stringify(o);
    return s.length > 1800 ? `${s.slice(0, 1800)}…` : s;
  } catch {
    return trimmed.length > 1800 ? `${trimmed.slice(0, 1800)}…` : trimmed;
  }
}

export function VoiceRealtimeDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const wsUrl =
    typeof process.env.NEXT_PUBLIC_XAI_VOICE_PROXY_WS === "string" &&
    process.env.NEXT_PUBLIC_XAI_VOICE_PROXY_WS.length > 0
      ? process.env.NEXT_PUBLIC_XAI_VOICE_PROXY_WS
      : DEFAULT_WS;

  const [status, setStatus] = useState<"idle" | "connecting" | "open" | "error">("idle");
  const [lines, setLines] = useState<LogLine[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = useCallback((kind: LogLine["kind"], text: string) => {
    setLines((prev) => {
      const next: LogLine[] = [
        ...prev,
        { id: crypto.randomUUID(), at: Date.now(), kind, text },
      ];
      return next.slice(-MAX_EVENTS);
    });
  }, []);

  useEffect(() => {
    if (!open) {
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    startTransition(() => {
      setLines([]);
      setStatus("connecting");
    });
    queueMicrotask(() => {
      push("sys", `Connecting to ${wsUrl} …`);
    });

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
      push("sys", "Socket open — upstream uses your local proxy + XAI_API_KEY.");
    };

    ws.onmessage = (ev) => {
      const raw = typeof ev.data === "string" ? ev.data : "";
      push("in", summarizeRealtimePayload(raw));
    };

    ws.onerror = () => {
      setStatus("error");
      push(
        "sys",
        "WebSocket error — is `npm run voice-proxy` running with XAI_API_KEY set?",
      );
    };

    ws.onclose = () => {
      setStatus((s) => (s === "connecting" ? "error" : "idle"));
      push("sys", "Disconnected.");
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [open, push, wsUrl]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
  }, [lines]);

  function sendProbe() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const msg = JSON.stringify({
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
      },
    });
    ws.send(msg);
    push("out", summarizeRealtimePayload(msg));
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Realtime voice (proxy)"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2 }}
          className="glass-panel fixed bottom-24 right-4 z-[70] flex max-h-[min(420px,70vh)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-2xl sm:bottom-28 sm:right-6"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Headphones className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                  Grok realtime (proxy)
                </p>
                <p className="truncate text-[10px] text-[var(--text-muted)]" title={wsUrl}>
                  {wsUrl}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  status === "open" && "bg-emerald-500/15 text-emerald-300",
                  status === "connecting" && "bg-amber-500/15 text-amber-200",
                  (status === "idle" || status === "error") && "bg-white/10 text-[var(--text-muted)]",
                )}
              >
                {status === "open" ? "live" : status === "connecting" ? "…" : status === "error" ? "error" : "off"}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                aria-label="Close realtime voice panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-2 font-mono text-[10px] leading-relaxed text-[var(--text-muted)]"
          >
            {lines.length === 0 ? (
              <p className="text-[var(--text-muted)]">Waiting for events…</p>
            ) : (
              lines.map((l) => (
                <div
                  key={l.id}
                  className={cn(
                    "whitespace-pre-wrap break-all rounded px-1 py-0.5",
                    l.kind === "sys" && "bg-white/[0.04] text-[var(--text-muted)]",
                    l.kind === "in" && "text-emerald-200/90",
                    l.kind === "out" && "text-sky-200/90",
                  )}
                >
                  <span className="opacity-60">
                    [{l.kind === "in" ? "←" : l.kind === "out" ? "→" : "·"}]
                  </span>{" "}
                  {l.text}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] px-3 py-2">
            <button
              type="button"
              disabled={status !== "open"}
              onClick={sendProbe}
              title='Send a minimal session.update (modalities: text + audio)'
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-white/10 px-2 py-1 text-[10px] font-medium text-[var(--text-primary)] hover:bg-white/15 disabled:opacity-40"
            >
              <PlugZap className="h-3.5 w-3.5" />
              Session probe
            </button>
            <p className="flex-1 text-[10px] leading-snug text-[var(--text-muted)]">
              Full duplex audio requires streaming PCM via the realtime protocol; this panel validates the proxy and shows server events.
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
