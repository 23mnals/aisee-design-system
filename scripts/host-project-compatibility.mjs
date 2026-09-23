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
  return {integrationMode:manifest.integrationMode, primitives:manifest.primitives, preserve:manifest.preserve};
}

export function hostIntegrationGuide(manifest) {
  validateHostIntegration(manifest);
  return `## Host Project Compatibility — before installation

Integration mode: ${manifest.integrationMode}. Do not assume the host uses AISEE primitives.

1. Inspect the host package.json, lockfile, existing UI imports, custom primitives, theme/providers and global styles before downloading/executing the installer or adding dependencies. For shadcn/ui, inspect components.json, its configured aliases and the existing components/ui files. Identify Radix, MUI, Ant Design, Chakra, Headless UI or project-specific primitives from actual files; names alone do not establish compatibility.
2. For each declared primitive below, prefer an existing compatible host implementation. Check its installed API/version, refs, DOM/state hooks, controlled state, accessibility and required capabilities. When a compatible shadcn/ui or host component already exists, modify or extend that existing component at its established path with AISEE visuals, states and motion. Do not create a parallel AISEE primitive, duplicate components/ui under another directory, or install another complete UI framework for one AISEE component.
3. Third-party primitives may supply only underlying capabilities (focus management, portal, positioning, dialog accessibility or native control semantics). Keep the delivered AISEE implementation as the visual/behavior reference. Adapt only the declared primitive boundaries via a local adapter; preserve every requirement below, including states, layout, icons, animations, keyboard behavior and reduced motion. Do not replace the component with a host library's default-looking widget. Preserve public props and ref behavior; if required native element APIs cannot be preserved, use standalone.
4. If no existing primitive satisfies all requirements, use the delivered standalone implementation for that boundary and state the concrete missing capability. No primitives listed means there is no library-level primitive boundary to replace. Do not install AISEE's whole library or invent unnecessary adapters. When a host primitive is reused, unpack the delivery only to a temporary reference directory, merge the required AISEE behavior into the existing host path, then delete the temporary copy. The source installer does not detect or modify the host framework automatically.
5. Scope all AISEE CSS and local overrides to the component, including portalled content. Never emit unscoped button/input/svg/body/reset rules, global token overrides, or replace the host theme/provider/global styles. Reuse compatible host fonts/tokens/dependencies without losing AISEE's required appearance; use local fallbacks where tokens differ. Reuse an existing provider only when required by the chosen primitive; never add or replace a global provider merely for AISEE.
6. Briefly report the detected host stack and chosen adapter/standalone boundaries. Verify visual/state/motion parity, keyboard/focus return, portal layering and positioning, reduced motion and host typecheck/build. Avoid duplicate focus traps, Escape/outside-click listeners or competing positioning/animation transforms. Document any unmet capability instead of silently changing the design.

### Adaptable primitive boundaries
${manifest.primitives.length ? manifest.primitives.map(p => `- ${p.role}: ${p.sourceFiles.map(file=>file.split('/').pop()).join(', ')}. Required: ${p.requiredCapabilities.join('; ')}. Fallback: ${p.fallback}.`).join('\n') : '- None. Retain the standalone component; reuse only compatible host runtime, fonts and local tokens.'}

The manifest preserve list below is mandatory for both host adapters and standalone implementations. All assets and production files listed here remain the complete standalone fallback; adaptation must not import Demo files or expand into an entire UI framework.
`;
}
