---
name: aisee-design
description: Build or review aisee dApp interfaces using the v6 design system, module-aware themes, tokens and React components.
user-invocable: true
---

# aisee dApp Design System

1. Read `README.md` and `docs/aisee-dapp-design.v6.md` before creating an aisee dApp surface.
2. Import tokens or components from this package. Do not duplicate literal colors when a token exists.
3. Set `data-aisee-theme` to `analysis`, `post-agent`, or `engage` on the nearest `.aisee-root` container.
4. Use Karla for all dApp text, including code, data and score gauges. Never load Gotu, JetBrains Mono or Digital Numbers in the dApp. Homepage may use Karla and Gotu.
5. Keep motion functional, at or below 300ms, and respect reduced motion.
6. Verify the result with `npm run check` and visually inspect the documentation site.

For a new component, follow `CONTRIBUTING.md`. Product rules and copy remain outside this skill's authority.
