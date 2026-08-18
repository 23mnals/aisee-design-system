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
  // Three duplicate legacy Engage pages were intentionally removed from the catalog.
  assert.ok(paths.length >= 37, `expected at least 37 previews, found ${paths.length}`);
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
  const dialog = await readFile(new URL('../components/Dialog/Dialog.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /box-shadow:0 0 0 2px var\(--module,#CFFF29\)/);
  assert.match(components, /moduleThemes=\{analysis:\{primary:'#CFFF29'[^}]*\},post:\{primary:'#FFE253'[^}]*\},engage:\{primary:'#FFE253'/);
  assert.match(components, /Hover \/ focus/);
  assert.match(styles, /box-shadow: 0 0 0 var\(--aisee-size-input-ring\) var\(--aisee-module-primary\)/);
  assert.match(dialog, /\.field input:hover:not\(:disabled\),\.field input:focus:not\(:disabled\)\{border-color:var\(--ink\);outline:none;box-shadow:0 0 0 2px var\(--module\)\}/);
  assert.doesNotMatch(dialog, /outline:\s*(?:auto|-webkit-focus-ring-color)/);
  assert.match(dialog, /Input height 40px; hover and focus use a 1px black inner border plus a 2px Analysis lime ring/);
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
  assert.match(source, /selectionMode\?: 'single' \| 'multiple'/);
  assert.match(source, /filterable\?: boolean/);
  assert.match(source, /editable\?: boolean/);
  assert.match(source, /aria-multiselectable/);
  assert.match(portal, /dropdown menus keep an 8px gap below the trigger/);
  assert.match(portal, /5% black fill for hover, focus and selected items/);
});

