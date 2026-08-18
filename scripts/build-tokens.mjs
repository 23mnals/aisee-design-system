import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'src/tokens/tokens.json');
const colorArchitecturePath = resolve(root, 'src/tokens/color-architecture.json');
const cssPath = resolve(root, 'src/tokens/tokens.css');
const tsPath = resolve(root, 'src/tokens/tokens.ts');
const portalPath = resolve(root, 'aisee-design-system-preview.html');
const tokens = JSON.parse(await readFile(sourcePath, 'utf8'));
const colorArchitecture = JSON.parse(await readFile(colorArchitecturePath, 'utf8'));
const portal = await readFile(portalPath, 'utf8');

const flatten = (value, path = [], out = {}) => {
  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith('$') || key === 'meta') continue;
    const next = [...path, key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)];
    if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, next, out);
    else out[`--aisee-${next.join('-')}`] = String(child);
  }
  return out;
};

const variables = flatten(tokens);
const primitiveByName = new Map(colorArchitecture.primitive.map(token => [token.name, token]));
const semanticByName = new Map(colorArchitecture.semantic.map(token => [token.name, token]));
const assertUniqueIds = (tokens, layer) => {
  const ids = new Set();
  for (const token of tokens) {
    if (ids.has(token.id)) throw new Error(`Duplicate ${layer} color id: ${token.id}`);
    ids.add(token.id);
  }
};
assertUniqueIds(colorArchitecture.primitive, 'primitive');
assertUniqueIds(colorArchitecture.semantic, 'semantic');

const colorReference = (mode, token) => {
  const modeValue = token[mode];
  if (!modeValue.ref) return modeValue.value;
  const primitive = primitiveByName.get(modeValue.ref);
  if (primitive) return `var(--aisee-color-primitive-${primitive.id})`;
  const semantic = semanticByName.get(modeValue.ref);
  if (semantic) return `var(--aisee-color-semantic-${semantic.id})`;
  throw new Error(`Unknown ${mode} color reference ${modeValue.ref} in ${token.name}`);
};

const primitiveVariables = mode => colorArchitecture.primitive
  .map(token => `  --aisee-color-primitive-${token.id}: ${token[mode]};`)
  .join('\n');
const semanticVariables = mode => colorArchitecture.semantic
  .map(token => `  --aisee-color-semantic-${token.id}: ${colorReference(mode, token)};`)
  .join('\n');

// Existing names remain available while resolving through the semantic layer.
// New product code should use --aisee-color-semantic-* directly.
const compatibilityAliases = {
  '--aisee-color-black': '--aisee-color-semantic-text-primary',
  '--aisee-color-white': '--aisee-color-semantic-bg-base',
  '--aisee-color-page': '--aisee-color-semantic-bg-agent02',
  '--aisee-color-card': '--aisee-color-semantic-bg-base',
  '--aisee-color-card-warm': '--aisee-color-semantic-bg-agent01',
  '--aisee-color-cream': '--aisee-color-semantic-bg-warm',
  '--aisee-color-analysis-primary': '--aisee-color-semantic-button-analysis',
  '--aisee-color-post-agent-primary': '--aisee-color-semantic-button-agent',
  '--aisee-color-orange': '--aisee-color-semantic-feedback-wrong',
  '--aisee-color-danger': '--aisee-color-semantic-feedback-wrong',
  '--aisee-color-border': '--aisee-color-semantic-border-stroke',
  '--aisee-color-border-hover': '--aisee-color-semantic-border-stroke-hover'
};
const compatibilityVariables = Object.entries(compatibilityAliases)
  .map(([legacy, semantic]) => `  ${legacy}: var(${semantic});`)
  .join('\n');

const css = `/* Generated from tokens.json and color-architecture.json. Do not edit directly. */\n:root {\n${Object.entries(variables).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n\n  /* Figma 元数据 / primitive colors: raw values only. */\n${primitiveVariables('light')}\n\n  /* Figma 语义化 / semantic colors: product-facing aliases. */\n${semanticVariables('light')}\n\n  /* Backward-compatible names resolve through semantic colors. */\n${compatibilityVariables}\n\n  --aisee-module-primary: var(--aisee-color-analysis-primary);\n  --aisee-module-primary-hover: var(--aisee-color-analysis-hover);\n  --aisee-module-primary-soft: var(--aisee-color-analysis-soft);\n  --aisee-module-primary-pale: var(--aisee-color-analysis-pale);\n}\n\n[data-aisee-color-mode="dark"] {\n${primitiveVariables('dark')}\n${semanticVariables('dark')}\n}\n\n[data-aisee-theme="post-agent"],\n[data-aisee-theme="engage"] {\n  --aisee-module-primary: var(--aisee-color-post-agent-primary);\n  --aisee-module-primary-hover: var(--aisee-color-post-agent-hover);\n  --aisee-module-primary-soft: var(--aisee-color-post-agent-soft);\n  --aisee-module-primary-pale: var(--aisee-color-post-agent-pale);\n}\n`;
const ts = `/* Generated from tokens.json. Do not edit directly. */\nimport data from './tokens.json';\nexport const tokens = data;\nexport type AiseeTokens = typeof tokens;\nexport default tokens;\n`;
const colorDataPattern = /<script type="application\/json" id="aisee-color-architecture">[\s\S]*?<\/script>/;
if (!colorDataPattern.test(portal)) throw new Error('Portal is missing #aisee-color-architecture.');
const embeddedColorData = `<script type="application/json" id="aisee-color-architecture">${JSON.stringify(colorArchitecture)}</script>`;
const generatedPortal = portal.replace(colorDataPattern, embeddedColorData);

if (process.argv.includes('--check')) {
  const [currentCss, currentTs] = await Promise.all([readFile(cssPath, 'utf8'), readFile(tsPath, 'utf8')]);
  if (currentCss !== css || currentTs !== ts || portal !== generatedPortal) {
    console.error('Generated tokens are stale. Run npm run tokens.');
    process.exit(1);
  }
  console.log(`Token outputs are current (${Object.keys(variables).length} legacy, ${colorArchitecture.primitive.length} primitive and ${colorArchitecture.semantic.length} semantic variables).`);
} else {
  await Promise.all([writeFile(cssPath, css), writeFile(tsPath, ts), writeFile(portalPath, generatedPortal)]);
  console.log(`Generated ${Object.keys(variables).length} legacy, ${colorArchitecture.primitive.length} primitive and ${colorArchitecture.semantic.length} semantic CSS variables.`);
}
