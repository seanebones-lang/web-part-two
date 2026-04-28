export type XaiVoiceId = "eve" | "ara" | "rex" | "sal" | "leo";

export const XAI_VOICES: { id: XaiVoiceId; label: string; hint: string }[] = [
  { id: "eve", label: "Eve", hint: "Energetic default" },
  { id: "ara", label: "Ara", hint: "Warm, conversational" },
  { id: "rex", label: "Rex", hint: "Professional" },
  { id: "sal", label: "Sal", hint: "Neutral, versatile" },
  { id: "leo", label: "Leo", hint: "Authoritative" },
];

export const DEFAULT_VOICE: XaiVoiceId = "eve";
