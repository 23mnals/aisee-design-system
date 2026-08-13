# Engage feature — drop-in TSX modules

This folder mirrors `aisee-agent`'s `app/(pages)/...` convention and is
designed to be **copied verbatim** onto a new branch named
`aisee-agent-test`:

```
aisee-agent-test/
├── app/(pages)/engage/
│   ├── page.tsx
│   ├── _components/*.tsx        ← 14 modular React components
│   ├── _lib/
│   │   ├── types.ts             ← Keyword / Account / FeedPost / ... types
│   │   ├── mock-data.ts         ← typed seed data (imports mock-data.json)
│   │   └── mock-data.json       ← pure JSON payload, swap for an API later
│   └── _styles/engage.css       ← scoped page CSS (ported faithfully)
└── public/images/engage/engage-icon.svg
```

## Suggested git workflow

The standalone Engage prototype is implemented as plain JSX in this design
project. The TSX modules under `aisee-agent-test/` are the production port,
intended to live on a fresh branch off `main` so they don't disturb existing
work:

```sh
# from the root of your local clone of aisee-live/aisee-agent
git fetch origin
git switch -c aisee-agent-test origin/main

# drop in the entire `aisee-agent-test/` folder contents from this design
# project (sans this README) — the layout matches your Next.js app exactly.

git add app/\(pages\)/engage public/images/engage
git commit -m "feat(engage): port standalone Engage prototype to TSX modules"
git push -u origin aisee-agent-test
```

## Code conventions followed

- `"use client"` directive on every component touching React state.
- `cn()` import from `@/lib/cn` for class-name composition.
- `lucide-react` icons (matches existing `components/ui` choices).
- Karla font via `var(--font-karla)`, color tokens via Tailwind v4 (`bg-yellow-ffe253`, etc.) — the engage.css file uses CSS variables compatible with `app/globals.css`.
- `next/image` for the engage SVG icon.
- Mock data as JSON for easy swap with a real API later.

## Module map

| File | Purpose |
|---|---|
| `page.tsx` | Entry. Switches between `InitialConfig` and the tabbed main view. |
| `_components/banner.tsx` | Reusable Engage header banner (lavender + lime variants). |
| `_components/page-tabs.tsx` | Signal Feed / Keywords / Sent tab switcher. |
| `_components/platform-icons.tsx` | `<PlatformX>` and `<PlatformR>` glyphs. |
| `_components/initial-config.tsx` | First-run setup screen with keyword/account/subreddit pickers. |
| `_components/signal-feed.tsx` | Orchestrator: filter bar + feed list + sticky reply panel. |
| `_components/feed-card.tsx` | Single signal card. |
| `_components/filter-bar.tsx` | Source picker + last-sync + inline refine pills. |
| `_components/platform-picker.tsx` | All / X / Reddit dropdown with counts. |
| `_components/filter-dropdown.tsx` | Inline cycling pill (used by FilterBar). |
| `_components/reply-panel.tsx` | Stepped reply flow: strategy → draft → account → send. |
| `_components/keywords-accounts.tsx` | Page 03 — manage keywords, accounts, subreddits. |
| `_components/add-account-modal.tsx` | Verify-then-add modal for X handles. |
| `_components/add-subreddit-modal.tsx` | Find-then-add modal for subreddits. |
| `_components/sent.tsx` | History of replies the agent has shipped. |

## What is *not* included

- No real network calls — every page sources from `mock-data.json`. Swap with `fetch()` + a route handler when the API is ready.
- Shared sidebar / app header are assumed to come from a `layout.tsx` parent (the standalone HTML mocks them; the Next layout already provides equivalents).
- Speaker notes / animations / tweak panels (these are design-tool concepts, not product runtime).
