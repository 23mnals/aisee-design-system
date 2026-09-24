# Integrate AISEE Toggle

Production delivery version: 714a59ca60e83a52. Installer SHA-256: 20cbd2dbcd16a0cb54af8e726d69d68986b4eb0e27c1a4abaac54e83ac95e7a0

## Host Project Compatibility — before installation

Integration mode: host-first. Do not assume the host uses AISEE primitives.

Existing host styles, UI library and interactions take precedence over this delivery's appearance, defaults, examples and preserve list. Copying a component or selecting preview options is not permission to redesign, replace or migrate an existing implementation.

1. Inspect the actual target component and its callers, local CSS/CSS modules/Tailwind classes, icons, tokens, UI imports, package.json, lockfile, theme/providers, global styles and existing interactions before downloading/executing the installer or adding dependencies. For shadcn/ui, inspect components.json, its configured aliases and the existing components/ui files. Identify Radix, MUI, Ant Design, Chakra, Headless UI or custom primitives from actual files. Record what already exists and which requested capabilities are missing; check installed APIs, refs, state, events and accessibility.
2. Reuse the existing target at its established path. Preserve its styling, layout, dimensions, colors, typography, spacing, icons, class names, public API, state, event handlers, keyboard/focus behavior and business logic. Add only requested missing capabilities. Do not replace existing CSS, import the delivered complete styles.css, reset library styles, or restyle a shared primitive to match the AISEE demo. Do not create a parallel AISEE primitive or a second components/ui tree. Do not install another complete UI framework.
3. For motion-only requests, add only missing animation to the existing styled element. Use minimal scoped keyframes, transitions or animation hooks tied to existing state/events, with cleanup and prefers-reduced-motion. Preserve existing interactions and static appearance; do not add demo states, click actions, drag behavior, navigation or a new component. Reuse working animations without duplication. Compose with existing transforms and transitions (especially positioning/drag transforms); never overwrite them. If safe composition is impossible, report the specific conflict and leave the existing implementation intact.
4. Incompatibility is not permission to replace an existing component, UI library, styles or behavior. Limit adapters to the requested missing capability. If it cannot be added safely, report that gap without changing existing behavior. Only when the target component is absent may a new component be added, reusing the host UI library, styling conventions and tokens. Use standalone only for that absent target when no host primitive provides the needed capability; never use it as a replacement for an existing target. An empty primitives list does not bypass inspection or permit duplication.
5. For an existing target, unpack into a temporary reference directory only if needed; extract the minimal missing capability and its dependencies, then remove only that temporary copy. Do not import its standalone entry module or complete stylesheet into the existing component. The source installer does not detect or modify the host framework automatically. Never emit unscoped button/input/svg/body/reset rules, global token overrides, or replace host styles; scope additions, including portals. Reuse fonts/tokens/dependencies; never add or replace a global provider merely for AISEE.
6. Compare the host before and after: existing static appearance, interactions, public API, state and event behavior must remain unchanged, while only the requested missing capability is added. Verify keyboard/focus return, portal layering/positioning, reduced motion, cleanup and host typecheck/build. Avoid duplicate listeners, focus traps or keyframes. Report reused paths, added capabilities and unresolved conflicts. An explicit user request to change an existing design/interaction is a separate scope; the delivery itself grants no such permission.

### Adaptable primitive boundaries
- switch: Toggle.tsx. Reference capabilities (only the requested missing subset applies to an existing target): checked/defaultChecked, disabled and change callback; keyboard activation and state hooks for AISEE motion. Fallback for an absent target only: standalone.

The preserve list describes the standalone reference and the requested missing capability only. It never authorizes overwriting existing host styles or interactions. For motion-only work, non-motion layout, icons, states and behavior in that list are out of scope. All production files remain available for an absent target; an existing target must use only the minimal relevant additions, never Demo files or an entire UI framework.

## Production implementation

The installer unpacks only the following standalone production files (the manifest, not directory membership, defines this list). For an absent target, use them as a standalone reference under the host styling conventions. For an existing target, extract only the requested missing capability from a temporary reference; do not install the full component or stylesheet:
- Toggle.tsx
- styles.css
- index.ts
- styles.css.d.ts

