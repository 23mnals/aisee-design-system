const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const stringList = value => Array.isArray(value) && value.length > 0 && value.every(nonempty);

export function validateHostIntegration(manifest) {
  if (manifest.integrationMode !== 'host-first') throw Error(`${manifest.name}: integrationMode must be host-first`);
  if (!stringList(manifest.preserve)) throw Error(`${manifest.name}: declare preserve requirements`);
  if (!Array.isArray(manifest.primitives)) throw Error(`${manifest.name}: declare primitives (use [] when none apply)`);
  const roles = new Set();
  const production = new Set(manifest.productionFiles.filter(file => typeof file === 'string'));
  for (const primitive of manifest.primitives) {
    if (!nonempty(primitive.role) || roles.has(primitive.role)) throw Error(`${manifest.name}: invalid or duplicate primitive role`);
    roles.add(primitive.role);
    if (!stringList(primitive.sourceFiles) || primitive.sourceFiles.some(file => !production.has(file))) throw Error(`${manifest.name}: primitive sourceFiles must be declared production implementations`);
    if (!stringList(primitive.requiredCapabilities) || primitive.fallback !== 'standalone') throw Error(`${manifest.name}: primitive requires capabilities and standalone fallback`);
  }
}

export function integrationMetadata(manifest) {
  return {integrationMode:manifest.integrationMode, integrationPolicy, primitives:manifest.primitives, preserve:manifest.preserve};
}

export const integrationPolicy = Object.freeze({
  existingImplementation: 'preserve-styles-ui-library-and-interactions',
  changes: 'requested-missing-capabilities-only',
  motionOnly: 'add-motion-without-restyling-or-changing-interactions',
  standalone: 'only-when-target-component-is-absent',
  preserveScope: 'new-components-and-requested-missing-capabilities-only',
  conflicts: 'report-without-replacing-existing-implementation'
});

export function hostIntegrationGuide(manifest) {
  validateHostIntegration(manifest);
  return `## Host Project Compatibility — before installation

Integration mode: ${manifest.integrationMode}. Do not assume the host uses AISEE primitives.

Existing host styles, UI library and interactions take precedence over this delivery's appearance, defaults, examples and preserve list. Copying a component or selecting preview options is not permission to redesign, replace or migrate an existing implementation.

1. Inspect the actual target component and its callers, local CSS/CSS modules/Tailwind classes, icons, tokens, UI imports, package.json, lockfile, theme/providers, global styles and existing interactions before downloading/executing the installer or adding dependencies. For shadcn/ui, inspect components.json, its configured aliases and the existing components/ui files. Identify Radix, MUI, Ant Design, Chakra, Headless UI or custom primitives from actual files. Record what already exists and which requested capabilities are missing; check installed APIs, refs, state, events and accessibility.
2. Reuse the existing target at its established path. Preserve its styling, layout, dimensions, colors, typography, spacing, icons, class names, public API, state, event handlers, keyboard/focus behavior and business logic. Add only requested missing capabilities. Do not replace existing CSS, import the delivered complete styles.css, reset library styles, or restyle a shared primitive to match the AISEE demo. Do not create a parallel AISEE primitive or a second components/ui tree. Do not install another complete UI framework.
3. For motion-only requests, add only missing animation to the existing styled element. Use minimal scoped keyframes, transitions or animation hooks tied to existing state/events, with cleanup and prefers-reduced-motion. Preserve existing interactions and static appearance; do not add demo states, click actions, drag behavior, navigation or a new component. Reuse working animations without duplication. Compose with existing transforms and transitions (especially positioning/drag transforms); never overwrite them. If safe composition is impossible, report the specific conflict and leave the existing implementation intact.
4. Incompatibility is not permission to replace an existing component, UI library, styles or behavior. Limit adapters to the requested missing capability. If it cannot be added safely, report that gap without changing existing behavior. Only when the target component is absent may a new component be added, reusing the host UI library, styling conventions and tokens. Use standalone only for that absent target when no host primitive provides the needed capability; never use it as a replacement for an existing target. An empty primitives list does not bypass inspection or permit duplication.
5. For an existing target, unpack into a temporary reference directory only if needed; extract the minimal missing capability and its dependencies, then remove only that temporary copy. Do not import its standalone entry module or complete stylesheet into the existing component. The source installer does not detect or modify the host framework automatically. Never emit unscoped button/input/svg/body/reset rules, global token overrides, or replace host styles; scope additions, including portals. Reuse fonts/tokens/dependencies; never add or replace a global provider merely for AISEE.
6. Compare the host before and after: existing static appearance, interactions, public API, state and event behavior must remain unchanged, while only the requested missing capability is added. Verify keyboard/focus return, portal layering/positioning, reduced motion, cleanup and host typecheck/build. Avoid duplicate listeners, focus traps or keyframes. Report reused paths, added capabilities and unresolved conflicts. An explicit user request to change an existing design/interaction is a separate scope; the delivery itself grants no such permission.

### Adaptable primitive boundaries
${manifest.primitives.length ? manifest.primitives.map(p => `- ${p.role}: ${p.sourceFiles.map(file=>file.split('/').pop()).join(', ')}. Reference capabilities (only the requested missing subset applies to an existing target): ${p.requiredCapabilities.join('; ')}. Fallback for an absent target only: ${p.fallback}.`).join('\n') : '- None declared. Still inspect and reuse an existing target; standalone is allowed only for an absent target.'}

The preserve list describes the standalone reference and the requested missing capability only. It never authorizes overwriting existing host styles or interactions. For motion-only work, non-motion layout, icons, states and behavior in that list are out of scope. All production files remain available for an absent target; an existing target must use only the minimal relevant additions, never Demo files or an entire UI framework.
`;
}
