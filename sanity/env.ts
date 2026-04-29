export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

/** Server-only — never prefix with NEXT_PUBLIC. Used for Vision / CLI / elevated reads. */
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

export function sanityConfigured(): boolean {
  return Boolean(projectId && dataset);
}
