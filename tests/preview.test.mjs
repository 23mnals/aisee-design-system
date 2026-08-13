import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const portalUrl = new URL('../aisee-design-system-preview.html', import.meta.url);
const projectUrl = new URL('../', import.meta.url);
const portal = await readFile(portalUrl, 'utf8');

test('system portal preserves the four required sections', () => {
  assert.match(portal, />README</);
  assert.match(portal, />Brand</);
  assert.match(portal, />Components</);
  assert.match(portal, />UI Kits — Webapp</);
});

test('every catalog preview exists and paths are unique', async () => {
  const paths = [...portal.matchAll(/path: "([^"]+)"/g)].map(match => match[1]);
  assert.ok(paths.length >= 40, `expected at least 40 previews, found ${paths.length}`);
  assert.equal(new Set(paths).size, paths.length, 'catalog paths must be unique');
  await Promise.all(paths.map(path => access(new URL(path, projectUrl))));
});

test('standalone portal script is syntactically valid', () => {
  const script = portal.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'inline script should exist');
  assert.doesNotThrow(() => new Function(script));
});

test('portal and v6 previews self-host Karla', async () => {
  const foundations = await readFile(new URL('../preview/dapp-v6-foundations.html', import.meta.url), 'utf8');
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  for (const html of [portal, foundations, components]) {
    assert.match(html, /Karla-VariableFont_wght\.ttf/);
  }
  assert.match(foundations, /Homepage \/ Brand.*Karla \+ Gotu/);
  assert.match(foundations, /dApp.*Karla/);
});

test('input interaction follows the Figma compound module ring', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /box-shadow:0 0 0 2px var\(--module,#CFFF29\)/);
  assert.match(components, /analysis\?'#CFFF29':'#FFE253'/);
  assert.match(components, /Hover \/ focus/);
  assert.match(styles, /box-shadow: 0 0 0 var\(--aisee-size-input-ring\) var\(--aisee-module-primary\)/);
  assert.match(portal, /1px black inner border plus a 2px module-color ring/);
});

test('dropdown follows the Figma trigger, menu and selection pattern', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('../src/components/Dropdown.tsx', import.meta.url), 'utf8');
  assert.match(components, /Select \/ Dropdown/);
  assert.match(components, /class="select-trigger"[\s\S]*?aria-haspopup="listbox"[\s\S]*?aria-expanded="true"/);
  assert.match(components, /class="select-menu"[\s\S]*?role="listbox"/);
  assert.match(components, /class="select-option selected"[\s\S]*?role="option"[\s\S]*?aria-selected="true"/);
  assert.match(components, /\.select-menu\{[^}]*top:70px/);
  assert.match(components, /\.select-option:hover,\.select-option\.selected\{background:rgba\(17,17,17,\.05\)\}/);
  assert.match(styles, /\.aisee-dropdown__menu \{[\s\S]*?top: calc\(100% \+ 8px\);[\s\S]*?border: 1px solid var\(--aisee-color-black\);[\s\S]*?box-shadow: var\(--aisee-shadow-dropdown\);/);
  assert.match(styles, /\.aisee-dropdown__option\[aria-selected="true"\] \{ background: rgba\(17,17,17,\.05\);/);
  assert.match(source, /aria-haspopup="listbox"/);
  assert.match(source, /role="option"/);
  assert.match(source, /ArrowDown/);
  assert.match(source, /Escape/);
  assert.match(portal, /dropdown menus keep an 8px gap below the trigger/);
  assert.match(portal, /5% black fill for hover, focus and selected items/);
});

test('danger button follows the Figma destructive action style', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /\.row \.danger\{[^}]*padding:8px 16px[^}]*font:500 14px\/18px Karla/);
  assert.match(styles, /\.aisee-button--danger \{[\s\S]*?color: var\(--aisee-color-white\);[\s\S]*?background: var\(--aisee-color-danger\);[\s\S]*?font-size: 14px;/);
  assert.match(portal, /Danger \/ Alert[\s\S]*?#EC5212 · white text/);
});

