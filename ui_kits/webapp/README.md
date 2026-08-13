# aisee Web App UI Kit

A high-fidelity interactive recreation of the current aisee web application shell. The layout baseline is the **Figma 5.5 Growth Loop feature page** and component behavior continues to follow the v6 design specification.

## Design Width
1440px desktop. Sidebar: 224px. Header: 70px. Main content padding: 24–32px.

## Typography and themes

- The dApp loads and uses **Karla only**. Gotu belongs to Homepage / Brand and must not be introduced here.
- The primary shell no longer uses the old Analysis / Post Agent / Engage top module toggle.
- The current information architecture is Project → Overview, followed by Growth Loop → Analysis, Growth, Engage and Post groups.
- Growth uses a pale-green contextual banner and lime progress/action feedback; detailed module components still follow the documented theme rules.

## Screens Included
| Screen | Description |
|---|---|
| **Overview** | Growth banner, AI visibility baseline, task totals, available credits, score trajectory and improvement plan |
| **Analysis** | Entry to diagnosis and AI visibility reporting |
| **Growth** | Improve Score and Build Brand Influence workflows |
| **Engage** | Signal Feed, Keywords & Accounts and Replies |
| **Post** | Calendar, Channels and Media |

## Interactive Features
- Click sidebar items to switch screens
- Click **New** or any CTA to open the Create Post modal
- Type in the post editor — character count counts down from 280
- Click grouped sidebar items to inspect the 5.5 product information architecture
- Overview is the fully documented current reference screen; detailed destinations are added from their own Figma feature pages without replacing the shell

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

`public/legacy/webapp-components.txt` is generated from `Components.jsx` by the dev/build scripts. The main `index.html` is now a self-contained 5.5 reference preview; edit `Components.jsx` when maintaining reusable UI Kit components.

The extracted three-dimensional design profile is stored in [`design-dna-v5.5.json`](design-dna-v5.5.json).

## Usage
```html
<link rel="stylesheet" href="../../src/tokens/tokens.css">
<script type="text/babel" src="Components.jsx"></script>
```

Then use components in your `<script type="text/babel">` block.
