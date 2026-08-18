# aisee Web App UI Kit

An interactive, multi-page recreation of the current aisee web application shell. The layout baseline is the **Figma 5.5 Growth Loop feature page**, with the Figma 5.7 hosted automatic publishing workflow added as a separate WORKFLOWS destination. Each functional destination is synchronized as a recognisable preview from its current Figma feature area. These previews preserve information architecture and visual language; they are not pixel-perfect production screens.

## Design Width
1440px desktop. Sidebar: 224px expanded / 58px collapsed (icon-only). Header: 70px. Main content padding: 16px.

## Typography and themes

- The dApp loads and uses **Karla only**. Gotu belongs to Homepage / Brand and must not be introduced here.
- The primary shell no longer uses the old Analysis / Post Agent / Engage top module toggle.
- The current information architecture is Project → Overview, followed by the complete Growth Loop: Analysis → Growth → Engage / Post → Verify, with Connection providing the shared account and channel layer.
- Hosted automatic publishing is a separate WORKFLOWS destination named **Automation**; it is not part of INTEGRATIONS.
- Growth uses a pale-green contextual banner and lime progress/action feedback; detailed module components still follow the documented theme rules.

## Screens Included
| Screen | Description |
|---|---|
| **Overview** | Growth banner, AI visibility baseline, task totals, available credits, score trajectory and improvement plan |
| **Analysis** | Entry to diagnosis and AI visibility reporting |
| **Growth** | Growth dashboard plus individual Improve Score and Build Brand Influence previews |
| **Engage** | Engage defaults to Signal Feed, with Keywords & Accounts and Replies previews; the old Dashboard subpage is removed |
| **Post** | Post workspace plus Calendar, Channels and Media previews |
| **Verify** | Before/after visibility, citation lift and verified outcome preview |
| **Connection** | Website, repository, content source and analytics connection preview |
| **Automation** | Hosted automatic publishing workflows with approval gates and recent activity |

## Interactive Features
- Click any sidebar item to switch to that functional preview.
- Use the chevron control in the sidebar to collapse it to 58px (icon-only) or expand it back to 224px; the preference is remembered in the current browser.
- Every page has a dedicated URL hash, for example `index.html#Signal%20Feed`, so teammates can share a specific preview.
- All 16 current destinations contain a representative banner, KPI, list, table, editor, calendar, asset, integration or workflow state; no destination is an empty placeholder.
- New Figma feature destinations must be added to both the sidebar registry and `screens` registry. Automated tests enforce the coverage list.
- Figma page names are only routing hints. For recency and update scope, use the black title bar above each design block as the source of truth.

Navigation icons, notification/logout controls, social platform marks, and user/social avatars are rendered from the read-only StemUI snapshot in `../../assets/stemui/`. Refresh it with `npm run sync:stemui` after the icon package changes; the sync never writes to the StemUI repository.

## Components (`Components.jsx`)
| Component | Props |
|---|---|
| `LogoMark` | `size` — uses official asset, never a CSS redraw |
| `AppHeader` | `credits` — official wordmark plus account controls |
| `Sidebar` | `activeItem`, `credits` — current grouped Growth Loop navigation |
| `StatCard` | `label`, `value`, `unit`, `sub`, `accent` |
| `PostCard` | `content`, `platform`, `status`, `time` |
| `ChannelBadge` | `name`, `connected` |
| `CalDay` | `day`, `hasPost`, `active` |
| `Dropdown` | `items`, `selected` |
| `CreatePostModal` | `onClose` |

`public/legacy/webapp-components.txt` is generated from `Components.jsx` by the dev/build scripts. The main `index.html` is a self-contained, multi-page current reference preview; edit `Components.jsx` when maintaining reusable UI Kit components.

The extracted three-dimensional design profile is stored in [`design-dna-v5.5.json`](design-dna-v5.5.json).

## Usage
```html
<link rel="stylesheet" href="../../src/tokens/tokens.css">
<script type="text/babel" src="Components.jsx"></script>
```

Then use components in your `<script type="text/babel">` block.
