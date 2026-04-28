import type { UIMessage } from "ai";
import { isFileUIPart, isTextUIPart } from "ai";

/** Visible text + attachment annotations for copy / export. */
export function getMessagePlainText(message: UIMessage): string {
  const parts = message.parts;
  if (!parts?.length) return "";
  const lines: string[] = [];
  for (const part of parts) {
    if (isTextUIPart(part) && part.text.trim()) lines.push(part.text);
    if (isFileUIPart(part)) {
      const kind = part.mediaType.startsWith("image/") ? "image" : "file";
      lines.push(`[${kind}: ${part.filename ?? "attachment"}]`);
    }
  }
  return lines.join("\n\n");
}

/** Strip bracket attachment lines for speech synthesis. */
export function plainTextForSpeech(text: string): string {
  return text
    .split(/\n\n+/)
    .filter((line) => !/^\[(?:image|file):/i.test(line.trim()))
    .join("\n\n")
    .trim();
}