Read the delivered source and exported types for the exact API. Use the local index.ts exports only for a standalone boundary; when reusing an existing host primitive, preserve its established import path and public API unless the product explicitly requests a migration. Standalone entry modules import styles.css; do not import these entries or the full stylesheet into an existing styled component. Never look for the original repository HTML, private docs or an installed AISEE library. Do not recreate the component from screenshots.

## Reference capabilities — subordinate to host preservation
These requirements apply only to an absent target or the requested missing capability. Motion-only work must not change existing appearance or interactions.
- Existing host styles, UI library and interactions take precedence. Add only requested missing capabilities; for motion-only requests add only missing animation without restyling or changing interactions. The other preserve entries describe the standalone reference and apply only to an absent target or the requested missing capability; they never authorize replacing existing host behavior or appearance.
- Preserve the production component props, visual variants, interactions, animations and accessibility. Supply content and state from the real product.

## Integration boundary

Do not create a Demo/Playground/showcase page, mock data, scenario switchers, Reset demo, Simulate incoming notification, Mark all read demo buttons or state galleries. Do not copy demo controls (Show icons/status/actions/error detail), sample content, fonts, global resets or the whole Design System token/styles/assets directories. Required production assets are already explicitly included above. Supply content, state, counts and callbacks from the real product. Missing product data should remain a typed integration prop, not invented fixtures.

Copied preview options are reference values for requested missing capabilities or an absent target only. They never override existing host styles, interactions or settings. For motion-only work ignore non-motion options such as layout, size, icons, placement and theme. A separate explicit user request is required to change existing behavior or design. Scopes are alternative examples, not instructions to create multiple pages. Slot booleans describe host content composition, not component props. A module theme is an existing host wrapper data-aisee-theme value (analysis, post-agent, engage); the design label post maps to post-agent. Do not invent a theme prop. Do not convert preview state into business state. File membership never depends on selected options. Without selected options, retain the existing product configuration and then the documented source defaults.

Reuse compatible host React, fonts, Design Tokens and foundational dependencies. Scoped styles keep token override hooks with standalone fallbacks; typography inherits from the host. No font installation, global Design System provider, Tailwind, shadcn or entire AISEE library is required. Do not overwrite existing host styling, whether global or component-local.

## Add only what is missing

Use a compatible React/TypeScript project and a bundler supporting CSS. Component compatibility (from this manifest): react >=18, node >=18. Node applies to running the source installer, not the browser component. Copy for AI imposes no additional global version requirement. Runtime dependencies: react >=18 (reuse host). If the host is not React, explain the stack mismatch; do not convert the whole application. For SSR use a client boundary around interactive components.

1. Complete Host Project Compatibility inspection and identify a requested missing capability first. If nothing is missing, make no changes. Only if reference source is needed, download https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/toggle/releases/714a59ca60e83a52/install.cjs as .aisee-install.cjs inside the host project; verify SHA-256 20cbd2dbcd16a0cb54af8e726d69d68986b4eb0e27c1a4abaac54e83ac95e7a0 before execution. Do not print archive data into chat.
2. If the target component or styles already exist, run `node .aisee-install.cjs .aisee-reference/toggle` only to inspect the verified source, extract only the requested missing capability into the existing host path while preserving its styles, library and interactions; for animation requests add only missing motion, and remove .aisee-reference afterwards. Do not create src/components/aisee or a second components/ui tree.
3. Only when the target component is absent and no host primitive provides the needed capability, run `node .aisee-install.cjs src/components/aisee/toggle` (adapt the path) as a new standalone boundary following the host styling conventions. Never use this fallback to replace an existing target. The installer writes exactly the production list, installs no npm packages and refuses different existing files.
4. Install only missing compatible runtime dependencies with the host's package manager. Run the host typecheck/build and compare before/after static appearance, existing interactions and callbacks; verify only requested missing animation/capabilities were added, including cleanup and reduced motion. Report exact download/build errors if any; do not ask for unrelated private repository files.

## Entry modules
- Toggle.tsx

## Latest version

Resolve https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/toggle/latest.json for future integrations. Follow its delivery path relative to that URL. A copied stable latest.json URL resolves to the newest published production version at execution time, even when copied earlier. Already installed source does not update automatically. After resolving latest once for this installation, use that immutable release consistently; do not substitute an older ready-xx.md.
