import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionEyebrow({
  children,
  className,
  centered,
}: {
  children: ReactNode;
  className?: string;
  /** Use under centered section titles */
  centered?: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]",
        centered && "text-center",
        className,
      )}
    >
      {children}
    </p>
  );
}
