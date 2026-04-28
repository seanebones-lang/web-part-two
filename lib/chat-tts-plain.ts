/** Strip markdown-ish syntax so xAI TTS reads natural speech (no LaTeX guarantees). */
export function plainTextForTts(markdown: string): string {
  let s = markdown;
  s = s.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  s = s.replace(/\s+/g, " ").trim();
  return s.slice(0, 12000);
}
