type SerperOrganic = {
  title?: string;
  link?: string;
  snippet?: string;
};

type SerperResponse = {
  organic?: SerperOrganic[];
};

export async function runSerperWebSearch(query: string): Promise<
  | {
      ok: true;
      query: string;
      /** 1-based index; assistant should cite as [ref] in prose */
      results: { ref: number; title: string; url: string; snippet: string }[];
    }
  | { ok: false; query: string; error: string }
> {
  const key = process.env.SERPER_API_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      query,
      error: "SERPER_API_KEY is not set on the server.",
    };
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return { ok: false, query, error: "Empty query." };
  }

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: trimmed,
        num: 8,
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        query: trimmed,
        error: raw.slice(0, 400) || `Serper error (${res.status})`,
      };
    }

    let json: SerperResponse;
    try {
      json = JSON.parse(raw) as SerperResponse;
    } catch {
      return { ok: false, query: trimmed, error: "Invalid Serper response." };
    }

    const organic = json.organic ?? [];
    const results = organic
      .filter((o): o is SerperOrganic & { link: string } => typeof o.link === "string")
      .slice(0, 8)
      .map((o, idx) => ({
        ref: idx + 1,
        title: typeof o.title === "string" ? o.title : o.link,
        url: o.link,
        snippet: typeof o.snippet === "string" ? o.snippet : "",
      }));

    return { ok: true, query: trimmed, results };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Serper request failed";
    return { ok: false, query: trimmed, error: msg };
  }
}
