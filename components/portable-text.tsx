import Image from "next/image";

import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 max-w-none leading-relaxed text-[var(--text-muted)] last:mb-0">{children}</p>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-lg font-semibold text-[var(--text-primary)] first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[var(--accent)]/60 pl-4 italic text-[var(--text-muted)]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[var(--text-muted)]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-[var(--text-muted)]">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ children, value }) => (
      <a
        href={(value as { href?: string }).href}
        className="text-[var(--accent)] underline-offset-4 hover:underline"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      try {
        const url = urlFor(value).width(960).url();
        const alt =
          typeof value === "object" &&
          value &&
          "alt" in value &&
          typeof (value as { alt?: string }).alt === "string"
            ? (value as { alt: string }).alt
            : "";
        return (
          <figure className="my-6 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            <Image
              src={url}
              alt={alt}
              width={960}
              height={540}
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </figure>
        );
      } catch {
        return null;
      }
    },
  },
};

export function PortableBody({
  value,
  className,
}: {
  value: unknown;
  className?: string;
}) {
  if (!value || !Array.isArray(value)) return null;
  return (
    <div className={cn("max-w-none", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
