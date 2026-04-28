export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return Response.json(
      { error: "Voice input is not configured. Add XAI_API_KEY to your environment." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return Response.json({ error: "file field required" }, { status: 400 });
  }

  const outbound = new FormData();
  outbound.append("file", file, "recording.webm");

  const upstream = await fetch("https://api.x.ai/v1/stt", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: outbound,
  });

  const payload = await upstream.json().catch(async () => ({
    error: await upstream.text(),
  }));

  if (!upstream.ok) {
    const msg =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : JSON.stringify(payload);
    return Response.json(
      { error: msg || `STT failed (${upstream.status})` },
      { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
    );
  }

  const text =
    typeof payload === "object" &&
    payload !== null &&
    "text" in payload &&
    typeof (payload as { text: unknown }).text === "string"
      ? (payload as { text: string }).text.trim()
      : "";

  if (!text) {
    return Response.json({ error: "No transcript returned" }, { status: 422 });
  }

  return Response.json({ text });
}
