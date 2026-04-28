"use client";

import { ChevronRight, ExternalLink, Loader2, Mail, Phone } from "lucide-react";
import Link from "next/link";
import type { DynamicToolUIPart, ToolUIPart, UITools } from "ai";
import { getToolName } from "ai";

function JsonFallback({ output }: { output: unknown }) {
  return (
    <pre className="max-h-52 overflow-auto p-3 font-mono text-[10px] leading-relaxed text-[var(--text-muted)]">
      {JSON.stringify(output, null, 2)}
    </pre>
  );
}

function ContactRich({
  output,
}: {
  output: unknown;
}) {
  if (!output || typeof output !== "object") return <JsonFallback output={output} />;
  const o = output as {
    email?: string;
    phoneDisplay?: string;
    phoneTel?: string;
  };
  if (!o.email && !o.phoneDisplay) return <JsonFallback output={output} />;
  return (
    <div className="grid gap-3 p-3 text-[11px]">
      {o.email ? (
        <a
          href={`mailto:${o.email}`}
          className="flex items-center gap-2 rounded-xl bg-black/35 px-3 py-2 font-medium text-[var(--accent)] ring-1 ring-[var(--accent)]/25 transition hover:bg-black/50"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden />
          {o.email}
        </a>
      ) : null}
      {o.phoneDisplay && o.phoneTel ? (
        <a
          href={o.phoneTel}
          className="flex items-center gap-2 rounded-xl bg-black/35 px-3 py-2 font-medium text-emerald-300/95 ring-1 ring-emerald-400/25 transition hover:bg-black/50"
        >
          <Phone className="h-4 w-4 shrink-0" aria-hidden />
          {o.phoneDisplay}
        </a>
      ) : null}
    </div>
  );
}

function LinksRich({ output }: { output: unknown }) {
  if (!output || typeof output !== "object") return <JsonFallback output={output} />;
  const links = (output as { links?: { label: string; href: string; hint?: string }[] }).links;
  if (!Array.isArray(links) || !links.length) return <JsonFallback output={output} />;
  return (
    <ul className="space-y-2 p-3">
      {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-wrap items-center gap-2 font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {l.label}
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </a>
            ) : (
              <Link
                href={l.href}
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {l.label}
              </Link>
            )}
            {l.hint ? (
              <p className="mt-0.5 pl-0 text-[10px] text-[var(--text-muted)]">{l.hint}</p>
            ) : null}
          </li>
        ))}
    </ul>
  );
}

function CapabilitiesRich({ output }: { output: unknown }) {
  if (!output || typeof output !== "object") return <JsonFallback output={output} />;
  const caps = (output as { capabilities?: string[]; audience?: string }).capabilities;
  const audience = (output as { audience?: string }).audience;
  if (!Array.isArray(caps) || !caps.length) return <JsonFallback output={output} />;
  return (
    <div className="p-3">
      {audience ? (
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Audience · {audience}
        </p>
      ) : null}
      <ul className="list-disc space-y-1.5 pl-4 text-[11px] leading-snug text-[var(--text-muted)] marker:text-[var(--accent)]">
        {caps.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

function WebSearchRich({ output }: { output: unknown }) {
  if (!output || typeof output !== "object") return <JsonFallback output={output} />;
  const o = output as {
    ok?: boolean;
    query?: string;
    error?: string;
    results?: { ref?: number; title: string; url: string; snippet: string }[];
  };
  if (o.ok === false) {
    return (
      <div className="space-y-2 p-3 text-[11px]">
        <p className="font-semibold text-amber-100">Web search unavailable</p>
        <p className="leading-relaxed text-[var(--text-muted)]">{o.error ?? "Unknown error"}</p>
        <ul className="list-disc space-y-1 pl-4 text-[10px] text-[var(--text-muted)]">
          <li>
            Set <span className="font-mono text-[var(--text-primary)]">SERPER_API_KEY</span> on the
            server (see <span className="font-mono">.env.example</span>).
          </li>
          <li>Redeploy or restart the dev server after changing env.</li>
        </ul>
      </div>
    );
  }
  const results = o.results ?? [];
  if (!results.length) {
    return (
      <p className="p-3 text-[11px] text-[var(--text-muted)]">
        No results for “{o.query ?? "?"}”. Try a shorter query or different keywords.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      <p className="px-3 pt-2 text-[10px] leading-snug text-[var(--text-muted)]">
        Cite facts as{" "}
        <span className="font-mono text-[var(--accent)]">[1]</span>,{" "}
        <span className="font-mono text-[var(--accent)]">[2]</span>, … matching{" "}
        <span className="font-mono">ref</span> below.
      </p>
      <ul className="space-y-3 px-3 pb-3">
        {results.map((r, i) => {
          const ref = typeof r.ref === "number" ? r.ref : i + 1;
          return (
            <li
              key={`${r.url}-${ref}`}
              className="border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline gap-2 gap-y-0">
                <span className="font-mono text-[10px] font-semibold text-[var(--accent)]">
                  [{ref}]
                </span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                >
                  {r.title}
                </a>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-[var(--text-muted)]">{r.snippet}</p>
              <p className="mt-1 truncate font-mono text-[9px] text-[var(--text-muted)]/75">{r.url}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RichToolOutput({ name, output }: { name: string; output: unknown }) {
  switch (name) {
    case "webSearch":
      return <WebSearchRich output={output} />;
    case "getContactInfo":
      return <ContactRich output={output} />;
    case "getSiteLinks":
      return <LinksRich output={output} />;
    case "listAssistantCapabilities":
      return <CapabilitiesRich output={output} />;
    default:
      return <JsonFallback output={output} />;
  }
}

export function ChatToolPartRow({
  part,
}: {
  part: ToolUIPart<UITools> | DynamicToolUIPart;
}) {
  const name = getToolName(part);

  if (part.state === "input-streaming" || part.state === "input-available") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--accent)]/25 bg-black/35 px-3 py-2 text-[11px] text-[var(--text-muted)]">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" aria-hidden />
        <span className="font-mono text-[var(--accent)]">{name}</span>
        <span>running tool…</span>
      </div>
    );
  }

  if (part.state === "output-available") {
    return (
      <div className="overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5 font-mono text-emerald-300/95">
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {name}
        </div>
        <RichToolOutput name={name} output={part.output} />
      </div>
    );
  }

  if (part.state === "output-error") {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
        <p className="font-mono text-rose-50">{name}</p>
        <p className="mt-1 leading-relaxed text-rose-100/95">{part.errorText}</p>
        <p className="mt-2 text-[10px] text-rose-100/75">
          Retry the question or check server logs. Configuration issues often mean missing API keys.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-[var(--text-muted)]">
      <span className="font-mono text-[var(--text-primary)]">{name}</span> · {part.state}
    </div>
  );
}
