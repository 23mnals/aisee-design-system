# Engage feature — aisee-agent repo handoff

This folder is a re-implementation of the `engage/` prototype, rewritten to follow the
conventions of the `aisee-live/aisee-agent` Next.js repo.

## Preview

Open `../Engage (Aisee).html` to see it running.

## File mapping into the real repo

When dropping this into `aisee-live/aisee-agent`, files map as follows. The `.jsx` files
in this folder are written so they can be renamed to `.tsx` with only minor type-annotation
additions.

| This folder                       | Repo path                                                    |
| --------------------------------- | ------------------------------------------------------------ |
| `page.jsx`                        | `app/(pages)/engage/page.tsx`                                |
| `engage-banner.jsx`               | `app/(pages)/engage/_components/engage-banner.tsx`           |
| `initial-config.jsx`              | `app/(pages)/engage/_components/initial-config.tsx`          |
| `signal-feed.jsx`                 | `app/(pages)/engage/_components/signal-feed.tsx`             |
| `feed-card.jsx`                   | `app/(pages)/engage/_components/feed-card.tsx`               |
| `filter-bar.jsx`                  | `app/(pages)/engage/_components/filter-bar.tsx`              |
| `reply-panel.jsx`                 | `app/(pages)/engage/_components/reply-panel.tsx`             |
| `keywords-accounts.jsx`           | `app/(pages)/engage/_components/keywords-accounts.tsx`       |
| `sent-tab.jsx`                    | `app/(pages)/engage/_components/sent-tab.tsx`                |
| `data.jsx`                        | `app/(pages)/engage/_lib/data.ts`                            |
| `icons.jsx`                       | inlined (or moved to `components/icons/engage.tsx`)          |
| `ui-shims.jsx` + `layout-shell.jsx` | **NOT** copied — the real repo already provides these via `@/components/ui/*` and `app/layout.tsx` |

## Conventions followed

- **Tailwind v4 colour tokens** — uses `bg-yellow-ffe253`, `bg-yellow-fff2b3`, `bg-yellow-fffadd`,
  `bg-gray-fafafa`, `bg-red-ec5212`, `bg-green-cfff29`, `text-primary` etc. — all defined in
  the repo's `app/globals.css`.
- **`font-karla` / `font-gotu`** — wired up through `app/layout.tsx`'s `localFont` calls.
- **`cn()` helper** from `@/lib/cn`.
- **`Button`** with variants `primary`, `secondary`, `outlined`, `icon`, `yellow_bg` from `@/components/ui/button`.
- **`Switch`** from `@/components/ui/switch`.
- **`DropdownMenu*`** from `@/components/ui/dropdown-menu`.
- **`Dialog*`** from `@/components/ui/dialog`.
- **`Input`** from `@/components/ui/input`.
- **Lucide icons** (`lucide-react`) — already a project dependency.
- **Layout** — `Header` + `Slidebar` already provided by `app/layout.tsx`, so the page-level
  component just renders content.

## Diffs vs. the original prototype

- Replaced custom CSS classes (`.cb`, `.kw-row`, `.feed-card`, `.reply-panel`, …) with
  Tailwind utility classes using the repo's colour palette.
- Replaced custom switch markup with `<Switch>` from `@/components/ui/switch`.
- Replaced manual dropdown panes with `<DropdownMenu*>` from the repo's UI kit.
- Replaced the lucide-style hand-drawn SVG icon set with `lucide-react` imports.
- Replaced custom `.btn-primary` / `.gen-btn` with `<Button variant>` variants that the repo
  already defines.
- Banner background still uses the lavender / lime accent the design called for, but rendered
  as a `bg-purple-fae2fe` / `bg-green-f0ffba` Tailwind utility from the repo's palette.
