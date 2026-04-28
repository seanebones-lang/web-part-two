import { tool } from "ai";
import { z } from "zod";

import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/lib/contact";
import { runSerperWebSearch } from "@/lib/serper-search";

/**
 * Server-executed tools for the marketing assistant — demonstrates agentic patterns
 * we ship for clients (structured retrieval + safe defaults).
 */
export const nextElevenChatTools = {
  webSearch: tool({
    description:
      "Search the public web for timely facts, news, standards, or definitions. Use when the user asks for current events, citations, or something that requires up-to-date external information. Prefer concise queries.",
    inputSchema: z.object({
      query: z.string().describe("Focused web search query"),
    }),
    execute: async ({ query }) => runSerperWebSearch(query),
  }),

  getContactInfo: tool({
    description:
      "Return NextEleven public contact channels. Use when the user asks for email, phone, how to reach the team, or booking/billing contact (without quoting prices).",
    inputSchema: z.object({}),
    execute: async () => ({
      email: CONTACT_EMAIL,
      phoneDisplay: CONTACT_PHONE_DISPLAY,
      phoneTel: CONTACT_PHONE_HREF,
    }),
  }),

  listAssistantCapabilities: tool({
    description:
      "Return the canonical flagship capability list for this assistant (streaming, tools, multimodal). Use when the user asks for flagship features, what this chat can do, or how it was built.",
    inputSchema: z.object({
      /** Keep permissive to avoid tool-call validation failures from minor model drift. */
      audience: z.string().optional(),
    }),
    execute: async ({ audience }) => {
      const normalized =
        typeof audience === "string" &&
        audience.trim().toLowerCase().startsWith("exec")
          ? "executive"
          : "engineer";

      return {
      audience: normalized,
      capabilities: [
        "Streaming chat over UIMessage protocol (AI SDK) with OpenAI-compatible xAI Grok model routing",
        "Server-side multi-step tools: contact info, site links, flagship capability catalog, optional Serper web search",
        "Web-search citation workflow: numbered refs [1], [2] with clickable links in rendered assistant markdown",
        "Multimodal input: image attachments for vision + PDF upload extraction merged into prompt context",
        "Voice stack: xAI TTS playback + microphone STT via secure server API routes",
        "Realtime voice option: local WebSocket proxy bridge to xAI Realtime API for live event-driven sessions",
        "Message UX polish: stop, regenerate, grounded-tool indicators, copy reply, and keyboard shortcuts",
        "Persistence & export: local thread history, voice preference memory, markdown/json export, full transcript copy",
      ],
    };
    },
  }),

  getSiteLinks: tool({
    description:
      "Return canonical URLs on this site for portfolio, services, products, or contact.",
    inputSchema: z.object({
      intent: z.string().optional(),
    }),
    execute: async ({ intent }) => {
      const links = [
        {
          label: "Portfolio",
          href: "/portfolio",
          hint: "Shipped work & case-style entries",
        },
        {
          label: "Services",
          href: "/services",
          hint: "Engagement patterns",
        },
        {
          label: "Products",
          href: "/products",
          hint: "Platforms & modules",
        },
        {
          label: "Contact",
          href: "/#contact",
          hint: "Email & phone",
        },
      ];
      const raw = typeof intent === "string" ? intent.trim().toLowerCase() : "";
      const key =
        raw === "portfolio" ||
        raw === "services" ||
        raw === "products" ||
        raw === "contact" ||
        raw === "all"
          ? raw
          : "all";
      if (key === "all") return { links };
      const match: Record<string, string> = {
        portfolio: "/portfolio",
        services: "/services",
        products: "/products",
        contact: "/#contact",
      };
      const href = match[key];
      return {
        links: links.filter((l) => l.href === href),
      };
    },
  }),
};
