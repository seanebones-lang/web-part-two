# NextEleven marketing site

Next.js 16 (App Router, React 19, Tailwind CSS 4) with embedded **Sanity Studio** at `/studio`, dark-premium UI (motion + Lenis smooth scroll), and a floating **xAI (Grok)** chat widget.

## Quick start

```bash
npm install
cp .env.example .env.local
```

Fill in Sanity and (optionally) xAI keys, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and the CMS at [http://localhost:3000/studio](http://localhost:3000/studio).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (e.g. `production`) |
| `SANITY_REVALIDATE_SECRET` | Shared secret for `/api/revalidate` webhook |
| `XAI_API_KEY` | Enables streaming chat against `https://api.x.ai/v1` |
| `XAI_MODEL` | Optional model override (defaults to `grok-2-latest`) |

Without Sanity env vars, pages still render using **fallback copy** for products and empty CMS lists.

Without `XAI_API_KEY`, `/api/chat` returns `503` and the widget surfaces the error message.

## Sanity content types

Defined in [`sanity/schemas/`](sanity/schemas/): **Dev Updates**, **Products**, **Portfolio**, **Links**, **Announcements**, **Site settings**, plus shared block content.

## Publish revalidation

Configure a Sanity webhook (HTTP POST) to:

`https://<your-domain>/api/revalidate`

Headers:

`Authorization: Bearer <SANITY_REVALIDATE_SECRET>`

Tag-based cache invalidation uses the `sanity` tag on `next-sanity` fetches.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
