import { PDFParse } from "pdf-parse";

export const maxDuration = 60;

const MAX_CHARS = 120_000;

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file field required" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return Response.json({ error: "Only application/pdf is supported" }, { status: 400 });
  }

  const maxBytes = 18 * 1024 * 1024;
  if (file.size > maxBytes) {
    return Response.json(
      { error: `PDF too large (max ${Math.round(maxBytes / (1024 * 1024))} MB)` },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());

  try {
    const parser = new PDFParse({ data: buf });
    const textResult = await parser.getText();
    await parser.destroy();
    const raw = textResult.text ?? "";
    const text = raw.slice(0, MAX_CHARS);
    return Response.json({
      text,
      pages: textResult.total ?? null,
      truncated: raw.length > MAX_CHARS,
    });
  } catch {
    return Response.json({ error: "Could not parse PDF" }, { status: 422 });
  }
}
