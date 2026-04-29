import { client } from "@/sanity/lib/client";

type ProductDebugRow = {
  _id: string;
  name?: string;
  _updatedAt?: string;
  slug?: { current?: string };
};

/**
 * Protected debug endpoint to verify Sanity -> site product sync.
 * Auth: Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const query = `*[_type == "product"] | order(_updatedAt desc){
    _id,
    name,
    _updatedAt,
    slug
  }`;

  const rows = await client.fetch<ProductDebugRow[]>(query, {}, { cache: "no-store" });

  return Response.json({
    ok: true,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? null,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? null,
    count: rows.length,
    latestUpdatedAt: rows[0]?._updatedAt ?? null,
    products: rows.map((r) => ({
      id: r._id,
      name: r.name ?? null,
      slug: r.slug?.current ?? null,
      updatedAt: r._updatedAt ?? null,
    })),
    checkedAt: new Date().toISOString(),
  });
}

