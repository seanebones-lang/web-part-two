import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, sanityConfigured } from "../env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  useCdn: true,
});

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  tags?: string[],
): Promise<T | null> {
  if (!sanityConfigured()) {
    return null;
  }
  return client.fetch<T>(query, params ?? {}, {
    next: { tags: tags?.length ? tags : ["sanity"] },
  });
}
