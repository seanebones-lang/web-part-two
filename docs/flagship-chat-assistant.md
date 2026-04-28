# NextEleven flagship chat assistant — architecture & implementation

This document describes how the embedded marketing-site assistant is built, **from foundation upward**. Each layer assumes the previous layers exist. Paths are relative to the repo root (`web-part-two`).

---

## 1. Foundation

### 1.1 Stack

| Piece | Role |
|--------|------|
| **Next.js App Router** | Hosts API routes and the client widget. |
| **Vercel AI SDK** (`ai`, `@ai-sdk/react`) | `useChat`, `UIMessage`, tool definitions, `streamText`, message streaming to the browser. |
| **OpenAI-compatible client** (`@ai-sdk/openai` + `createOpenAI`) | Points at **xAI’s** REST base URL so Grok behaves like an OpenAI-compatible chat model. |
| **xAI Grok** | Primary LLM (`XAI_MODEL`, default `grok-2-latest`). |

### 1.2 Single chat HTTP endpoint

**File:** `app/api/chat/route.ts`

- **POST** accepts JSON: `{ messages: UIMessage[], model?: string }`.
- Requires **`XAI_API_KEY`**; otherwise **503** with a clear JSON error (same pattern other routes follow).
- Builds **`modelMessages`** with `convertToModelMessages(messages, { tools })` so file parts, text, and tool UX map correctly for the model.
- Runs **`streamText`** with:
  - `system`: `NEXT_ELEVEN_CHAT_SYSTEM` (`lib/chat-system.ts`)
  - `messages`: converted thread
  - `tools`: `nextElevenChatTools` (`lib/chat-tools.ts`)
  - **`stopWhen: stepCountIs(14)`** — caps multi-step tool loops.
- Returns **`result.toUIMessageStreamResponse()`** — streaming UI message protocol the React hook understands.

**Timeouts:** `export const maxDuration = 120` (platform limit for long generations).

### 1.3 Client transport

**File:** `components/chat/chat-widget.tsx`

- **`useChat`** from `@ai-sdk/react` with `DefaultChatTransport({ api: "/api/chat" })`.
- **`experimental_throttle: 42`** — smooths UI updates during streaming.
- **`id: "nexteleven-marketing-chat"`** — stable chat id for persistence keying.

### 1.4 System prompt

**File:** `lib/chat-system.ts`

- Defines persona (NextEleven studio), allowed facts, **vision/PDF/tool rules**, **web citation behavior**, and strict **no-pricing / no-keys** rules.

---

## 2. Layer — Tool calling (server-side)

**File:** `lib/chat-tools.ts`

Tools are **`tool()`** definitions with Zod input schemas and **`execute`** functions that run **only on the server** inside `streamText`.

| Tool | Purpose |
|------|---------|
| **`webSearch`** | Calls Serper (`lib/serper-search.ts`) for live web results. |
| **`getContactInfo`** | Static contact channels from `lib/contact`. |
| **`getSiteLinks`** | Portfolio / services / products / contact paths. |
| **`listAssistantCapabilities`** | Canonical bullet list of what the demo implements (used for “flagship features” UX). |

**Serper:** `lib/serper-search.ts` POSTs to `https://google.serper.dev/search` with **`SERPER_API_KEY`**. Successful responses attach **`ref`** (1-based) to each organic hit for citations.

---

## 3. Layer — Streaming UI (messages & tools)

**Files:**

- `components/chat/chat-widget.tsx` — layout, composer, attachments, PDF chips, voice controls, exports.
- `components/chat/chat-tool-part.tsx` — Rich cards per tool (`WebSearchRich`, contact, links, capabilities); loading and **output-error** states.
- `components/chat/chat-user-parts.tsx` — Renders user **text + file** parts for multimodal messages.

**Behavior:**

- Assistant messages iterate **`parts`**: text, reasoning (if present), **tool** parts.
- **`ChatToolPartRow`** maps tool name → rich UI; **`webSearch`** shows numbered **`[ref]`** rows aligned with Serper output.

---

## 4. Layer — Markdown, citations, grounding

### 4.1 Markdown rendering

**File:** `components/chat/chat-markdown.tsx`

- **`react-markdown`** + **GFM** + **syntax highlighting** (`rehype-highlight`, `lowlight`).
- **`ChatPreWithCopy`** for code blocks.

### 4.2 Web citation links

**File:** `lib/chat-citations.ts`

- **`extractWebSearchCitationUrls(message)`** — walks assistant **`UIMessage.parts`** for **`webSearch`** tool output and builds **`ref → url`**.
- **`injectCitationLinksInMarkdown`** — turns bare **`[n]`** into **`[n](url)`** before Markdown parse; skips fenced **` ``` `** blocks and existing **`[n](...)`**.

**File:** `components/chat/chat-markdown.tsx`

- **`AssistantChatMarkdown`** — memoizes citation map per message and passes into **`ChatMarkdown`**.
- Anchor renderer: numeric-only link labels get a compact **superscript cite** style.

### 4.3 Grounding strip

**File:** `components/chat/chat-widget.tsx`

- After tool blocks, assistant bubbles show **`Grounded · …`** with human-readable tool labels (`TOOL_GROUNDING_LABEL`).

---

## 5. Layer — Vision (images)

**Detection:** `lib/chat-has-image.ts` — if any message part is a **file** with `mediaType` starting with **`image/`**, the thread is treated as vision-capable.

**Routing:** `app/api/chat/route.ts` — **`pickModel`** uses **`XAI_VISION_MODEL`** (fallback **`XAI_MODEL`**) when images are present.

**Client:** User attaches images via file input / drag-drop; **`sendMessage`** receives **`files`** (`DataTransfer` / `FileList`) per AI SDK patterns.

---

## 6. Layer — PDF text ingestion (client + API)

PDFs are **not** sent as binary to Grok as the primary path; text is **extracted server-side** and **prepended** to the user message as Markdown sections.

**Extract API:** `app/api/chat/extract-pdf/route.ts`

- **POST** `multipart/form-data`, field **`file`**, type **`application/pdf`**, max ~**18 MB**.
- Uses **`pdf-parse`** v2 **`PDFParse`** → **`getText()`** → **`destroy()`**.
- Returns **`{ text, pages, truncated }`**; caps text length (**`MAX_CHARS`**).

**Client:** `components/chat/chat-widget.tsx`

- **`pdfParts`** state: extracting / ready / error per file.
- **`ingestPdfFile`** posts to **`/api/chat/extract-pdf`**.
- **`submitComposer`** merges **`### Document: {name}`** blocks ahead of user text; blocks send while any PDF is **`extracting`**.

