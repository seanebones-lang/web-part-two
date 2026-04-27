"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  async function send() {
    const text = input.trim();
    if (!text || pending) return;

    const userMsg: Msg = { role: "user", content: text };
    const thread = [...messages, userMsg];
    setMessages([...thread, { role: "assistant", content: "" }]);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: thread.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const errBody = await res.json();
          if (
            errBody &&
            typeof errBody === "object" &&
            "error" in errBody &&
            typeof (errBody as { error: unknown }).error === "string"
          ) {
            msg = (errBody as { error: string }).error;
          }
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") last.content = acc;
          return copy;
        });
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === "assistant") {
          last.content = msg;
        }
        return copy;
      });
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send();
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="glass-panel flex h-[min(520px,calc(100vh-6rem))] w-[min(100vw-2rem,400px)] flex-col overflow-hidden shadow-[0_0_48px_-12px_var(--accent-glow)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  NextEleven Assistant
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Powered by xAI Grok
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-hidden">
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
              >
                {messages.length === 0 ? (
                  <p className="leading-relaxed text-[var(--text-muted)]">
                    Ask about engagements, timelines, guardrails, or how modular SaaS
                    snaps onto bespoke builds.
                  </p>
                ) : null}
                {messages.map((m, i) => (
                  <div
                    key={`${m.role}-${i}-${m.content.slice(0, 12)}`}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 leading-relaxed ${
                        m.role === "user"
                          ? "bg-[var(--accent)] text-[var(--bg-deep)]"
                          : "bg-white/5 text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]"
                      }`}
                    >
                      {m.role === "assistant" && !m.content && pending ? (
                        <span className="animate-pulse text-[var(--text-muted)]">…</span>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={onSubmit}
                className="border-t border-[var(--border-subtle)] p-3"
              >
                {error ? (
                  <p className="mb-2 text-xs text-rose-400" role="alert">
                    {error}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask NextEleven…"
                    className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-black/40 px-4 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50"
                  />
                  <button
                    type="submit"
                    disabled={pending || !input.trim()}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2 text-[var(--bg-deep)] disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setError(null);
        }}
        className="glass-panel inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_40px_-10px_var(--accent-glow)] ring-2 ring-[var(--accent)]/40 transition hover:scale-[1.03] hover:ring-[var(--accent)]"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="h-6 w-6 text-[var(--accent)]" />
      </button>
    </div>
  );
}
