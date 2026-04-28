"use client";

import { Check, Copy } from "lucide-react";
import { type ReactNode, useCallback, useRef, useState } from "react";

type Props = {
  children: ReactNode;
};

export function ChatPreWithCopy({ children }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const text = ref.current?.innerText ?? "";
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="group/pre relative my-2">
      <button
        type="button"
        onClick={() => void copy()}
        title="Copy code"
        className="absolute right-2 top-2 z-[1] inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-medium text-[var(--text-muted)] opacity-0 shadow-lg backdrop-blur transition hover:bg-black/90 hover:text-[var(--text-primary)] group-hover/pre:opacity-100"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-emerald-400" aria-hidden />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" aria-hidden />
            Copy
          </>
        )}
      </button>
      <pre
        ref={ref}
        className="overflow-x-auto rounded-xl bg-black/55 p-0 ring-1 ring-white/10 [&>code]:block [&>code]:bg-transparent [&>code]:p-3"
      >
        {children}
      </pre>
    </div>
  );
}
