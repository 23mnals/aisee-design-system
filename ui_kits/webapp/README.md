# aisee Web App UI Kit

A high-fidelity interactive recreation of the aisee web application, updated to the v6 design specification.

## Design Width
1440px desktop. Sidebar: 224px. Header: 70px. Main content padding: 24–32px.

## Typography and themes

- The dApp loads and uses **Karla only**. Gotu belongs to Homepage / Brand and must not be introduced here.
- Analysis uses lime `#CFFF29`; Post Agent and Engage use yellow `#FFE253`.
- Analysis / Post Agent / Engage are three peer modules in the module toggle.

## Screens Included
| Screen | Description |
|---|---|
| **Dashboard** | Stat cards (AI Visibility, Citation Score, Posts), recent posts list, AI Rankings bar chart, credits progress |
| **Calendar** | Month grid with post dots, day view with scheduled posts |
| **Channels** | Connected platform list (X, LinkedIn, Reddit, TikTok, YouTube) |
| **Post Agent** | AI agent cards with status, run/edit controls |
| **All Posts** | Filtered post list (All / Scheduled / Sent / Draft / Failed) |

## Interactive Features
- Click sidebar items to switch screens
- Click **New** or any CTA to open the Create Post modal
- Type in the post editor — character count counts down from 280
- Click Analysis / Post Agent / Engage tab toggle to switch modes
- Active screen persists via localStorage

## Components (`Components.jsx`)
| Component | Props |
|---|---|
| `LogoMark` | `size`, `darkFace` |
| `AppHeader` | `activeNav`, `credits` |
| `Sidebar` | `activeItem`, `tab` |
| `StatCard` | `label`, `value`, `unit`, `sub`, `accent` |
| `PostCard` | `content`, `platform`, `status`, `time` |
| `ChannelBadge` | `name`, `connected` |
| `CalDay` | `day`, `hasPost`, `active` |
| `Dropdown` | `items`, `selected` |
| `CreatePostModal` | `onClose` |

`public/legacy/webapp-components.txt` is generated from `Components.jsx` by the dev/build scripts for the standalone Babel preview. Edit only `Components.jsx`.

## Usage
```html
<link rel="stylesheet" href="../../src/tokens/tokens.css">
<script type="text/babel" src="Components.jsx"></script>
```

Then use components in your `<script type="text/babel">` block.
