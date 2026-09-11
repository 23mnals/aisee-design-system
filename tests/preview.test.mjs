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

test('Brand catalog is grouped by AIsee functional modules', () => {
  const expectedOrder = ['Homepage', 'Common', 'Overview', 'Analyze', 'Growth', 'Post', 'Engage', 'Verify', 'Automation'];
  assert.match(portal, new RegExp(`const brandCategoryOrder = \\[${expectedOrder.map(category => `"${category}"`).join(', ')}\\];`));

  const brandEntries = [...portal.matchAll(/\{ group: "Brand",([^}]+)\}/g)].map(match => match[1]);
  assert.ok(brandEntries.length > 0, 'Brand entries should exist');
  assert.ok(brandEntries.every(entry => /category: "[^"]+"/.test(entry)), 'every Brand entry must declare a category');

  const categories = new Set(brandEntries.map(entry => entry.match(/category: "([^"]+)"/)?.[1]));
  // Overview remains a reserved slot in the taxonomy; the current Brand
  // catalog has no Overview page after Homepage content is moved out.
  assert.deepEqual([...categories].sort(), expectedOrder.filter(category => category !== 'Overview').sort());
  assert.match(portal, /category: "Homepage", name: "About Us — Design Faithful"/);
  assert.match(portal, /category: "Common", name: "Update Tutorial Preview"/);
  assert.match(portal, /category: "Common", name: "Install Tutorial Preview"/);
  assert.doesNotMatch(portal, /category: "Automation", name: "(?:Update|Install) Tutorial Preview"/);
  assert.doesNotMatch(portal, /category: "Overview", name: "About Us/);
  assert.match(portal, /group === "Brand"[\s\S]*?brandCategoryOrder\.map/);
  assert.match(portal, /item\.category \|\| ""/);
});

test('legacy labels stay out of the sidebar and use a lightweight inline title status', () => {
  assert.doesNotMatch(portal, /item\.status === "Legacy" \? '<span class="item-tag">Legacy<\/span>'/);
  assert.match(portal, /id="previewTitleTag" hidden/);
  assert.match(portal, /\.preview-title-tag \{[\s\S]*font: 500 10px\/14px Karla/);
  assert.match(portal, /\.preview-title-tag\[hidden\] \{ display: none !important; \}/);
  assert.match(portal, /\.preview-meta\.has-inline-tag h1 \{[\s\S]*display: flex/);
  assert.match(portal, /previewMeta\.classList\.toggle\("has-inline-tag", isLegacy\)/);
  assert.match(portal, /previewTitleTag\.textContent = isLegacy \? "legacy" : ""/);
  assert.match(portal, /previewTag\.textContent = isBrandOutput \? "Brand" : ""/);
  assert.match(portal, /previewTag\.hidden = !isBrandOutput/);
});

test('every catalog preview exists and paths are unique', async () => {
  const paths = [...portal.matchAll(/path: "([^"]+)"/g)].map(match => match[1]);
  // Three duplicate legacy Engage pages were intentionally removed from the catalog.
  assert.ok(paths.length >= 37, `expected at least 37 previews, found ${paths.length}`);
  assert.equal(new Set(paths).size, paths.length, 'catalog paths must be unique');
  await Promise.all(paths.map(path => access(new URL(path, projectUrl))));
});

test('Logo animation exposes faster idle motion and the three real delivery files', async () => {
  const preview = await readFile(new URL('../brand/pages/logo-animation/preview.html', import.meta.url), 'utf8');
  const component = await readFile(new URL('../src/components/AiseeLogoAnimation.tsx', import.meta.url), 'utf8');
  const svg = await readFile(new URL('../brand/assets/logo-animated.svg', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../brand/pages/logo-animation/README.md', import.meta.url), 'utf8');

  assert.match(component, /const IDLE_LOOK_CYCLE_MS = 2600/);
  assert.match(component, /const BLINK_INTERVAL_MIN_MS = 2200/);
  assert.match(component, /const BLINK_INTERVAL_JITTER_MS = 1000/);
  assert.match(preview, /idleLook\(\(now % 2600\) \/ 2600\)/);
  assert.match(preview, /nextBlink = now \+ 2200 \+ Math\.random\(\) \* 1000/);
  assert.match(svg, /idleLook\(\(now % 2600\) \/ 2600\)/);
  assert.match(svg, /nextBlink = now \+ 2200 \+ Math\.random\(\) \* 1000/);
  assert.match(readme, /2\.2–3\.2 秒/);

  assert.doesNotMatch(preview, /id="copy-tsx"/);
  assert.match(portal, /id="copyTsxHeader"[^>]*hidden/);
  assert.match(portal, /copyTsxHeader\.hidden = item\.path !== logoAnimationPath/);
  assert.match(portal, /fetch\("src\/components\/AiseeLogoAnimation\.tsx"/);
  assert.match(preview, /id="download-bundle"/);
  assert.match(preview, /application\/zip/);
  assert.match(preview, /aisee-logo-animation-delivery\.zip/);
  assert.match(preview, /在页面头部复制 TSX，或下载完整三件套。/);
  assert.match(preview, /id="copy-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(preview, /href="\.\.\/\.\.\/\.\.\/src\/components\/AiseeLogoAnimation\.tsx" download="AiseeLogoAnimation\.tsx"/);
  assert.match(preview, /href="preview\.html" download="preview\.html"/);
  assert.match(preview, /href="README\.md" download="README\.md"/);
  assert.match(preview, /rgba\(17,17,17,\.05\)/);
  assert.match(preview, /\.download-action \{ display: flex; align-items: center; justify-content: center/);
  assert.match(preview, /\.delivery-action:focus-visible/);
  assert.match(preview, /min-height: 44px/);
});

test('static site build publishes the canonical Logo Animation TSX delivery source', async () => {
  const builder = await readFile(new URL('../scripts/build-static-site.mjs', import.meta.url), 'utf8');
  assert.match(builder, /src\/components\/AiseeLogoAnimation\.tsx/);
  assert.match(builder, /logoAnimationSource/);
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
  const detail = await readFile(new URL('../components/Select/Select.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('../src/components/Dropdown.tsx', import.meta.url), 'utf8');
  await access(new URL('../assets/stemui/line_chevron-up.svg', import.meta.url));
  assert.match(components, /Select \/ Dropdown/);
  assert.match(components, /class="select-trigger"[\s\S]*?aria-haspopup="listbox"[\s\S]*?aria-expanded="true"/);
  assert.match(components, /class="select-menu"[\s\S]*?role="listbox"/);
  assert.match(components, /class="select-option selected"[\s\S]*?role="option"[\s\S]*?aria-selected="true"/);
  assert.match(components, /\.select-menu\{[^}]*top:70px/);
  assert.match(components, /\.select-option:hover,\.select-option\.selected\{background:rgba\(17,17,17,\.05\)\}/);
  assert.match(styles, /\.aisee-dropdown__menu \{[\s\S]*?top: calc\(100% \+ 8px\);[\s\S]*?border: 1px solid var\(--aisee-color-black\);[\s\S]*?box-shadow: var\(--aisee-shadow-dropdown\);/);
  assert.match(styles, /\.aisee-dropdown__option\[aria-selected="true"\] \{ background: rgba\(17,17,17,\.05\);/);
  assert.match(styles, /\.aisee-dropdown__filter:hover:not\(:disabled\),[\s\S]*?box-shadow: 0 0 0 var\(--aisee-size-input-ring\) var\(--aisee-module-primary\)/);
  assert.match(source, /aria-haspopup="listbox"/);
  assert.match(source, /role="option"/);
  assert.match(source, /ArrowDown/);
  assert.match(source, /Escape/);
  assert.match(source, /selectionMode\?: 'single' \| 'multiple'/);
  assert.match(source, /filterable\?: boolean/);
  assert.match(source, /editable\?: boolean/);
  assert.match(source, /aria-multiselectable/);
  assert.match(source, /line_chevron-up\.svg/);
  assert.match(source, /aisee-dropdown__option-leading/);
  assert.doesNotMatch(source, /aisee-dropdown__option.*<svg/);
  assert.match(detail, /line_chevron-up\.svg/);
  assert.match(styles, /\.aisee-dropdown__caret \{[^}]*transform: rotate\(90deg\)/);
  assert.match(styles, /\.aisee-dropdown__trigger \{[\s\S]*?font-size: 14px;[\s\S]*?line-height: 20px;/);
  assert.match(styles, /\.aisee-dropdown__option \{[\s\S]*?font-size: 14px;[\s\S]*?line-height: 20px;/);
  assert.match(styles, /\.aisee-dropdown__empty \{[^}]*font-size: 14px; line-height: 20px;/);
  assert.match(styles, /\.aisee-dropdown__trigger\[aria-expanded="true"\] \.aisee-dropdown__caret,[\s\S]*?transform: rotate\(-90deg\)/);
  assert.match(detail, /option-leading/);
  assert.match(detail, /\.option\{[^}]*font-size:14px;line-height:20px/);
  assert.match(detail, /\.suggestion\{[^}]*font-size:14px;line-height:20px/);
  assert.match(detail, /\.clear\{[^}]*font-size:14px;line-height:20px/);
  assert.match(detail, /\.menu-search:hover,.menu-search:focus\{border-color:var\(--black\);outline:0;box-shadow:0 0 0 2px var\(--lime\)\}/);
  assert.doesNotMatch(detail, /class="check"/);
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
  assert.match(styles, /z-index: 0; inset: 0; background: url\('\.\.\/assets\/score-gauge\/score-gauge-texture\.png'\)/);
  assert.match(styles, /\.aisee-score-gauge__guide path \{ fill: none; stroke: var\(--aisee-color-black\); stroke-width: \.659px; stroke-dasharray: 2 2/);
  assert.match(source, /M0 59\.091A59\.091 59\.091 0 0 0 118\.182 59\.091/);
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
  assert.match(input, /label\{display:block;margin-bottom:8px;font-size:12px;font-weight:600;line-height:18px\}/);
  assert.match(input, /\.content-frame,\.card\{width:640px;max-width:100%/);
  assert.match(input, /main,\.page,#root\{width:640px!important;max-width:100%!important/);
  assert.match(input, /<section class="content-frame" aria-label="Input state examples">/);
  assert.match(input, /<h2 class="aisee-content-heading">Usage[\s\S]*?<\/h2><div class="content-frame">/);
  assert.match(input, /<h2 class="aisee-content-heading">Specs[\s\S]*?<\/h2><div class="content-frame">/);
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

test('updated components use a static Figma-aligned NEW label', async () => {
  const source = await readFile(new URL('../src/components/Toggle.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/Toggle/Toggle.html', import.meta.url), 'utf8');
  const overview = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  assert.match(source, /className="aisee-toggle__label"/);
  assert.match(styles, /cubic-bezier\(\.34, 1\.56, \.64, 1\)/);
  assert.match(styles, /scaleX\(1\.2\)/);
  assert.match(styles, /scaleX\(1\.4\) scaleY\(\.6\)/);
  assert.match(detail, /<h2 class="aisee-content-heading">Motion[\s\S]*?aisee-content-new[\s\S]*?<\/h2>/);
  assert.match(detail, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(overview, /class="toggle-label"/);
  assert.match(portal, /name: "Toggle"[^\n]+updated: true/);
  assert.match(portal, /\.nav-new-label \{[\s\S]*min-width: 33px;[\s\S]*height: 16px;/);
  assert.match(portal, /color: #82006c;[\s\S]*background: #fbd1ef;/);
  assert.match(portal, /hasUpdate \? '<span class="nav-new-label" aria-hidden="true">NEW<\/span>'/);
  assert.match(portal, /const hasUpdate = item\.updated === true/);
  assert.match(portal, /updated: page\.updated === true/);
  assert.doesNotMatch(portal, /readUpdatesStorageKey|hasUnreadUpdate|markUpdateRead/);
});

test('Tabs exposes underline, three segmented compositions and the platform composition', async () => {
  const source = await readFile(new URL('../src/components/Tabs.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/Tabs/Tabs.html', import.meta.url), 'utf8');
  assert.match(source, /TabsVariant = 'underline' \| 'segmented'/);
  assert.match(source, /TabsLayout = 'text' \| 'icon-text' \| 'icon' \| 'platform'/);
  assert.match(styles, /\.aisee-tabs--segmented/);
  assert.match(styles, /\.aisee-tabs--icon-text/);
  assert.match(styles, /\.aisee-tabs--icon/);
  assert.match(styles, /\.aisee-tab:hover:not\(:disabled\) \{ color: var\(--aisee-color-black\); \}/);
  assert.match(styles, /\.aisee-tabs--segmented \.aisee-tab:hover:not\(:disabled\) \{ background: rgba\(17,17,17,\.04\); \}/);
  assert.match(detail, /\.tab:hover:not\(:disabled\)\{color:#111\}/);
  assert.match(detail, /\.segmented \.tab:hover:not\(:disabled\)\{background:rgba\(17,17,17,\.04\)\}/);
  assert.match(detail, /Segmented · Icon \+ text/);
  assert.match(detail, /Segmented · Text only/);
  assert.match(detail, /Segmented · Icon only/);
  assert.match(detail, /Underline · Platform logo \+ text/);
  assert.match(detail, /class="tab-indicator" aria-hidden="true"/);
  assert.match(detail, /indicator\.animate\(\[/);
  assert.match(detail, /scaleX\(1\.055\) scaleY\(\.95\)/);
  assert.match(detail, /scaleX\(\.975\) scaleY\(1\.025\)/);
  assert.match(detail, /duration:520,easing:'cubic-bezier\(\.22,\.72,\.18,1\)'/);
  assert.match(detail, /prefers-reduced-motion: reduce/);
  assert.match(detail, /\.platform \.tab\{position:relative\}/);
  assert.match(detail, /translateY\(-3px\)/);
  assert.match(styles, /\.aisee-tabs--platform/);
  assert.match(styles, /opacity: \.8/);
  await Promise.all(['write.svg', 'rewrite.svg', 'day.svg', 'week.svg', 'calendar.svg', 'y.svg', 'quora.svg', 'substack.svg'].map(file => access(new URL(`../assets/tabs/${file}`, import.meta.url))));
});

test('Tabs motion study stays standalone until the user approves it', async () => {
  const motion = await readFile(new URL('../components/Tabs/TabsMotionPreview.html', import.meta.url), 'utf8');
  assert.match(motion, /Preview only · not synced to the production Tabs component/);
  assert.match(motion, /class="indicator"/);
  assert.match(motion, /indicator\.animate\(\[/);
  assert.match(motion, /scaleX\(1\.055\) scaleY\(\.95\)/);
  assert.match(motion, /scaleX\(\.975\) scaleY\(1\.025\)/);
  assert.match(motion, /duration:520,easing:'cubic-bezier\(\.22,\.72,\.18,1\)'/);
  assert.match(motion, /stretch \+ overshoot \+ soft squash · fixed 7px corner radius/);
  assert.doesNotMatch(motion, /segmented\.is-moving \.indicator/);
  assert.doesNotMatch(motion, /border-radius 180ms/);
  assert.match(motion, /ResizeObserver/);
  assert.match(motion, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(portal, /TabsMotionPreview\.html/);
});

test('Tag Input previews a draft and commits or removes tags with the expected keyboard rules', async () => {
  const source = await readFile(new URL('../src/components/TagInput.tsx', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../components/TagInput/TagInput.html', import.meta.url), 'utf8');
  const exports = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
  assert.match(source, /event\.key === 'Enter'/);
  assert.match(source, /event\.key === 'Backspace'/);
  assert.match(source, /aisee-tag-input__draft/);
  assert.match(styles, /border: 1px dashed rgba\(17,17,17,\.06\)/);
  assert.match(styles, /box-shadow: 0 0 0 3px var\(--aisee-color-post-agent-primary\)/);
  assert.match(styles, /\.aisee-tag-input:hover:not\(\[aria-disabled="true"\]\)/);
  assert.match(styles, /\.aisee-tag-input__add:hover:not\(:disabled\) \{ background: var\(--aisee-color-post-agent-primary-hover\); \}/);
  assert.match(styles, /\.aisee-tag-input__add-icon \{[^}]*color: currentColor;/);
  assert.match(styles, /\.aisee-tag-input__add-icon::before \{ content: '\+'; \}/);
  assert.match(detail, /\.control:hover:not\(:has\(input:disabled\)\),\.control:focus-within/);
  assert.match(detail, /\.add:hover:not\(:disabled\)\{background:#fce055\}/);
  assert.match(detail, /\.add::before\{[^}]*color:currentColor;content:"\+"/);
  assert.match(detail, /Enter or click to add/);
  assert.match(exports, /components\/TagInput/);
  assert.match(portal, /name: "Tag Input"[^\n]+updated: true/);
  await Promise.all(['add.svg', 'close.svg'].map(file => access(new URL(`../assets/tag-input/${file}`, import.meta.url))));
});

test('Current component pages use the shared 640px framed documentation layout', async () => {
  const layout = await readFile(new URL('../components/component-doc-layout.css', import.meta.url), 'utf8');
  assert.match(layout, /width: 640px !important/);
  assert.match(layout, /max-width: 100% !important/);
  assert.match(layout, /main > h2 \+ section/);
  const currentPaths = [...portal.matchAll(/\{ group: "Components",[^\n]+path: "([^"]+)"[^\n]+status: "Current"/g)].map(match => match[1]).filter(path => path.startsWith('components/'));
  assert.ok(currentPaths.length >= 17, `expected at least 17 Current component pages, found ${currentPaths.length}`);
  for (const path of currentPaths) {
    const html = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(html, /component-doc-layout\.css/, `${path} should load the shared Current-page layout`);
  }
});

test('updated component content uses explicit Campaigns-style NEW labels', async () => {
  const layout = await readFile(new URL('../components/component-doc-layout.css', import.meta.url), 'utf8');
  assert.match(layout, /\.aisee-content-new \{[\s\S]*?color: #82006c;[\s\S]*?background: #fbd1ef;/);
  const updatedPaths = [...portal.matchAll(/\{ group: "Components",[^\n]+path: "([^"]+)"[^\n]+updated: true/g)].map(match => match[1]);
  assert.ok(updatedPaths.length >= 6, `expected updated Current components, found ${updatedPaths.length}`);
  for (const path of updatedPaths) {
    const html = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(html, /aisee-content-new/, `${path} should explicitly identify its new or updated content headings`);
  }
});

test('component title area navigates to adjacent sidebar entries and names each hover target', () => {
  assert.match(portal, /id="contentStepperTemplate"/);
  assert.match(portal, /data-aisee-doc-stepper/);
  assert.match(portal, /data-direction="previous"/);
  assert.match(portal, /data-direction="next"/);
  assert.match(portal, /data-tooltip/);
  assert.match(portal, /\.preview-frame-wrap \{[^}]*position: relative;[^}]*isolation: isolate;/);
  assert.match(portal, /\.preview-frame \{[\s\S]*position: relative;[\s\S]*z-index: 1;/);
  assert.match(portal, /\.aisee-doc-stepper\{position:absolute;[^}]*top:0;right:0/);
  assert.match(portal, /\.aisee-doc-stepper button\{[^}]*width:32px;height:32px;[^}]*border-radius:8px/);
  assert.match(portal, /\.aisee-doc-stepper button>span\{[^}]*width:16px;height:16px/);
  assert.match(portal, /description\.style\.paddingRight = "84px"/);
  assert.match(portal, /previewFrame\.addEventListener\("load", mountFrameStepper\)/);
  assert.match(portal, /<span aria-hidden="true">&#8592;<\/span>/);
  assert.match(portal, /<span aria-hidden="true">&#8594;<\/span>/);
  assert.match(portal, /const previousItem = itemIndex > 0 \? items\[itemIndex - 1\] : null/);
  assert.match(portal, /const nextItem = itemIndex >= 0 && itemIndex < items\.length - 1 \? items\[itemIndex \+ 1\] : null/);
  assert.match(portal, /if \(framePreviousItem\) openItem\(framePreviousItem\.path\)/);
  assert.match(portal, /if \(frameNextItem\) openItem\(frameNextItem\.path\)/);
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

test('all dialogs use the shared 500 title weight', async () => {
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(components, /\.modal h3\{[^}]*font-weight:500/);
  assert.match(components, /\.confirm-head h3\{[^}]*font-weight:500/);
  assert.match(styles, /\.aisee-dialog__title \{[^}]*font-weight: 500;/);
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
  const destinations = ['Overview', 'Analysis', 'Growth', 'Improve Score', 'Build Brand Influence', 'Engage', 'Signal Feed', 'Keywords & Accounts', 'Replies', 'Post', 'Calendar', 'Channels', 'Media', 'Verify', 'Connection', 'Automation'];
  for (const destination of destinations) {
    assert.match(kit, new RegExp(`['\"]${destination.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}['\"]`));
  }
  assert.match(kit, /name="aisee-preview-pages"/);
  assert.match(kit, /history\.replaceState/);
  assert.match(kit, /hashchange/);
  assert.match(kit, /Turn insights into measurable growth/);
  assert.match(kit, /Score Improvement Plan/);
  assert.match(kit, /Content Calendar/);
  assert.match(kit, /group:'Workflows'/);
  assert.match(kit, /Automation runs in WORKFLOWS and stays separate from INTEGRATIONS/);
  assert.match(kit, /id="app-sidebar"/);
  assert.match(kit, /id="sidebarToggle"/);
  assert.match(kit, /aria-controls="app-sidebar"/);
  assert.match(kit, /sidebar-collapsed/);
  assert.match(kit, /--sidebar-collapsed:58px/);
  assert.match(kit, /line_chevron-up\.svg/);
  assert.match(kit, /assets\/stemui\/avatar-user\.svg/);
  assert.match(kit, /icon==='overview'\?'\.\.\/\.\.\/assets\/stemui\/nav-overview\.svg'/);
  assert.doesNotMatch(kit, /banner-overview\.png/);
  assert.doesNotMatch(kit, /const navSvg=/);
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
  assert.match(portal, /\.nav-subgroup-chevron \{[^}]*width: 16px;[^}]*height: 16px;[^}]*margin-right: 8px;[^}]*align-items: center;[^}]*justify-content: center;/);
});

test('current app framework uses 16px main content padding', async () => {
  const spec = await readFile(new URL('../docs/aisee-dapp-design.v6.md', import.meta.url), 'utf8');
  const kit = await readFile(new URL('../ui_kits/webapp/index.html', import.meta.url), 'utf8');
  assert.match(spec, /主内容内边距 \| \*\*16px\*\*/);
  assert.match(kit, /\.main\{min-width:0;overflow:auto;padding:16px\}/);
});

test('overview documents feature-page and specification version rules', () => {
  assert.match(portal, /Figma feature page 5\.7/);
  assert.match(portal, /Design Specification v6/);
  assert.match(portal, /Page 5\.7 adds hosted automatic publishing \(Automation\) under WORKFLOWS; it is not a global version/);
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
