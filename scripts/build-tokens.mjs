import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'src/tokens/tokens.json');
const cssPath = resolve(root, 'src/tokens/tokens.css');
const tsPath = resolve(root, 'src/tokens/tokens.ts');
const tokens = JSON.parse(await readFile(sourcePath, 'utf8'));

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
const css = `/* Generated from tokens.json. Do not edit directly. */\n:root {\n${Object.entries(variables).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n  --aisee-module-primary: var(--aisee-color-analysis-primary);\n  --aisee-module-primary-hover: var(--aisee-color-analysis-hover);\n  --aisee-module-primary-soft: var(--aisee-color-analysis-soft);\n  --aisee-module-primary-pale: var(--aisee-color-analysis-pale);\n}\n\n[data-aisee-theme="post-agent"],\n[data-aisee-theme="engage"] {\n  --aisee-module-primary: var(--aisee-color-post-agent-primary);\n  --aisee-module-primary-hover: var(--aisee-color-post-agent-hover);\n  --aisee-module-primary-soft: var(--aisee-color-post-agent-soft);\n  --aisee-module-primary-pale: var(--aisee-color-post-agent-pale);\n}\n`;
const ts = `/* Generated from tokens.json. Do not edit directly. */\nimport data from './tokens.json';\nexport const tokens = data;\nexport type AiseeTokens = typeof tokens;\nexport default tokens;\n`;

if (process.argv.includes('--check')) {
  const [currentCss, currentTs] = await Promise.all([readFile(cssPath, 'utf8'), readFile(tsPath, 'utf8')]);
  if (currentCss !== css || currentTs !== ts) {
    console.error('Generated tokens are stale. Run npm run tokens.');
    process.exit(1);
  }
  console.log(`Token outputs are current (${Object.keys(variables).length} variables).`);
} else {
  await Promise.all([writeFile(cssPath, css), writeFile(tsPath, ts)]);
  console.log(`Generated ${Object.keys(variables).length} CSS variables.`);
}