test('high-priority feedback and data components are publishable Current entries', async () => {
  const exports = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const componentFiles = [
    ['Tooltip', '../src/components/Tooltip.tsx', '../components/TooltipToast/TooltipToast.html'],
    ['Toast', '../src/components/Toast.tsx', '../components/TooltipToast/TooltipToast.html'],
    ['StatCard', '../src/components/StatCard.tsx', '../components/StatCardCurrent/StatCardCurrent.html'],
    ['Table', '../src/components/Table.tsx', '../components/Table/Table.html'],
    ['ScoreGauge', '../src/components/ScoreGauge.tsx', '../components/ScoreGauge/ScoreGauge.html'],
    ['Chart', '../src/components/Chart.tsx', '../components/Chart/Chart.html'],
  ];
  for (const [name, sourcePath, detailPath] of componentFiles) {
    await access(new URL(sourcePath, import.meta.url));
    await access(new URL(detailPath, import.meta.url));
    assert.match(exports, new RegExp(`components/${name}`));
  }
  assert.match(styles, /\.aisee-toast-viewport/);
  assert.match(styles, /\.aisee-stat-card/);
  assert.match(styles, /\.aisee-table/);
  assert.match(styles, /\.aisee-score-gauge/);
  assert.match(styles, /\.aisee-chart/);
  for (const path of ['TooltipToast/TooltipToast.html', 'StatCardCurrent/StatCardCurrent.html', 'Table/Table.html', 'ScoreGauge/ScoreGauge.html', 'Chart/Chart.html']) {
    assert.match(portal, new RegExp(`components/${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  }
});

test('score gauge follows Figma node 58:32548 instead of the legacy donut', async () => {
  const source = await readFile(new URL('../src/components/ScoreGauge.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/ScoreGauge/ScoreGauge.html', import.meta.url), 'utf8');
  const overview = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  await access(new URL('../src/assets/score-gauge/score-gauge-texture.png', import.meta.url));

  assert.match(source, /max = 50/);
  assert.match(source, /length: 15/);
  assert.match(source, /aisee-score-gauge__needle/);
  assert.match(styles, /aspect-ratio: 381 \/ 216/);
  assert.match(styles, /font-size: 18px; font-weight: 500; line-height: 26px/);
  assert.match(styles, /score-gauge-texture\.png/);
  assert.match(styles, /font-size: 20px; font-weight: 400; line-height: 26px/);
  assert.doesNotMatch(styles, /\.aisee-score-gauge__dial/);
  assert.match(detail, /Figma node 58:32548/);
  assert.match(detail, /aria-valuemax="50" aria-valuenow="30\.8"/);
  assert.match(overview, /class="gauge-scale"/);
  assert.match(overview, /<strong>30\.8<\/strong>/);
  assert.doesNotMatch(detail, /45\.0|points this month|conic-gradient/);
});

test('toast follows the Figma one-line, two-line and functional-color variants', async () => {
  const source = await readFile(new URL('../src/components/Toast.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/TooltipToast/TooltipToast.html', import.meta.url), 'utf8');
  const overview = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  await Promise.all([
    '../assets/stemui/action-check.svg',
    '../assets/stemui/action-close.svg',
  ].map(path => access(new URL(path, import.meta.url))));

  assert.match(source, /ToastTone = 'default' \| 'success' \| 'error' \| 'agent'/);
  assert.match(source, /description\?: ReactNode/);
  assert.match(source, /aisee-toast--two-line/);
  assert.match(source, /toastCheckIcon/);
  assert.match(source, /assets\/stemui\/action-check\.svg/);
  assert.match(source, /assets\/stemui\/action-close\.svg/);
  assert.doesNotMatch(source, /assets\/toast\/.*\.png/);
  assert.match(detail, /assets\/stemui\/action-check\.svg/);
  assert.match(detail, /assets\/stemui\/action-close\.svg/);
  assert.doesNotMatch(detail, /assets\/toast\/.*\.png/);
  assert.match(overview, /assets\/stemui\/action-check\.svg/);
  assert.match(overview, /assets\/stemui\/action-close\.svg/);
  assert.doesNotMatch(overview, /assets\/toast\/.*\.png/);
  assert.match(styles, /\.aisee-toast \{[\s\S]*?width: min\(368px, 100%\);[\s\S]*?min-height: 56px;/);
  assert.match(styles, /\.aisee-toast--two-line \{ width: min\(400px, 100%\); min-height: 72px; \}/);
  assert.match(styles, /--aisee-color-semantic-button-analysis/);
  assert.match(styles, /--aisee-color-semantic-feedback-wrong/);
  assert.match(styles, /--aisee-color-semantic-button-agent/);
  assert.match(styles, /height: 4px;[\s\S]*?aisee-toast-progress/);
  assert.match(detail, /368×56 one line/);
  assert.match(detail, /400×72 two lines/);
  assert.match(detail, /Brand details updated successfully!/);
  assert.match(detail, /Brand details update failed!/);
  assert.match(detail, /Switched to extension tracking/);
});

test('portal contains an explicit machine-readable AI implementation contract', async () => {
  const contractSource = portal.match(/<script type="application\/json" id="aisee-ai-contract">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(contractSource, 'AI contract should be embedded in the standalone portal');
  const contract = JSON.parse(contractSource);
  assert.equal(contract.rules.appTypography, 'Karla only');
  assert.equal(contract.rules.analysisPrimary, '#CFFF29');
  assert.match(contract.rules.implementation, /Current exported components/);
  const handoff = await readFile(new URL('../docs/AI_HANDOFF.md', import.meta.url), 'utf8');
  assert.match(handoff, /能读到 HTML 不代表|不等于它会自动按照 demo 精确实现/);
  assert.match(handoff, /docs\/TEAM_DECISIONS\.md/);
});

test('portal exposes the published Figma color architecture as a searchable table', () => {
  const colorSource = portal.match(/<script type="application\/json" id="aisee-color-architecture">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(colorSource, 'Color architecture should be embedded in the standalone portal');
  const colors = JSON.parse(colorSource);
  assert.equal(colors.primitive.length, 44);
  assert.equal(colors.semantic.length, 44);
  assert.equal(colors.meta.registeredSemanticCount, 46);
  assert.equal(colors.meta.publishedSemanticCount, 44);
  assert.ok(!colors.semantic.some(token => token.name === 'colour/feedback/success'));
  assert.ok(!colors.semantic.some(token => token.name === 'colour/feedback/warning'));
  const verifiedTag = colors.semantic.find(token => token.id === 'tag-base');
  assert.equal(verifiedTag?.verified, true);
  assert.match(verifiedTag?.usage || '', /深色按钮上的文字与 Icon/);
  assert.match(portal, /已验证原始值/);
  const hoverBackground = colors.semantic.find(token => token.id === 'bg-hover');
  assert.equal(hoverBackground?.usageVerified, true);
  assert.match(hoverBackground?.usage || '', /Hover 状态背景叠色/);
  assert.equal(hoverBackground?.reviewMode, 'Dark');
  assert.match(portal, /用途已验证/);
  assert.ok(portal.includes('token.reviewMode ? `${token.reviewMode} 待校对`'));
  assert.match(portal, /页面和组件只能使用语义化变量/);
  assert.match(portal, /id="colorTokenRows"/);
  assert.match(portal, /data-color-layer="primitive"/);
  assert.match(portal, /data-color-layer="semantic"/);
  assert.match(portal, /--aisee-color-semantic-/);
});

test('checkbox is published, documented and follows the v6 selection states', async () => {
  const source = await readFile(new URL('../src/components/Checkbox.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/Checkbox/Checkbox.html', import.meta.url), 'utf8');
  const overview = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const exports = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
  assert.match(source, /export const Checkbox/);
  assert.match(source, /type="checkbox"/);
  assert.match(exports, /components\/Checkbox/);
  assert.match(styles, /\.aisee-checkbox__control \{[\s\S]*?width: 18px;[\s\S]*?height: 18px;[\s\S]*?border: 1\.5px solid/);
  assert.match(styles, /\.aisee-checkbox-row:hover \.aisee-checkbox__control \{ background: var\(--aisee-module-primary\); \}/);
  for (const state of ['Default', 'Row hover', 'Selected', 'Disabled']) assert.match(detail, new RegExp(state));
  assert.match(overview, /<h2>Checkbox<\/h2>/);
  assert.match(portal, /components\/Checkbox\/Checkbox\.html/);
});

test('current component detail pages stay aligned with the published control specs', async () => {
  const input = await readFile(new URL('../components/Input/Input.html', import.meta.url), 'utf8');
  const dialog = await readFile(new URL('../components/Dialog/Dialog.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const toggle = await readFile(new URL('../components/Toggle/Toggle.html', import.meta.url), 'utf8');
  const tabs = await readFile(new URL('../components/Tabs/Tabs.html', import.meta.url), 'utf8');
  const card = await readFile(new URL('../components/Card/Card.html', import.meta.url), 'utf8');
  assert.match(input, /height:36px/);
  assert.match(input, /--line:rgba\(17,17,17,\.05\)/);
  assert.match(input, /input\.is-error\{border-color:#ec5212;box-shadow:none\}/);
  assert.match(input, /Karla-VariableFont_wght\.ttf/);
  assert.match(dialog, /Karla-VariableFont_wght\.ttf/);
  assert.match(dialog, /\.dialog\{[^}]*width:min\(480px,100%\)/);
  assert.match(dialog, /\.field input\{[^}]*height:40px/);
  assert.match(styles, /\.aisee-dialog \{[^}]*width: min\(480px, calc\(100vw - 32px\)\)/);
  assert.match(styles, /\.aisee-dialog \.aisee-input \{ min-height: 40px; \}/);
  assert.doesNotMatch(dialog, /<p class="result"/);
  assert.match(toggle, /width:24px;height:16px/);
  assert.match(toggle, /width:10px;height:10px/);
  assert.doesNotMatch(toggle, /Track 36×20px/);
  assert.match(tabs, /gap:24px/);
  assert.match(tabs, /padding:8px 0/);
  assert.match(card, /Current neutral content surface|A neutral surface/);
  assert.match(portal, /components\/Card\/Card\.html/);
});

test('component preview uses the AISEE banner shell and compact type hierarchy', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  assert.match(components, /class="component-banner"/);
  assert.match(components, /src="\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(components, /\.component-banner h1\{[^}]*font-size:20px[^}]*font-weight:600/);
  assert.match(components, /\.card h2\{[^}]*font-size:14px[^}]*font-weight:600/);
  assert.match(components, /analysis:\{primary:'#CFFF29',banner:'#F5FFD4'/);
  assert.match(components, /post:\{primary:'#FFE253',banner:'#FFFADD'/);
  assert.match(components, /engage:\{primary:'#FFE253',banner:'#F3E7F4'/);
  assert.doesNotMatch(components, /<header class="top">/);
});

test('danger button follows the Figma destructive action style', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /\.row \.danger\{[^}]*padding:8px 16px[^}]*font:500 14px\/18px Karla/);
  assert.match(styles, /\.aisee-button--danger \{[\s\S]*?color: var\(--aisee-color-white\);[\s\S]*?background: var\(--aisee-color-danger\);[\s\S]*?font-size: 14px;/);
  const colorSource = portal.match(/<script type="application\/json" id="aisee-color-architecture">([\s\S]*?)<\/script>/)?.[1];
  const colors = JSON.parse(colorSource);
  const wrong = colors.semantic.find(token => token.name === 'colour/feedback/wrong');
  assert.equal(wrong.light.value, '#EC5212');
  assert.equal(wrong.light.ref, 'colour/social/producthunt');
});

test('component modal previews keep vertical breathing room inside demo surfaces', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  assert.match(components, /\.modal-demo\{min-height:300px;padding:32px 24px\}/);
  assert.match(components, /\.confirm-demo\{min-height:360px;padding:32px 24px\}/);
});

test('standard dialogs use 600 and confirmation dialogs use the lighter 500 title', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /\.modal h3\{[^}]*font-weight:600/);
  assert.match(components, /\.confirm-head h3\{[^}]*font-weight:500/);
  assert.match(styles, /\.aisee-dialog__title \{[^}]*font-weight: 600;/);
  assert.match(styles, /\.aisee-confirmation-dialog__title \{[^}]*font-weight: 500;/);
  assert.doesNotMatch(components, /(?:\.modal h3|\.confirm-head h3)\{[^}]*font-weight:700/);
  assert.doesNotMatch(styles, /(?:\.aisee-dialog__title|\.aisee-confirmation-dialog__title) \{[^}]*font-weight: 700;/);
});

test('confirmation dialog follows the Figma unsaved changes pattern', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/ConfirmationDialog/ConfirmationDialog.html', import.meta.url), 'utf8');
  const design = await readFile(new URL('../docs/aisee-dapp-design.v6.md', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('../src/components/ConfirmationDialog.tsx', import.meta.url), 'utf8');
  assert.match(components, /Confirmation Dialog/);
  assert.match(components, /Discard unsaved changes\?/);
  assert.match(components, /Keep Editing[\s\S]*?Discard Changes/);
  assert.match(styles, /\.aisee-confirmation-dialog \{[\s\S]*?width: min\(512px[\s\S]*?padding: 24px;/);
  assert.match(styles, /\.aisee-confirmation-dialog__description \{[^}]*color: var\(--aisee-color-black\);/);
  assert.match(styles, /\.aisee-confirmation-dialog__actions \.aisee-button--secondary:hover:not\(:disabled\) \{[^}]*background: rgba\(17,17,17,\.06\);/);
  assert.match(styles, /\.aisee-confirmation-dialog__actions \.aisee-button \{ width: 100%; height: 44px;/);
  assert.match(detail, /@font-face\{font-family:Karla/);
  assert.match(detail, /class="toast-viewport"/);
  assert.match(detail, /showToast\('Changes discarded','success'\)/);
  assert.doesNotMatch(detail, /class="result"/);
  assert.match(design, /ToastViewport[\s\S]*?不得挂载在 dialog DOM 内/);
  assert.match(source, /aria-labelledby=\{titleId\}/);
  assert.match(source, /aria-describedby=\{descriptionId\}/);
  assert.match(source, /dialog-close\.svg/);
  await access(new URL('../assets/dialog-close.svg', import.meta.url));
});

test('portal uses the official AISEE logo mark', async () => {
  assert.match(portal, /src="\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(portal, /\.brand-mark \{[\s\S]*?width: 28px;[\s\S]*?height: 28px;/);
  assert.match(portal, /\.brand-wordmark \{[^}]*font-family: "Karla", sans-serif;[^}]*font-size: 30px;[^}]*font-weight: 500;/);
  assert.match(portal, /<strong class="brand-wordmark">aisee<\/strong>/);
  await access(new URL('../assets/aisee-logo-mark.png', import.meta.url));
});

test('iconography points to the StemUI GitHub source and npm package', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const workflow = await readFile(new URL('../docs/ICON_LIBRARY.md', import.meta.url), 'utf8');
  assert.match(portal, /https:\/\/github\.com\/qi15582378779\/stemui/);
  assert.match(portal, /https:\/\/www\.npmjs\.com\/package\/@stemui\/icons\?activeTab=readme/);
  assert.match(readme, /npm install @stemui\/icons/);
  assert.match(workflow, /npm run publish:icons/);
  assert.match(workflow, /npm run publish:icons:manual/);
});

test('StemUI preview snapshot is read-only, versioned and complete', async () => {
  const manifest = JSON.parse(await readFile(new URL('../assets/stemui/manifest.json', import.meta.url), 'utf8'));
  const syncScript = await readFile(new URL('../scripts/sync-stemui-assets.mjs', import.meta.url), 'utf8');
  assert.equal(manifest.package, '@stemui/icons');
  assert.equal(manifest.mode, 'read-only source snapshot');
  assert.ok(manifest.assets.length >= 32, `expected at least 32 StemUI preview assets, found ${manifest.assets.length}`);
  for (const file of ['nav-calendar.svg', 'nav-growth.svg', 'avatar-user.svg', 'avatar-social-1.svg', 'platform-x.svg', 'platform-linkedin.svg', 'platform-reddit.svg']) {
    await access(new URL(`../assets/stemui/${file}`, import.meta.url));
  }
  assert.doesNotMatch(syncScript, /writeFile\([^)]*sourceRoot|copyFile\([^,]+,\s*source/);
});

test('webapp UI kit follows the current Growth Loop shell and previews every functional destination', async () => {
  const kit = await readFile(new URL('../ui_kits/webapp/index.html', import.meta.url), 'utf8');
  const shared = await readFile(new URL('../ui_kits/webapp/Components.jsx', import.meta.url), 'utf8');
  const dna = JSON.parse(await readFile(new URL('../ui_kits/webapp/design-dna-v5.5.json', import.meta.url), 'utf8'));
  assert.match(kit, /src="\.\.\/\.\.\/assets\/aisee-logo-wordmark\.svg"/);
  assert.match(kit, /src="\.\.\/\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(kit, /Growth Loop/);
  const destinations = ['Overview', 'Analysis', 'Growth', 'Improve Score', 'Build Brand Influence', 'Engage', 'Signal Feed', 'Keywords & Accounts', 'Replies', 'Post', 'Calendar', 'Channels', 'Media', 'Verify', 'Connection'];
  for (const destination of destinations) {
    assert.match(kit, new RegExp(`['\"]${destination.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}['\"]`));
  }
  assert.match(kit, /name="aisee-preview-pages"/);
  assert.match(kit, /history\.replaceState/);
  assert.match(kit, /hashchange/);
  assert.match(kit, /Turn insights into measurable growth/);
  assert.match(kit, /Score Improvement Plan/);
  assert.match(kit, /Content Calendar/);
  assert.match(kit, /assets\/stemui\/avatar-user\.svg/);
  assert.match(kit, /avatar-social-/);
  assert.match(kit, /platform-/);
  assert.doesNotMatch(kit, /const svg=/);
  assert.doesNotMatch(kit, /This navigation destination is retained/);
  assert.match(kit, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(kit, /\['Analysis', 'Post Agent', 'Engage'\]/);
  assert.match(shared, /aisee-logo-wordmark\.svg/);
  assert.match(shared, /aisee-logo-mark\.png/);
  assert.match(shared, /label: 'Verify'/);
  assert.match(shared, /label: 'Connection'/);
  assert.match(shared, /function StemUIAsset/);
  assert.match(shared, /name="avatar-user"/);
  assert.doesNotMatch(shared, /Small Icons \(inline SVG\)/);
  assert.match(shared, /fontSize: 20, fontWeight: 600/);
  assert.doesNotMatch(shared, /borderRadius: '320px 320px 0 0'/);
  assert.equal(dna.design_system.layout.columns, '4 KPI columns followed by asymmetric two-column content');
  assert.equal(dna.visual_effects['3d_elements'].enabled, false);
});

test('webapp UI kit inline controller is syntactically valid', async () => {
  const kit = await readFile(new URL('../ui_kits/webapp/index.html', import.meta.url), 'utf8');
  const scripts = [...kit.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Function(scripts[0][1]));
});

test('current PlanCard follows the latest Figma upgrade-plan pattern while legacy remains available', async () => {
  const current = await readFile(new URL('../components/PlanCardCurrent/PlanCardCurrent.html', import.meta.url), 'utf8');
  const legacy = await readFile(new URL('../components/PlanCard/PlanCard.html', import.meta.url), 'utf8');
  const source = await readFile(new URL('../src/components/PlanCard.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  for (const label of ['Monthly', 'Yearly', '15% off', 'Starter', 'Developer', 'Pro', 'Analysis', 'Engage', 'Post Agent', 'Support']) {
    assert.ok(current.includes(label), `current PlanCard should include ${label}`);
  }
  assert.match(current, /assets\/plan-card\/current\/starter\.png/);
  assert.match(current, /assets\/plan-card\/current\/developer\.png/);
  assert.match(current, /assets\/plan-card\/current\/pro\.png/);
  assert.match(current, /border-radius:24px/);
  assert.match(source, /export function PlanCard/);
  assert.match(styles, /\.aisee-plan-card \{[^}]*border-radius: 24px;/);
  assert.match(portal, /components\/PlanCardCurrent\/PlanCardCurrent\.html/);
  assert.doesNotMatch(portal, /name: "PlanCard", path: "components\/PlanCard\/PlanCard\.html"/);
  assert.match(legacy, /Starter/);
  const scripts = [...current.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Function(scripts[0][1]));
  await Promise.all(['starter.png', 'developer.png', 'pro.png'].map(name => access(new URL(`../assets/plan-card/current/${name}`, import.meta.url))));
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

test('sidebar subgroup chevrons keep readable spacing and vertical alignment', () => {
  assert.match(portal, /\.nav-subgroup-toggle \{[^}]*align-items: center;/);
  assert.match(portal, /\.nav-subgroup-toggle > span:last-child \{[^}]*align-items: center;[^}]*line-height: 18px;/);
  assert.match(portal, /\.nav-subgroup-chevron \{[^}]*width: 14px;[^}]*height: 14px;[^}]*margin-right: 10px;[^}]*place-items: center;/);
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
  assert.match(portal, /dApp \/ App \/ Webapp[\s\S]*?Karla \+ Digital Numbers/);
  assert.match(portal, /Never redraw the eye or wordmark with CSS/);
});

test('product overview contains the complete six-capability loop', () => {
  for (const capability of ['Analysis / GEO', 'Growth', 'Engage', 'Post Agent', 'Verify', 'Connection']) {
    assert.match(portal, new RegExp(`<h3>${capability.replace('/', '\\/')}</h3>`));
  }
  assert.match(portal, /Analysis diagnoses → Growth prioritizes → Engage and Post execute → Verify measures/);
  assert.match(portal, /Analysis, Growth, Engage, Post Agent, Verify, Connection and account workflows/);
});

test('brand and the scoped Score Gauge font are self-hosted', async () => {
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
  assert.doesNotMatch(foundations, /DigitalNumbers-Regular|font-family:\s*(?:'|")?Digital Numbers/i);
  assert.match(components, /DigitalNumbers-Regular 2\.ttf/);
  assert.match(components, /font:400 20px\/26px 'Digital Numbers',monospace/);
});
