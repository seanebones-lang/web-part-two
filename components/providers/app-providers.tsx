"use client";

import { usePathname } from "next/navigation";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";

import { ChatWidget } from "@/components/chat/chat-widget";

export function AppProviders({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const [chatOpen, setChatOpen] = useState(false);

  const lenisRef = useRef<{ destroy: () => void; stop?: () => void; start?: () => void } | null>(
    null,
  );
  const chatOpenRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (chatOpen) lenis.stop?.();
    else lenis.start?.();
  }, [chatOpen]);

  useEffect(() => {
    if (isStudio) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      // Apply current chat state immediately after Lenis loads
      if (chatOpenRef.current) lenis.stop?.();

      function raf(time: number) {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [isStudio]);

  return (
    <>
      {children}
      {!isStudio ? <ChatWidget onOpenChange={setChatOpen} /> : null}
    </>
  );
}
