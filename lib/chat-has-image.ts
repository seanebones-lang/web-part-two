import type { UIMessage } from "ai";

/** True if any message includes an image file part (for vision model routing). */
export function messagesContainImageParts(messages: UIMessage[]): boolean {
  return messages.some((m) =>
    m.parts?.some((p) => {
      if (p.type !== "file") return false;
      const mt = "mediaType" in p ? String((p as { mediaType?: string }).mediaType) : "";
      return mt.startsWith("image/");
    }),
  );
}
