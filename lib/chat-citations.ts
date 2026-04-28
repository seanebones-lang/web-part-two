import { getToolName, isToolUIPart, type UIMessage } from "ai";

/**
 * Maps citation indices [1], [2], … to URLs from the latest webSearch tool output in this message.
 */
export function extractWebSearchCitationUrls(message: UIMessage): Map<number, string> {
  const map = new Map<number, string>();
  if (message.role !== "assistant") return map;
  for (const p of message.parts ?? []) {
    if (!isToolUIPart(p) || p.state !== "output-available") continue;
    if (getToolName(p) !== "webSearch") continue;
    const out = p.output as {
      ok?: boolean;
      results?: { ref?: number; url?: string }[];
    };
    if (!out?.ok || !Array.isArray(out.results)) continue;
    for (const r of out.results) {
      const ref = typeof r.ref === "number" ? r.ref : undefined;
      const url = typeof r.url === "string" ? r.url.trim() : "";
      if (ref !== undefined && ref > 0 && url.length > 0) {
        map.set(ref, url);
      }
    }
  }
  return map;
}

/**
 * Turns bracket refs `[n]` into Markdown links `[n](url)` when `urls` has an entry for `n`.
 * Skips fenced code blocks and existing `[n](...)` links.
 * Inline `[n]` inside single backticks is still rewritten — avoid citing inside `` `code` `` if needed.
 */
export function injectCitationLinksInMarkdown(
  text: string,
  urls: ReadonlyMap<number, string>,
): string {
  if (!urls.size || !text) return text;
  const chunks = text.split(/(```[\s\S]*?```)/g);
  return chunks
    .map((chunk) => {
      if (chunk.startsWith("```")) return chunk;
      return chunk.replace(/\[(\d+)\](?!\()/g, (full, numStr: string) => {
        const n = parseInt(numStr, 10);
        const url = urls.get(n);
        if (!url) return full;
        return `[${numStr}](${url})`;
      });
    })
    .join("");
}
