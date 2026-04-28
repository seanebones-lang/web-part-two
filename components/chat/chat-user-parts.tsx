"use client";

import type { UIMessage } from "ai";
import { ImageIcon } from "lucide-react";
import { isFileUIPart, isTextUIPart } from "ai";

export function ChatUserParts({ message }: { message: UIMessage }) {
  const parts = message.parts ?? [];

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (isTextUIPart(part)) {
          return (
            <span key={`${message.id}-t-${i}`} className="block whitespace-pre-wrap">
              {part.text}
            </span>
          );
        }
        if (isFileUIPart(part)) {
          const img = part.mediaType.startsWith("image/") && part.url;
          if (img) {
            return (
              <div key={`${message.id}-f-${i}`} className="max-h-52 max-w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob / data URL */}
                <img
                  src={part.url}
                  alt={part.filename ?? "Uploaded image"}
                  className="max-h-52 max-w-full rounded-xl ring-2 ring-[var(--bg-deep)]/25"
                />
              </div>
            );
          }
          return (
            <div
              key={`${message.id}-f-${i}`}
              className="flex items-center gap-2 rounded-lg bg-[var(--bg-deep)]/15 px-2 py-1.5 text-[11px] text-[var(--bg-deep)]"
            >
              <ImageIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <span className="truncate font-medium">
                {part.filename ?? "attachment"} · {part.mediaType}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
