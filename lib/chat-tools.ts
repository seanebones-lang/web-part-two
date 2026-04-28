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
      audience: z.enum(["executive", "engineer"]).optional(),
    }),
    execute: async ({ audience }) => ({
      audience: audience ?? "engineer",
      capabilities: [
        "UIMessage stream via AI SDK · OpenAI-compatible xAI Grok endpoint",
        "Multi-step tools: contact, site links, capability catalog, optional Serper web search with numbered refs [1], [2] for citations",
        "PDF text extraction + vision images + xAI TTS/STT (proxied API routes)",
        "Markdown + GFM + syntax-highlighted code blocks",
        "Optional local WebSocket proxy for xAI realtime voice (see voice proxy script)",
        "Stop / regenerate / persist / export transcripts client-side",
      ],
    }),
  }),

  getSiteLinks: tool({
    description:
      "Return canonical URLs on this site for portfolio, services, products, or contact.",
    inputSchema: z.object({
      intent: z.enum(["portfolio", "services", "products", "contact", "all"]).optional(),
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
      const key = intent ?? "all";
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
