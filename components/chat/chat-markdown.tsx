"use client";

import { common } from "lowlight";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
import { useMemo } from "react";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { ChatPreWithCopy } from "@/components/chat/chat-pre-with-copy";
import {
  extractWebSearchCitationUrls,
  injectCitationLinksInMarkdown,
} from "@/lib/chat-citations";

import "highlight.js/styles/github-dark.css";

type Props = {
  children: string;
  /** When set (e.g. from webSearch tool), `[n]` in prose becomes a link to the matching URL. */
  citationUrls?: ReadonlyMap<number, string>;
};

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (typeof node === "object" && "props" in node) {
    const p = node as { props?: { children?: ReactNode } };
    return flattenText(p.props?.children);
  }
  return "";
}

export function ChatMarkdown({ children, citationUrls }: Props) {
  const md = useMemo(() => {
    if (citationUrls?.size) {
      return injectCitationLinksInMarkdown(children, citationUrls);
    }
    return children;
  }, [children, citationUrls]);

  return (
    <div className="chat-md text-[0.9375rem] leading-relaxed text-[var(--text-primary)] [&_.hljs]:bg-transparent [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--accent)]/40 [&_blockquote]:pl-3 [&_blockquote]:text-[var(--text-muted)] [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-medium [&_hr]:my-3 [&_hr]:border-[var(--border-subtle)] [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-2 [&_strong]:font-semibold [&_strong]:text-[var(--text-primary)] [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_td]:border [&_td]:border-[var(--border-subtle)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--border-subtle)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { languages: common }]]}
        components={{
          pre({ children: preChildren }) {
            return <ChatPreWithCopy>{preChildren}</ChatPreWithCopy>;
          },
          code({ className, children, ...rest }) {
            const block =
              Boolean(className?.includes("language-")) ||
              Boolean(className?.includes("hljs"));
            if (!block) {
              return (
                <code
                  className="rounded-md bg-black/45 px-1.5 py-0.5 font-mono text-[0.8125rem] text-[var(--accent)] ring-1 ring-white/10"
                  {...rest}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`font-mono text-[0.8125rem] ${className ?? ""}`} {...rest}>
                {children}
              </code>
            );
          },
          a({ href, children, ...rest }) {
            const label = flattenText(children).trim();
            const isNumericCite =
              Boolean(href?.startsWith("http")) && /^\d+$/.test(label);

            if (isNumericCite) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={href}
                  className="chat-md-cite align-super text-[0.7rem] font-semibold leading-none text-[var(--accent)] underline underline-offset-2"
                >
                  [{label}]
                </a>
              );
            }

            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                {children}
              </a>
            );
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}

/** Assistant replies: wires webSearch `ref` → URL so `[n]` in prose becomes a clickable cite link. */
export function AssistantChatMarkdown({
  message,
  children,
}: {
  message: UIMessage;
  children: string;
}) {
  const citationUrls = useMemo(() => extractWebSearchCitationUrls(message), [message]);

  return (
    <ChatMarkdown citationUrls={citationUrls.size > 0 ? citationUrls : undefined}>
      {children}
    </ChatMarkdown>
  );
}