test('component modal previews keep vertical breathing room inside demo surfaces', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  assert.match(components, /\.modal-demo\{min-height:300px;padding:32px 24px\}/);
  assert.match(components, /\.confirm-demo\{min-height:360px;padding:32px 24px\}/);
});

test('all dialog titles use Karla semibold 600 rather than bold 700', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /\.modal h3\{[^}]*font-weight:600/);
  assert.match(components, /\.confirm-head h3\{[^}]*font-weight:600/);
  assert.match(styles, /\.aisee-dialog__title \{[^}]*font-weight: 600;/);
  assert.match(styles, /\.aisee-confirmation-dialog__title \{[^}]*font-weight: 600;/);
  assert.doesNotMatch(components, /(?:\.modal h3|\.confirm-head h3)\{[^}]*font-weight:700/);
  assert.doesNotMatch(styles, /(?:\.aisee-dialog__title|\.aisee-confirmation-dialog__title) \{[^}]*font-weight: 700;/);
});

test('confirmation dialog follows the Figma unsaved changes pattern', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('../src/components/ConfirmationDialog.tsx', import.meta.url), 'utf8');
  assert.match(components, /Confirmation Dialog/);
  assert.match(components, /Discard unsaved changes\?/);
  assert.match(components, /Keep Editing[\s\S]*?Discard Changes/);
  assert.match(styles, /\.aisee-confirmation-dialog \{[\s\S]*?width: min\(512px/);
  assert.match(styles, /\.aisee-confirmation-dialog__actions \.aisee-button \{ width: 100%; height: 44px;/);
  assert.match(source, /aria-labelledby=\{titleId\}/);
  assert.match(source, /aria-describedby=\{descriptionId\}/);
  assert.match(source, /dialog-close\.svg/);
  await access(new URL('../assets/dialog-close.svg', import.meta.url));
});

test('portal uses the official AISEE logo mark', async () => {
  assert.match(portal, /src="\.\/assets\/aisee-logo-mark\.png"/);
  await access(new URL('../assets/aisee-logo-mark.png', import.meta.url));
});

test('iconography points to the StemUI GitHub source and npm package', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const workflow = await readFile(new URL('../docs/ICON_LIBRARY.md', import.meta.url), 'utf8');
  assert.match(portal, /https:\/\/github\.com\/qi15582378779\/stemui/);
  assert.match(portal, /https:\/\/www\.npmjs\.com\/package\/@stemui\/icons/);
  assert.match(readme, /npm install @stemui\/icons/);
  assert.match(workflow, /npm run publish:icons/);
  assert.match(workflow, /npm run publish:icons:manual/);
});

