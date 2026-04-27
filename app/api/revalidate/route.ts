import { revalidateTag } from "next/cache";

/** Sanity webhook → POST with Authorization: Bearer SANITY_REVALIDATE_SECRET */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidateTag("sanity", "default");

  return Response.json({ revalidated: true, tag: "sanity" });
}
