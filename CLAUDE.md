# aisee Design System — working notes

## Always-current components (do not use stale versions)
- **Sidebar / layout shell**: the current navigation is FUNCTION-BASED, not the old
  top-level "Dashboard / Calendar / Channels / Post Agent / Engage / Media" list.
  Source of truth: `engage-aisee-v2/layout-shell.jsx` (`window.Slidebar`) — also compiled
  into `_ds_bundle.js`. Structure:
    - Top 3-tab toggle: Analysis / Post Agent / **Engage** (active tab shows icon+label
      on white; inactive tabs show icon only at 50% opacity).
    - When Engage is active, the nav shows sub-items: **Dashboard / Signal Feed /
      Keywords & Accounts / Replies** (Replies carries a small mustard dot indicator).
    - Footer profile card at the bottom.
  For pages that use `engage/styles.css` (the plain-CSS React pages), use
  `engage/shell-v5.jsx` which mirrors this structure with those classes.
- **Engage banner illustration**: use the ILLUSTRATED mascot (dimensional purple chat-bubble
  character with dot-eyes), NOT a flat outline icon. Asset:
  `engage-aisee-v2/engage-banner-icon.svg` (same as `uploads/engage.svg`).

## Process for every new design
1. After delivering and the user confirms it's good, REVIEW whether the change needs to be
   synced into the relevant `.md` design docs (e.g. `dapp-design.v*.md`, `tokens.md`,
   page architecture docs) and offer to do it.
2. When presenting a design, ANNOTATE the design rationale: explain why it's shown this way,
   what alternative presentations were considered, and the reasoning for the chosen one.
