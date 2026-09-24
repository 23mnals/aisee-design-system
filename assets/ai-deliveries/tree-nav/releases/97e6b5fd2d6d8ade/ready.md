# Integrate AISEE TreeNav

Production delivery version: 97e6b5fd2d6d8ade. Installer SHA-256: c1c39f963f1e3c48d257af6322651c8c01f19a235ac6bb12b76abf563b38671e

## Host Project Compatibility — before installation

Integration mode: host-first. Do not assume the host uses AISEE primitives.

1. Inspect the host package.json, lockfile, existing UI imports, custom primitives, theme/providers and global styles before downloading/executing the installer or adding dependencies. Identify shadcn/ui, Radix, MUI, Ant Design, Chakra, Headless UI or project-specific primitives from actual files; names alone do not establish compatibility.
2. For each declared primitive below, prefer an existing compatible host implementation. Check its installed API/version, refs, DOM/state hooks, controlled state, accessibility and required capabilities. A styled host component is reusable only if its default visuals can be neutralized locally while retaining AISEE visuals. Do not install another complete UI framework for one AISEE component.
3. Third-party primitives may supply only underlying capabilities (focus management, portal, positioning, dialog accessibility or native control semantics). Keep the delivered AISEE implementation as the visual/behavior reference. Adapt only the declared primitive boundaries via a local adapter; preserve every requirement below, including states, layout, icons, animations, keyboard behavior and reduced motion. Do not replace the component with a host library's default-looking widget. Preserve public props and ref behavior; if required native element APIs cannot be preserved, use standalone.
4. If no existing primitive satisfies all requirements, use the delivered standalone implementation for that boundary and state the concrete missing capability. No primitives listed means there is no library-level primitive boundary to replace. Do not install AISEE's whole library or invent unnecessary adapters. The source installer only unpacks a verified standalone baseline; it does not detect or modify the host framework automatically.
5. Scope all AISEE CSS and local overrides to the component, including portalled content. Never emit unscoped button/input/svg/body/reset rules, global token overrides, or replace the host theme/provider/global styles. Reuse compatible host fonts/tokens/dependencies without losing AISEE's required appearance; use local fallbacks where tokens differ. Reuse an existing provider only when required by the chosen primitive; never add or replace a global provider merely for AISEE.
6. Briefly report the detected host stack and chosen adapter/standalone boundaries. Verify visual/state/motion parity, keyboard/focus return, portal layering and positioning, reduced motion and host typecheck/build. Avoid duplicate focus traps, Escape/outside-click listeners or competing positioning/animation transforms. Document any unmet capability instead of silently changing the design.

### Adaptable primitive boundaries
- tree-navigation: TreeNav.tsx. Required: controlled selection and expansion, disabled nodes; nested keyboard behavior and AISEE hierarchy/state hooks. Fallback: standalone.

The manifest preserve list below is mandatory for both host adapters and standalone implementations. All assets and production files listed here remain the complete standalone fallback; adaptation must not import Demo files or expand into an entire UI framework.

## Production implementation

The installer unpacks only the following standalone production files (the manifest, not directory membership, defines this list). Reuse compatible host primitives at the declared boundaries after unpacking:
- TreeNav.tsx
- styles.css
- index.ts
- styles.css.d.ts

Read the delivered source and exported types for the exact API. Use the local index.ts exports; entry modules import styles.css. Never look for the original repository HTML, private docs or an installed AISEE library. Do not recreate the component from screenshots.

## Preserve behavior
- Preserve the production component props, visual variants, interactions, animations and accessibility. Supply content and state from the real product.
- Preserve AISEE visual layout, scoped styles, states, icons, animation timing, interactions and accessibility when adapting host primitives; host default styling must not replace them.

## Integration boundary

Do not create a Demo/Playground/showcase page, mock data, scenario switchers, Reset demo, Simulate incoming notification, Mark all read demo buttons or state galleries. Do not copy demo controls (Show icons/status/actions/error detail), sample content, fonts, global resets or the whole Design System token/styles/assets directories. Required production assets are already explicitly included above. Supply content, state, counts and callbacks from the real product. Missing product data should remain a typed integration prop, not invented fixtures.

Selected options in the request override API defaults only for their named component/example scope. Scopes are alternative examples, not instructions to create multiple pages. Slot booleans describe host content composition, not component props. A module theme is an existing host wrapper data-aisee-theme value (analysis, post-agent, engage); the design label post maps to post-agent. Do not invent a theme prop. Do not convert preview state into business state. File membership never depends on selected options. Without selected options, retain the existing product configuration and then the documented source defaults.

Reuse compatible host React, fonts, Design Tokens and foundational dependencies. Scoped styles keep token override hooks with standalone fallbacks; typography inherits from the host. No font installation, global Design System provider, Tailwind, shadcn or entire AISEE library is required. Do not overwrite host styling globally.

## Install automatically

Use a compatible React/TypeScript project and a bundler supporting CSS. Component compatibility (from this manifest): react >=18, node >=18. Node applies to running the source installer, not the browser component. Copy for AI imposes no additional global version requirement. Runtime dependencies: react >=18 (reuse host). If the host is not React, explain the stack mismatch; do not convert the whole application. For SSR use a client boundary around interactive components.

1. Complete Host Project Compatibility inspection above, then download https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/tree-nav/releases/97e6b5fd2d6d8ade/install.cjs as .aisee-install.cjs inside the host project; verify SHA-256 c1c39f963f1e3c48d257af6322651c8c01f19a235ac6bb12b76abf563b38671e before execution. Do not print archive data into chat.
2. Run `node .aisee-install.cjs src/components/aisee/tree-nav` (adapt the path). It unpacks exactly the production list; it installs no npm packages and refuses different existing files. Inspect conflicts or choose a new directory; never erase previous integrations automatically.
3. Import the required exports from the local directory index, inspect the source/types, and wire them into the existing product using compatible host primitives at the declared boundaries, with standalone fallback where needed. Install only missing compatible runtime dependencies with the host's package manager.
4. Remove the temporary installer. Run the host typecheck/build and verify interactions, animations, keyboard behavior, responsive layout and reduced motion. Report exact download/build errors if any; do not ask for unrelated private repository files.

## Entry modules
- TreeNav.tsx

## Latest version

Resolve https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/tree-nav/latest.json for future integrations. Follow its delivery path relative to that URL. A copied stable latest.json URL resolves to the newest published production version at execution time, even when copied earlier. Already installed source does not update automatically. After resolving latest once for this installation, use that immutable release consistently; do not substitute an older ready-xx.md.