---

## 7. Layer — Voice (TTS & STT)

Keys stay **server-side**; browser talks only to **same-origin** routes.

| Route | Upstream | Role |
|-------|-----------|------|
| **`app/api/chat/tts/route.ts`** | `POST https://api.x.ai/v1/tts` | Text → audio bytes; voice from allowlist **`lib/xai-voices`**. |
| **`app/api/chat/stt/route.ts`** | `POST https://api.x.ai/v1/stt` | **`multipart`** audio (e.g. WebM from **`MediaRecorder`**) → transcript JSON. |

**Client:** Mic button records → STT → text appended to composer. **Listen** uses **`plainTextForSpeech`** (`lib/chat-message-plain.ts`) so attachment lines aren’t read aloud.

**TTS request body:** Text is cleaned via **`plainTextForTts`** (`lib/chat-tts-plain.ts`) before hitting xAI.

---

## 8. Layer — Realtime voice (local proxy + drawer)

Browsers cannot attach **`Authorization`** to native WebSockets to xAI the same way as HTTPS. A **small Node proxy** bridges:

**Script:** `scripts/xai-voice-proxy.mjs`  
**Dependency:** **`ws`**

- Listens (**default port `8787`**, override **`XAI_VOICE_PROXY_PORT`**).
- On each browser connection, opens **`wss://api.x.ai/v1/realtime?model=…`** with **`Authorization: Bearer XAI_API_KEY`**.
- Proxies binary/text frames both ways; queues client frames until upstream opens.

**Env:** **`NEXT_PUBLIC_XAI_VOICE_PROXY_WS`** (default `ws://127.0.0.1:8787`).

**UI:** `components/chat/voice-realtime-drawer.tsx` — connects, logs summarized JSON events, optional **`session.update`** “probe”.

**npm:** `"voice-proxy": "node scripts/xai-voice-proxy.mjs"` — run beside **`next dev`** for local demos.

---

## 9. Layer — Persistence, exports, UX polish

### 9.1 Persistence

- **`localStorage`** key **`nexteleven-chat-messages-v2`** — saves **`UIMessage[]`** on **`useChat` `onFinish`**.
- Hydration on mount reads JSON into **`setMessages`** (best-effort).

### 9.2 Voice preference

- **`localStorage`** **`nexteleven-chat-voice`** — persists TTS **`voiceId`** (`lib/xai-voices.ts`).

### 9.3 Exports

- Copy all / download **Markdown** / download **JSON** (UIMessage-shaped) from header actions.

### 9.4 Product UX

- **Friendly errors** for chat transport (`friendlyChatError` in widget).
- **Stop** while streaming; **regenerate** last reply.
- **ESC** closes realtime drawer → shortcuts panel → chat panel (order in `useEffect`).

---

## 10. Environment variables (reference)

| Variable | Used by |
|----------|---------|
| **`XAI_API_KEY`** | Chat, TTS, STT, voice proxy |
| **`XAI_MODEL`** | Default text model id |
| **`XAI_VISION_MODEL`** | When images exist |
| **`SERPER_API_KEY`** | `webSearch` tool |
| **`NEXT_PUBLIC_XAI_VOICE_PROXY_WS`** | Browser WebSocket URL for realtime drawer |
| **`XAI_REALTIME_MODEL`** / **`XAI_VOICE_PROXY_PORT`** | Proxy script (optional) |

See **`.env.example`** for commented templates.

---

## 11. File map (quick reference)

```
app/api/chat/route.ts           # streamText + tools + UIMessage stream
app/api/chat/extract-pdf/route.ts
app/api/chat/tts/route.ts
app/api/chat/stt/route.ts
lib/chat-system.ts
lib/chat-tools.ts
lib/serper-search.ts
lib/chat-has-image.ts
lib/chat-citations.ts
lib/chat-message-plain.ts
lib/chat-tts-plain.ts
components/chat/chat-widget.tsx
components/chat/chat-markdown.tsx
components/chat/chat-tool-part.tsx
components/chat/chat-user-parts.tsx
components/chat/voice-realtime-drawer.tsx
components/providers/app-providers.tsx   # ChatWidget + Lenis (non-studio)
scripts/xai-voice-proxy.mjs
```

---

## 12. Operational notes

- **Rate limits / abuse:** Not implemented in code documented here; consider IP/session limits on **`/api/chat`** and expensive routes for public widgets.
- **Realtime voice in production:** Prefer **ephemeral client secrets** (xAI docs) over exposing a long-lived proxy; the current proxy is aimed at **local/dev validation**.
- **PDF limits:** Extraction is bounded by size and character cap; very large PDFs are truncated (`truncated: true`).

---

*Last updated to match the codebase structure as of this document’s authoring.*
