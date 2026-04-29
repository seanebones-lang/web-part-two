"use client";

import { useChat } from "@ai-sdk/react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Crown,
  Headphones,
  Keyboard,
  Loader2,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AssistantChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatToolPartRow } from "@/components/chat/chat-tool-part";
import { ChatUserParts } from "@/components/chat/chat-user-parts";
import { VoiceRealtimeDrawer } from "@/components/chat/voice-realtime-drawer";
import { getMessagePlainText, plainTextForSpeech } from "@/lib/chat-message-plain";
import type { XaiVoiceId } from "@/lib/xai-voices";
import { DEFAULT_VOICE, XAI_VOICES } from "@/lib/xai-voices";
import { cn } from "@/lib/utils";
import {
  DefaultChatTransport,
  getToolName,
  isReasoningUIPart,
  isTextUIPart,
  isToolUIPart,
  type UIMessage,
} from "ai";

const CHAT_STORAGE_KEY = "nexteleven-chat-messages-v2";
const VOICE_STORAGE_KEY = "nexteleven-chat-voice";

/** Sent when the empty-state CTA is used — tuned to invoke listAssistantCapabilities. */
const FLAGSHIP_FEATURES_REQUEST =
  "List the flagship features of this assistant as a concise bullet list.";

const FOLLOWUP_POOL = [
  "How do you structure eval harnesses for retrieval-heavy assistants?",
  "What does observability look like for LLM features in production?",
  "How would you phase a pilot before enterprise-wide rollout?",
  "What stacks do you recommend for low-latency streaming UIs?",
  "Explain guardrail layers from prompt to runtime enforcement.",
  "How do you ship multimodal (voice + vision) without brittle UX?",
  "What security review patterns do you use for customer-facing AI?",
  "How do you mix deterministic code vs LLM reasoning at boundaries?",
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_FILES = 6;
const MAX_PDF_FILES = 3;
const MAX_PDF_BYTES = 18 * 1024 * 1024;
const AUTO_FOLLOW_UNLOCK_PX = 96;
const AUTO_SCROLL_GUARD_PX = 120;

type PdfPart = {
  id: string;
  name: string;
  text: string;
  status: "extracting" | "ready" | "error";
  error?: string;
};

function followupsForTurn(turn: number): string[] {
  const out: string[] = [];
  const n = FOLLOWUP_POOL.length;
  const base = ((turn * 3) % n) + n;
  for (let i = 0; i < 3; i++) {
    out.push(FOLLOWUP_POOL[(base + i) % n]);
  }
  return out;
}

type LocalAttachment = { id: string; file: File; url: string };

function isVoiceId(v: string): v is XaiVoiceId {
  return XAI_VOICES.some((x) => x.id === v);
}

function downloadText(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const TOOL_GROUNDING_LABEL: Record<string, string> = {
  webSearch: "Web search",
  getContactInfo: "Contact",
  getSiteLinks: "Site links",
  listAssistantCapabilities: "Capabilities",
};

function labelsForAssistantTools(message: UIMessage): string[] {
  const out: string[] = [];
  for (const p of message.parts ?? []) {
    if (!isToolUIPart(p)) continue;
    if (p.state !== "output-available" && p.state !== "output-error") continue;
    const n = getToolName(p);
    out.push(TOOL_GROUNDING_LABEL[n] ?? n);
  }
  return out;
}

function friendlyChatError(message: string): string {
  const m = message.trim();
  if (/503|not configured|XAI_API_KEY/i.test(m)) {
    return `${m} Add XAI_API_KEY where this app is hosted and redeploy.`;
  }
  if (/fetch|network|failed to fetch|load failed/i.test(m)) {
    return `Could not reach the assistant (${m}). Check your connection and try again.`;
  }
  return m;
}

export function ChatWidget({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [voiceId, setVoiceId] = useState<XaiVoiceId>(DEFAULT_VOICE);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [ttsLoading, setTtsLoading] = useState<number | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "transcribing">(
    "idle",
  );
  const [copiedAll, setCopiedAll] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [pdfParts, setPdfParts] = useState<PdfPart[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [voiceDrawerOpen, setVoiceDrawerOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [autoFollowEnabled, setAutoFollowEnabled] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  /** Keeps auto-follow disabled when user scrolls up to read prior output. */
  const shouldAutoScrollRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const skipVoiceSave = useRef(true);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const {
    messages,
    sendMessage,
    status,
    stop,
    regenerate,
    error,
    setMessages,
    clearError,
  } = useChat({
    id: "nexteleven-marketing-chat",
    transport,
    experimental_throttle: 42,
    onFinish: ({ messages: next }) => {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
  });

  const pending = status === "submitted" || status === "streaming";
  const pdfBusy = pdfParts.some((p) => p.status === "extracting");

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  const setAutoFollow = useCallback((next: boolean) => {
    shouldAutoScrollRef.current = next;
    setAutoFollowEnabled((prev) => (prev === next ? prev : next));
  }, []);

  function isNearBottom(el: HTMLDivElement, threshold = 72) {
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    return remaining <= threshold;
  }

  async function ingestPdfFile(file: File) {
    const activeCount = pdfParts.filter((p) => p.status !== "error").length;
    if (activeCount >= MAX_PDF_FILES) return;
    if (file.size > MAX_PDF_BYTES) return;

    const id = crypto.randomUUID();
    setPdfParts((prev) => [...prev, { id, name: file.name, text: "", status: "extracting" }]);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/chat/extract-pdf", { method: "POST", body: fd });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Extract failed");
      setPdfParts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "ready" as const, text: data.text ?? "" } : p,
        ),
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "PDF extract failed";
      setPdfParts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "error", error: msg } : p)),
      );
    }
  }

  function ingestFiles(fileList: FileList | File[] | null) {
    if (!fileList?.length) return;
    const arr = Array.from(fileList);
    const imageFiles: File[] = [];

    for (const file of arr) {
      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        void ingestPdfFile(file);
        continue;
      }
      if (file.type.startsWith("image/")) {
        imageFiles.push(file);
      }
    }

    if (!imageFiles.length) return;

    setAttachments((prev) => {
      const next = [...prev];
      for (const file of imageFiles) {
        if (file.size > MAX_IMAGE_BYTES) continue;
        if (next.length >= MAX_IMAGE_FILES) break;
        if (next.some((x) => x.file.name === file.name && x.file.size === file.size)) continue;
        next.push({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
        });
      }
      return next;
    });
  }

  function removePdfPart(id: string) {
    setPdfParts((prev) => prev.filter((p) => p.id !== id));
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const x = prev.find((a) => a.id === id);
      if (x) URL.revokeObjectURL(x.url);
      return prev.filter((a) => a.id !== id);
    });
  }

  useEffect(() => {
    return () => {
      attachments.forEach((a) => URL.revokeObjectURL(a.url));
    };
  }, [attachments]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(VOICE_STORAGE_KEY);
        if (raw && isVoiceId(raw)) setVoiceId(raw);
      } catch {
        /* ignore */
      } finally {
        skipVoiceSave.current = false;
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (skipVoiceSave.current) return;
    try {
      localStorage.setItem(VOICE_STORAGE_KEY, voiceId);
    } catch {
      /* ignore */
    }
  }, [voiceId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as UIMessage[];
      if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
    } catch {
      /* ignore */
    }
  }, [setMessages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!shouldAutoScrollRef.current) return;
    if (!isNearBottom(el, 120)) return;
    el.scrollTo({
      top: el.scrollHeight,
      // Keep this instant for smoother continuous stream updates.
      behavior: "auto",
    });
  }, [messages, pending]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (recRef.current?.state === "recording") recRef.current.stop();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (toolsMenuOpen) setToolsMenuOpen(false);
      else if (voiceDrawerOpen) setVoiceDrawerOpen(false);
      else if (shortcutsOpen) setShortcutsOpen(false);
      else if (open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shortcutsOpen, toolsMenuOpen, voiceDrawerOpen]);

  useEffect(() => {
    if (!toolsMenuOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (!toolsMenuRef.current?.contains(e.target as Node)) setToolsMenuOpen(false);
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [toolsMenuOpen]);

  const stopPlayback = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setPlayingIndex(null);
  }, []);

  const playTts = useCallback(
    async (index: number, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (playingIndex === index) {
        stopPlayback();
        return;
      }

      stopPlayback();
      setTtsLoading(index);
      setTtsError(null);

      try {
        const res = await fetch("/api/chat/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: trimmed,
            voice_id: voiceId,
            language: "en",
          }),
        });

        if (!res.ok) {
          let msg = `TTS failed (${res.status})`;
          try {
            const errBody = await res.json();
            if (
              errBody &&
              typeof errBody === "object" &&
              "error" in errBody &&
              typeof (errBody as { error: unknown }).error === "string"
            ) {
              msg = (errBody as { error: string }).error;
            }
          } catch {
            /* ignore */
          }
          throw new Error(msg);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
          audioRef.current = null;
          setPlayingIndex(null);
        };
        audio.onerror = () => {
          stopPlayback();
        };
        setPlayingIndex(index);
        await audio.play();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not play audio.";
        setTtsError(msg);
      } finally {
        setTtsLoading(null);
      }
    },
    [playingIndex, stopPlayback, voiceId],
  );

  async function startRecording() {
    clearError();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const rec = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };

      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const blobType = mime || rec.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: blobType });
        chunksRef.current = [];

        if (blob.size < 120) {
          setVoiceStatus("idle");
          return;
        }

        setVoiceStatus("transcribing");
        try {
          const fd = new FormData();
          fd.append("file", blob, "speech.webm");
          const res = await fetch("/api/chat/stt", { method: "POST", body: fd });
          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            const msg =
              data &&
              typeof data === "object" &&
              "error" in data &&
              typeof (data as { error: unknown }).error === "string"
                ? (data as { error: string }).error
                : `Voice transcription failed (${res.status})`;
            throw new Error(msg);
          }

          const text =
            data &&
            typeof data === "object" &&
            "text" in data &&
            typeof (data as { text: unknown }).text === "string"
              ? (data as { text: string }).text.trim()
              : "";

          if (text) setInput((prev) => (prev ? `${prev.trimEnd()} ${text}` : text));
        } catch (e) {
          console.error(e);
        } finally {
          setVoiceStatus("idle");
        }
      };

      rec.start(400);
      recRef.current = rec;
      setVoiceStatus("recording");
    } catch {
      setVoiceStatus("idle");
    }
  }

  function stopRecording() {
    if (recRef.current?.state === "recording") recRef.current.stop();
    recRef.current = null;
    setVoiceStatus((s) => (s === "recording" ? "idle" : s));
  }

  function toggleMic() {
    if (voiceStatus === "transcribing") return;
    if (voiceStatus === "recording") stopRecording();
    else void startRecording();
  }

  function submitComposer() {
    const pdfBusy = pdfParts.some((p) => p.status === "extracting");
    if (pdfBusy || pending) return;

    const text = input.trim();
    const readyPdfs = pdfParts.filter((p) => p.status === "ready");
    const pdfBlocks = readyPdfs
      .map((p) => {
        const body = p.text.trim();
        return body ? `### Document: ${p.name}\n${body}` : "";
      })
      .filter(Boolean);
    const pdfBlob = pdfBlocks.join("\n\n---\n\n");

    let mergedText = text;
    if (pdfBlob) mergedText = text ? `${pdfBlob}\n\n---\n\n${text}` : pdfBlob;

    if (!mergedText.trim() && attachments.length === 0) return;

    clearError();
    setTtsError(null);
    setAutoFollow(true);

    const dt = new DataTransfer();
    attachments.forEach((a) => dt.items.add(a.file));

    if (attachments.length && !mergedText.trim()) {
      void sendMessage({
        text: "Analyze the attached image(s) and respond concisely.",
        files: dt.files,
      });
    } else if (attachments.length) {
      void sendMessage({ text: mergedText, files: dt.files });
    } else {
      void sendMessage({ text: mergedText });
    }

    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
    setPdfParts([]);
    setInput("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submitComposer();
  }

  function onComposerKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComposer();
    }
  }

  async function copyConversation() {
    const lines = messages.map((m) => {
      const t = getMessagePlainText(m);
      return m.role === "user" ? `**You**\n${t}` : `**Assistant**\n${t}`;
    });
    const md = lines.join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function exportMarkdownFile() {
    const md = messages
      .map((m) => {
        const t = getMessagePlainText(m);
        return m.role === "user" ? `## You\n\n${t}` : `## Assistant\n\n${t}`;
      })
      .join("\n\n---\n\n");
    downloadText(
      `nexteleven-chat-${new Date().toISOString().slice(0, 10)}.md`,
      md,
      "text/markdown;charset=utf-8",
    );
  }

  function exportJsonFile() {
    downloadText(
      `nexteleven-chat-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(messages, null, 2),
      "application/json;charset=utf-8",
    );
  }

  function clearConversation() {
    stopPlayback();
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
    setPdfParts([]);
    setMessages([]);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    clearError();
    setTtsError(null);
  }

  function jumpToLatest() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: pending ? "auto" : "smooth" });
    setAutoFollow(true);
  }

  const panelHeight = expanded
    ? "h-[min(92dvh,calc(100dvh-2rem))]"
    : "h-[min(580px,calc(100dvh-5rem))]";

  const panelWidth = expanded
    ? "w-[calc(100vw-1rem)] sm:w-[min(calc(100vw-2rem),520px)]"
    : "w-[calc(100vw-1rem)] sm:w-[min(calc(100vw-2rem),440px)]";

  return (
    <div
      className="fixed z-[60] flex flex-col items-end gap-3"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
        right: "max(1.25rem, env(safe-area-inset-right, 1.25rem))",
      }}
    >
      <AnimatePresence>
        {shortcutsOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass-panel mb-2 w-[min(100vw-2rem,320px)] rounded-2xl border border-[var(--border-subtle)] p-4 text-xs text-[var(--text-muted)] shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between font-semibold text-[var(--text-primary)]">
              Shortcuts
              <button
                type="button"
                className="rounded p-1 hover:bg-white/10"
                onClick={() => setShortcutsOpen(false)}
                aria-label="Close shortcuts"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              <li>
                <kbd className="rounded bg-white/10 px-1">Enter</kbd> send ·{" "}
                <kbd className="rounded bg-white/10 px-1">Shift</kbd>+
                <kbd className="rounded bg-white/10 px-1">Enter</kbd> newline
              </li>
              <li>
                <kbd className="rounded bg-white/10 px-1">Esc</kbd> close panel / shortcuts
              </li>
              <li>
                Drop images or PDFs on the composer — images use vision; PDFs are excerpted via the server.{" "}
                <kbd className="rounded bg-white/10 px-1">Paperclip</kbd> attaches files.
              </li>
              <li>Stop halts streaming · Regenerate retries the last reply · Clear wipes storage</li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className={cn(
              "glass-panel glass-panel--static flex flex-col overflow-hidden shadow-[0_0_48px_-12px_var(--accent-glow)]",
              panelHeight,
              panelWidth,
              pending && "chat-flagship-streaming",
            )}
          >
            <div
              className={cn(
                "border-b border-[var(--border-subtle)] px-4",
                headerCollapsed ? "py-2" : "flex flex-col gap-1.5 py-2.5",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <Sparkles className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
                    NextEleven Assistant
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.12] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                      <Crown className="h-3 w-3" aria-hidden />
                      Flagship
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => setHeaderCollapsed((v) => !v)}
                    title={headerCollapsed ? "Expand header" : "Collapse header"}
                    className="neon-hover rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                    aria-label={headerCollapsed ? "Expand chat header" : "Collapse chat header"}
                    aria-pressed={headerCollapsed}
                  >
                    {headerCollapsed ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    title={expanded ? "Compact" : "Expand"}
                    className="neon-hover hidden rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] sm:inline-flex"
                    aria-label={expanded ? "Compact chat" : "Expand chat"}
                  >
                    <Maximize2 className={`h-4 w-4 ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceDrawerOpen((v) => !v)}
                    title="Realtime voice (local proxy)"
                    className="neon-hover hidden rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] sm:inline-flex"
                    aria-label="Realtime voice proxy"
                    aria-pressed={voiceDrawerOpen}
                  >
                    <Headphones className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void copyConversation()}
                    disabled={!messages.length}
                    title="Copy conversation"
                    className="neon-hover rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] disabled:opacity-30"
                    aria-label="Copy conversation"
                  >
                    {copiedAll ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <div className="relative" ref={toolsMenuRef}>
                    <button
                      type="button"
                      onClick={() => setToolsMenuOpen((v) => !v)}
                      title="More actions"
                      className="neon-hover rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                      aria-label="More actions"
                      aria-expanded={toolsMenuOpen}
                      aria-haspopup="menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {toolsMenuOpen ? (
                      <div
                        className="absolute right-0 top-[calc(100%+0.35rem)] z-40 min-w-44 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/95 p-1.5 shadow-xl"
                        role="menu"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setShortcutsOpen((v) => !v);
                            setToolsMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-white/10"
                          role="menuitem"
                        >
                          <Keyboard className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                          Keyboard shortcuts
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            exportMarkdownFile();
                            setToolsMenuOpen(false);
                          }}
                          disabled={!messages.length}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-white/10 disabled:opacity-40"
                          role="menuitem"
                        >
                          Download .md
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            exportJsonFile();
                            setToolsMenuOpen(false);
                          }}
                          disabled={!messages.length}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-white/10 disabled:opacity-40"
                          role="menuitem"
                        >
                          Download .json
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            clearConversation();
                            setToolsMenuOpen(false);
                          }}
                          disabled={!messages.length || pending}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-rose-200 hover:bg-rose-400/20 disabled:opacity-40"
                          role="menuitem"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Clear conversation
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setToolsMenuOpen(false);
                      setOpen(false);
                    }}
                    className="neon-hover rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!headerCollapsed ? (
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-[var(--text-muted)]">
                <label className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <span className="shrink-0 font-medium uppercase tracking-wider">TTS voice</span>
                  <select
                    value={voiceId}
                    onChange={(e) =>
                      setVoiceId(isVoiceId(e.target.value) ? e.target.value : DEFAULT_VOICE)
                    }
                    disabled={playingIndex !== null || ttsLoading !== null}
                    className="max-w-[14rem] flex-1 rounded-lg border border-[var(--border-subtle)] bg-black/40 px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50"
                  >
                    {XAI_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label} — {v.hint}
                      </option>
                    ))}
                  </select>
                </label>
                {messages.length > 0 ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void regenerate()}
                    title="Regenerate last reply"
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2 py-1 text-[10px] font-medium text-[var(--accent)] hover:bg-white/5 disabled:opacity-40"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </button>
                ) : null}
                </div>
              ) : null}
            </div>

            <div className="relative flex flex-1 flex-col gap-2 overflow-hidden">
              <div
                ref={scrollRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const scrollingUp = el.scrollTop < lastScrollTopRef.current;
                  lastScrollTopRef.current = el.scrollTop;
                  const nearBottom = isNearBottom(el, pending ? AUTO_SCROLL_GUARD_PX : AUTO_FOLLOW_UNLOCK_PX);

                  if (scrollingUp) {
                    setAutoFollow(false);
                    return;
                  }

                  if (nearBottom) setAutoFollow(true);
                }}
                data-lenis-prevent
                className="chat-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 px-2 py-10 text-center">
                    <p className="max-w-[18rem] text-sm leading-relaxed text-[var(--text-muted)]">
                      Ask me for a list of flagship features.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        clearError();
                        setTtsError(null);
                        setAutoFollow(true);
                        void sendMessage({ text: FLAGSHIP_FEATURES_REQUEST });
                      }}
                      disabled={pending}
                      className="rounded-full border border-[var(--accent)]/45 bg-[var(--accent)]/10 px-4 py-2 text-xs font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/15 disabled:opacity-40"
                    >
                      Show flagship features
                    </button>
                  </div>
                ) : null}

                {messages.map((m, i) => {
                  const groundingLabels = m.role === "assistant" ? labelsForAssistantTools(m) : [];
                  return (
                  <div
                    key={m.id ?? `${m.role}-${i}`}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-2 leading-relaxed ${
                        m.role === "user"
                          ? "bg-[var(--accent)] text-[var(--bg-deep)]"
                          : "bg-white/5 text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]"
                      }`}
                    >
                      {m.role === "user" ? (
                        <ChatUserParts message={m} />
                      ) : (
                        <div className="space-y-3">
                          {m.parts?.map((part, pi) => {
                            if (isTextUIPart(part)) {
                              if (!part.text.trim() && part.state === "streaming") {
                                return (
                                  <span
                                    key={`${m.id}-t-${pi}`}
                                    className="inline-flex items-center gap-2 text-[var(--text-muted)]"
                                  >
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                    Streaming…
                                  </span>
                                );
                              }
                              return (
                                <AssistantChatMarkdown
                                  key={`${m.id}-t-${pi}`}
                                  message={m}
                                  streaming={part.state === "streaming"}
                                >
                                  {part.text}
                                </AssistantChatMarkdown>
                              );
                            }
                            if (isReasoningUIPart(part)) {
                              return (
                                <details
                                  key={`${m.id}-r-${pi}`}
                                  className="rounded-lg border border-white/10 bg-black/30 text-[11px] text-[var(--text-muted)]"
                                >
                                  <summary className="cursor-pointer px-2 py-1 font-medium text-[var(--text-primary)]">
                                    Reasoning
                                  </summary>
                                  <div className="border-t border-white/10 px-2 py-2 whitespace-pre-wrap">
                                    {part.text}
                                  </div>
                                </details>
                              );
                            }
                            if (isToolUIPart(part)) {
                              return <ChatToolPartRow key={`${m.id}-k-${pi}`} part={part} />;
                            }
                            return null;
                          })}

                          {groundingLabels.length ? (
                            <p className="border-t border-white/10 pt-2 text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]/90">
                              Grounded · {groundingLabels.join(" · ")}
                            </p>
                          ) : null}

                          {getMessagePlainText(m).trim() ? (
                            <div className="flex flex-wrap items-center gap-1 border-t border-white/10 pt-2">
                              <button
                                type="button"
                                onClick={() => void playTts(i, plainTextForSpeech(getMessagePlainText(m)))}
                                disabled={ttsLoading !== null && ttsLoading !== i}
                                title={playingIndex === i ? "Stop audio" : "Read aloud (xAI TTS)"}
                                className="neon-hover inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--accent)] hover:bg-white/10 disabled:opacity-40"
                              >
                                {ttsLoading === i ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : playingIndex === i ? (
                                  <Square className="h-3.5 w-3.5 fill-current" />
                                ) : (
                                  <Volume2 className="h-3.5 w-3.5" />
                                )}
                                {playingIndex === i ? "Stop" : "Listen"}
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(getMessagePlainText(m));
                                  } catch {
                                    /* ignore */
                                  }
                                }}
                                title="Copy reply"
                                className="neon-hover inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </button>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}

                {messages.length > 0 && !pending && status === "ready" ? (
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] p-3">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                      Suggested follow-ups
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {followupsForTurn(messages.length).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            clearError();
                            setTtsError(null);
                            setAutoFollow(true);
                            void sendMessage({ text: q });
                          }}
                          className="rounded-full border border-[var(--border-subtle)] bg-black/25 px-3 py-1.5 text-left text-[11px] leading-snug text-[var(--text-muted)] transition hover:border-[var(--accent)]/45 hover:text-[var(--text-primary)]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {!autoFollowEnabled && messages.length > 0 ? (
                  <div className="sticky bottom-2 z-20 flex justify-end pr-1">
                    <button
                      type="button"
                      onClick={jumpToLatest}
                      className="rounded-full border border-[var(--accent)]/35 bg-[var(--bg-card)]/92 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--accent)] shadow-[0_0_14px_-10px_var(--accent-glow)]"
                    >
                      Latest
                    </button>
                  </div>
                ) : null}
              </div>


              {error ? (
                <p className="px-4 text-xs text-rose-400" role="alert">
                  {friendlyChatError(error.message)}
                </p>
              ) : null}
              {ttsError ? (
                <p className="px-4 text-xs text-amber-400" role="status">
                  {ttsError}
                </p>
              ) : null}

              <form
                onSubmit={onSubmit}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  ingestFiles(e.dataTransfer.files);
                }}
                className={cn(
                  "border-t border-[var(--border-subtle)] p-3 transition-colors",
                  dragOver && "bg-[var(--accent)]/[0.07]",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    ingestFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                {pdfParts.length > 0 ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {pdfParts.map((p) => (
                      <div
                        key={p.id}
                        className="flex max-w-full items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-white/[0.06] px-2 py-1 text-[10px] text-[var(--text-primary)]"
                      >
                        <span className="min-w-0 truncate font-medium" title={p.name}>
                          {p.name}
                        </span>
                        {p.status === "extracting" ? (
                          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[var(--accent)]" />
                        ) : p.status === "error" ? (
                          <span className="shrink-0 text-rose-400" title={p.error}>
                            Error
                          </span>
                        ) : (
                          <span className="shrink-0 text-emerald-400/90">Ready</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePdfPart(p.id)}
                          className="shrink-0 rounded px-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)]"
                          aria-label={`Remove ${p.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {attachments.length > 0 ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((a) => (
                      <div
                        key={a.id}
                        className="relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-[var(--border-subtle)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- blob preview */}
                        <img src={a.url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(a.id)}
                          className="absolute right-0.5 top-0.5 rounded bg-black/70 px-1 py-0 text-[10px] text-white hover:bg-rose-600"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onComposerKeyDown}
                    placeholder="Message…"
                    rows={2}
                    disabled={voiceStatus === "transcribing"}
                    className="max-h-36 min-h-[44px] flex-1 resize-y rounded-xl border border-[var(--border-subtle)] bg-black/40 px-4 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 disabled:opacity-50"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={pending || attachments.length >= MAX_IMAGE_FILES}
                      title="Attach images or PDFs"
                      className="neon-hover inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white/10 text-[var(--text-primary)] hover:bg-white/15 disabled:opacity-40"
                      aria-label="Attach images or PDFs"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={toggleMic}
                      disabled={pending || voiceStatus === "transcribing"}
                      title={
                        voiceStatus === "recording"
                          ? "Stop recording"
                          : voiceStatus === "transcribing"
                            ? "Transcribing…"
                            : "Speak (xAI STT)"
                      }
                      className={`neon-hover inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-[var(--bg-deep)] disabled:opacity-40 ${
                        voiceStatus === "recording"
                          ? "animate-pulse border-rose-400/60 bg-rose-500/25"
                          : "border-[var(--border-subtle)] bg-white/10 text-[var(--text-primary)] hover:bg-white/15"
                      }`}
                      aria-pressed={voiceStatus === "recording"}
                      aria-label={
                        voiceStatus === "recording" ? "Stop recording" : "Start voice input"
                      }
                    >
                      {voiceStatus === "transcribing" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : voiceStatus === "recording" ? (
                        <MicOff className="h-5 w-5 text-rose-200" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>
                    {pending ? (
                      <button
                        type="button"
                        onClick={() => stop()}
                        title="Stop generating"
                        className="neon-hover inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/20 text-rose-100"
                        aria-label="Stop generating"
                      >
                        <Square className="h-4 w-4 fill-current" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={
                          pdfBusy ||
                          (!input.trim() &&
                            attachments.length === 0 &&
                            !pdfParts.some((p) => p.status === "ready" && p.text.trim())) ||
                          voiceStatus === "transcribing"
                        }
                        className="neon-hover inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--bg-deep)] disabled:opacity-40"
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-[10px] leading-snug text-[var(--text-muted)]">
                  Flagship chat · tools + RAG + voice · attach files · Esc closes
                </p>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <VoiceRealtimeDrawer open={voiceDrawerOpen} onClose={() => setVoiceDrawerOpen(false)} />

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          clearError();
          setTtsError(null);
        }}
        className="chat-launcher-flagship glass-panel glass-panel--static inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_22px_-10px_var(--accent-glow)] ring-1 ring-[var(--accent)]/35 hover:ring-[var(--accent)]/80"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="h-6 w-6 text-[var(--accent)]" />
      </button>
    </div>
  );
}
