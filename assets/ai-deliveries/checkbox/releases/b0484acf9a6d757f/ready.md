# Integrate AISEE Checkbox

Production delivery version: b0484acf9a6d757f. Installer SHA-256: 19c56c1cc1ee455982cf8476ccbd9d85269d72925d03985ba34ea6c6b560ad4d

## Production implementation

Install only the following files (the manifest, not directory membership, defines this list):
- Checkbox.tsx
- styles.css
- index.ts
- styles.css.d.ts

Read the delivered source and exported types for the exact API. Use the local index.ts exports; entry modules import styles.css. Never look for the original repository HTML, private docs or an installed AISEE library. Do not recreate the component from screenshots.

## Preserve behavior
- Preserve checked/indeterminate states, focus behavior and check celebration animation.

## Integration boundary

Do not create a Demo/Playground/showcase page, mock data, scenario switchers, Reset demo, Simulate incoming notification, Mark all read demo buttons or state galleries. Do not copy demo controls (Show icons/status/actions/error detail), sample content, fonts, global resets or the whole Design System token/styles/assets directories. Required production assets are already explicitly included above. Supply content, state, counts and callbacks from the real product. Missing product data should remain a typed integration prop, not invented fixtures.

Selected options in the request override API defaults only for their named component/example scope. Scopes are alternative examples, not instructions to create multiple pages. Slot booleans describe host content composition, not component props. A module theme is an existing host wrapper data-aisee-theme value (analysis, post-agent, engage); the design label post maps to post-agent. Do not invent a theme prop. Do not convert preview state into business state. File membership never depends on selected options. Without selected options, retain the existing product configuration and then the documented source defaults.

Reuse compatible host React, fonts, Design Tokens and foundational dependencies. Scoped styles keep token override hooks with standalone fallbacks; typography inherits from the host. No font installation, global Design System provider, Tailwind, shadcn or entire AISEE library is required. Do not overwrite host styling globally.

## Install automatically

Use a compatible React/TypeScript project and a bundler supporting CSS. Component compatibility (from this manifest): react >=18, node >=18. Node applies to running the source installer, not the browser component. Copy for AI imposes no additional global version requirement. Runtime dependencies: react >=18 (reuse host). If the host is not React, explain the stack mismatch; do not convert the whole application. For SSR use a client boundary around interactive components.

1. Download https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/checkbox/releases/b0484acf9a6d757f/install.cjs as .aisee-install.cjs inside the host project; verify SHA-256 19c56c1cc1ee455982cf8476ccbd9d85269d72925d03985ba34ea6c6b560ad4d before execution. Do not print archive data into chat.
2. Run `node .aisee-install.cjs src/components/aisee/checkbox` (adapt the path). It unpacks exactly the production list; it installs no npm packages and refuses different existing files. Inspect conflicts or choose a new directory; never erase previous integrations automatically.
3. Import the required exports from the local directory index, inspect the source/types, and wire them into the existing product. Install only missing compatible runtime dependencies with the host's package manager.
4. Remove the temporary installer. Run the host typecheck/build and verify interactions, animations, keyboard behavior, responsive layout and reduced motion. Report exact download/build errors if any; do not ask for unrelated private repository files.

## Entry modules
- Checkbox.tsx

## Latest version

Resolve https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/checkbox/latest.json for future integrations. Follow its delivery path relative to that URL. A copied stable latest.json URL resolves to the newest published production version at execution time, even when copied earlier. Already installed source does not update automatically. After resolving latest once for this installation, use that immutable release consistently; do not substitute an older ready-xx.md.
