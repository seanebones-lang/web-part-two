import { createClient } from "next-sanity";

import {
  apiVersion,
  dataset,
  projectId,
  sanityConfigured,
  sanityReadToken,
} from "../env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  /** CDN ignores auth; disable CDN when a read token is present. */
  useCdn: !sanityReadToken,
  token: sanityReadToken || undefined,
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
    next: {
      tags: tags?.length ? tags : ["sanity"],
      // Fallback freshness if webhook is delayed/misconfigured.
      revalidate: 30,
    },
  });
}