test('webapp UI kit follows the 5.5 Growth Loop shell and official branding', async () => {
  const kit = await readFile(new URL('../ui_kits/webapp/index.html', import.meta.url), 'utf8');
  const shared = await readFile(new URL('../ui_kits/webapp/Components.jsx', import.meta.url), 'utf8');
  const dna = JSON.parse(await readFile(new URL('../ui_kits/webapp/design-dna-v5.5.json', import.meta.url), 'utf8'));
  assert.match(kit, /src="\.\.\/\.\.\/assets\/aisee-logo-wordmark\.svg"/);
  assert.match(kit, /src="\.\.\/\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(kit, /Growth Loop/);
  assert.match(kit, /data-screen="Overview"/);
  assert.match(kit, /data-screen="Analysis"/);
  assert.match(kit, /data-screen="Growth"/);
  assert.match(kit, /data-screen="Engage"/);
  assert.match(kit, /data-screen="Post"/);
  assert.match(kit, /Turn insights into measurable growth/);
  assert.match(kit, /Score Improvement Plan/);
  assert.match(kit, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(kit, /\['Analysis', 'Post Agent', 'Engage'\]/);
  assert.match(shared, /aisee-logo-wordmark\.svg/);
  assert.match(shared, /aisee-logo-mark\.png/);
  assert.doesNotMatch(shared, /borderRadius: '320px 320px 0 0'/);
  assert.equal(dna.design_system.layout.columns, '4 KPI columns followed by asymmetric two-column content');
  assert.equal(dna.visual_effects['3d_elements'].enabled, false);
});

test('legacy buttons preview uses official logo assets instead of a CSS redraw', async () => {
  const buttons = await readFile(new URL('../preview/components-buttons-badges.html', import.meta.url), 'utf8');
  assert.match(buttons, /src="\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(buttons, /src="\.\.\/assets\/logo-wordmark\.png"/);
  assert.doesNotMatch(buttons, /logo-mark-bg|logo-mark-face/);
});

test('brand logo preview uses official assets instead of a CSS redraw', async () => {
  const logo = await readFile(new URL('../preview/brand-logo.html', import.meta.url), 'utf8');
  assert.match(logo, /src="\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(logo, /src="\.\.\/assets\/logo-wordmark\.png"/);
  assert.doesNotMatch(logo, /lm-bg|lm-face|lm-eye/);
});

test('sidebar uses compact 14px navigation typography', () => {
  assert.match(portal, /\.nav-home \{[\s\S]*?font-size: 14px;/);
  assert.match(portal, /\.nav-group summary \{[\s\S]*?font-size: 14px;/);
  assert.match(portal, /\.nav-item \{[^}]*font-size: 14px;/);
});

test('overview documents feature-page and specification version rules', () => {
  assert.match(portal, /Figma feature page 5\.6/);
  assert.match(portal, /Design Specification v6/);
  assert.match(portal, /Page 5\.6 is the latest newly opened feature page, not a global version/);
  assert.match(portal, /Existing feature pages[\s\S]*?Living/);
  assert.match(portal, /newest design above the earlier content on that function's original page/);
  assert.match(portal, /black title frame records its update subject and date/);
  assert.match(portal, /page and file names are location aids, not freshness evidence/);
  assert.match(portal, /Missing earlier feature pages[\s\S]*?Planned/);
});

test('overview contains the complete documentation sections', () => {
  for (const id of ['product-overview', 'sources', 'content', 'visual', 'interaction', 'assets', 'components-overview', 'versions']) {
    assert.match(portal, new RegExp(`id="${id}"`));
  }
  assert.match(portal, /Homepage \/ Brand[\s\S]*?Karla \+ Gotu/);
  assert.match(portal, /dApp \/ App \/ Webapp[\s\S]*?Karla only/);
  assert.match(portal, /Never redraw the eye or wordmark with CSS/);
});

test('product overview contains the complete six-capability loop', () => {
  for (const capability of ['Analysis / GEO', 'Growth', 'Engage', 'Post Agent', 'Verify', 'Connection']) {
    assert.match(portal, new RegExp(`<h3>${capability.replace('/', '\\/')}</h3>`));
  }
  assert.match(portal, /Analysis diagnoses → Growth prioritizes → Engage and Post execute → Verify measures/);
  assert.match(portal, /Analysis, Growth, Engage, Post Agent, Verify, Connection and account workflows/);
});

test('brand fonts are local and application typography remains Karla-only', async () => {
  const displayType = await readFile(new URL('../preview/type-display.html', import.meta.url), 'utf8');
  const logoPreview = await readFile(new URL('../preview/brand-logo.html', import.meta.url), 'utf8');
  for (const html of [displayType, logoPreview]) {
    assert.match(html, /fonts\/Gotu-Regular\.ttf/);
    assert.doesNotMatch(html, /fonts\.googleapis\.com/);
  }
  await access(new URL('../fonts/Gotu-Regular.ttf', import.meta.url));
  await access(new URL('../fonts/DigitalNumbers-Regular.ttf', import.meta.url));

  const foundations = await readFile(new URL('../preview/dapp-v6-foundations.html', import.meta.url), 'utf8');
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  assert.doesNotMatch(`${foundations}\n${components}`, /DigitalNumbers-Regular|font-family:\s*(?:'|")?Digital Numbers/i);
});
