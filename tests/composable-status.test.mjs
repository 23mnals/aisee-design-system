import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'vite';

const require = createRequire(import.meta.url);
async function loadComponent(name, exportName = name) {
  const result = await build({ configFile: false, logLevel: 'silent', build: {
    write: false, minify: false,
    lib: { entry: fileURLToPath(new URL(`../src/components/${name}.tsx`, import.meta.url)), formats: ['cjs'] },
    rollupOptions: { external: ['react', 'react/jsx-runtime'] },
  } });
  const output = (Array.isArray(result) ? result[0] : result).output.find(item => item.type === 'chunk');
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output.code)(require, module, module.exports);
  return module.exports[exportName];
}
const Steps = await loadComponent('Steps');
const EmptyState = await loadComponent('EmptyState');
const updateSelection = await loadComponent('ToggleSelectionGroup', 'updateToggleSelection');
const resolveSelection = await loadComponent('ToggleSelectionGroup', 'resolveToggleSelection');
const render = (component, props) => renderToStaticMarkup(createElement(component, props));

test('Steps renders caller order, translated statuses and only marks the active step current', () => {
  const html = render(Steps, { items: [
    { id: 'one', label: 'First', status: 'complete' },
    { id: 'two', label: 'Second', status: 'active' },
    { id: 'three', label: 'Third', status: 'error' },
    { id: 'four', label: 'Fourth', status: 'pending', iconSrc: '/custom.svg' },
  ], statusLabels: { active: '进行中' }, animated: false });
  assert.ok(html.indexOf('First') < html.indexOf('Second'));
  assert.ok(html.indexOf('Second') < html.indexOf('Third'));
  assert.equal((html.match(/aria-current="step"/g) || []).length, 1);
  assert.match(html, /data-status="active" aria-current="step"/);
  assert.match(html, /进行中/);
  assert.match(html, /data-animated="false"/);
  assert.match(html, /src="\/custom.svg"/);
  assert.doesNotMatch(html, /aisee-steps__thinking/);
});

test('Steps accepts thinking-only content, escapes text and does not create an empty rail', () => {
  const html = render(Steps, { items: [], thinkingSteps: [{ id: 'log', content: '<script>unsafe</script>', status: 'active' }] });
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /&lt;script&gt;unsafe&lt;\/script&gt;/);
  assert.doesNotMatch(html, /aisee-steps__rail/);
  assert.doesNotMatch(render(Steps, { items: [], thinkingSteps: [] }), /<ol|<ul/);
});

test('EmptyState supports all 16 slot combinations without empty wrappers', () => {
  const slots = ['illustration', 'title', 'description', 'action'];
  const contents = [createElement('img', { src: '/illustration.svg', alt: '' }), 'Nothing here', 'Try again later', createElement('button', { disabled: true }, 'Create')];
  for (let mask = 0; mask < 16; mask++) {
    const props = Object.fromEntries(slots.map((slot, index) => [slot, mask & (1 << index) ? contents[index] : undefined]));
    const html = render(EmptyState, props);
    if (mask === 0) { assert.equal(html, ''); continue; }
    slots.forEach((slot, index) => assert.equal(html.includes(`class="aisee-empty-state__${slot}"`), Boolean(mask & (1 << index)), `mask ${mask}: ${slot}`));
    assert.equal(html.includes('aisee-empty-state__copy'), Boolean(mask & 6));
    assert.equal(html.includes('aria-labelledby'), Boolean(mask & 2));
    assert.equal(html.includes('aria-describedby'), Boolean(mask & 4));
    if (mask & 8) assert.match(html, /disabled=""/);
  }
});

test('EmptyState handles empty slots, long text, semantic heading overrides and localized action content', () => {
  assert.equal(render(EmptyState, { title: '', description: null, action: false, illustration: undefined }), '');
  const html = render(EmptyState, { titleAs: 'h3', title: '暂无内容', description: 'long-description-'.repeat(100), action: createElement('a', { href: '/settings' }, '前往设置'), size: 'compact', variant: 'inset', 'aria-label': '空状态' });
  assert.match(html, /<h3/);
  assert.match(html, /href="\/settings"/);
  assert.match(html, /aria-label="空状态"/);
  assert.doesNotMatch(html, /aria-labelledby/);
  assert.match(html, /long-description-/);
});

test('built-in empty illustrations cover all 14 Figma variants and allow custom overrides', async () => {
  const manifest = JSON.parse(await readFile(new URL('../assets/empty-state/library/manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.icons.length, 14);
  for (const icon of manifest.icons) {
    const svg = await readFile(new URL(`../assets/empty-state/library/${icon.file}`, import.meta.url), 'utf8');
    assert.match(svg, /<svg/);
    const html = render(EmptyState, { illustrationName: icon.name, illustrationAlt: icon.label });
    assert.match(html, /aisee-empty-state-illustration/);
    assert.ok(html.includes(`alt="${icon.label}"`));
  }
  assert.equal(render(EmptyState, { illustrationName: 'no-event', illustration: null }), '');
  const custom = render(EmptyState, { illustrationName: 'no-event', illustration: createElement('span', null, 'Custom art') });
  assert.match(custom, /Custom art/);
  assert.doesNotMatch(custom, /aisee-empty-state-illustration/);
});

const options = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'locked', label: 'Locked', disabled: true }];
test('first activation selects available options; off/on restores partial and intentionally empty selections', () => {
  let value = updateSelection(options, { enabled: false }, { type: 'enabled', enabled: true });
  assert.deepEqual(value.selectedIds, ['a', 'b']);
  value = updateSelection(options, value, { type: 'option', id: 'b' });
  assert.deepEqual(value.selectedIds, ['a']);
  value = updateSelection(options, value, { type: 'enabled', enabled: false });
  assert.deepEqual(value.selectedIds, ['a']);
  assert.deepEqual(resolveSelection(options, value).activeSelectedIds, []);
  assert.equal(updateSelection(options, value, { type: 'option', id: 'a' }), value);
  assert.equal(updateSelection(options, value, { type: 'all' }), value);
  value = updateSelection(options, value, { type: 'enabled', enabled: true });
  assert.deepEqual(value.selectedIds, ['a']);
  value = updateSelection(options, value, { type: 'option', id: 'a' });
  value = updateSelection(options, value, { type: 'enabled', enabled: false });
  value = updateSelection(options, value, { type: 'enabled', enabled: true });
  assert.deepEqual(value.selectedIds, []);
});

test('All respects unavailable choices and dynamic options do not silently expand saved scope', () => {
  let value = { enabled: true, selectedIds: ['a', 'locked', 'temporarily-missing'] };
  value = updateSelection(options, value, { type: 'all' });
  assert.deepEqual(new Set(value.selectedIds), new Set(['a', 'b', 'locked', 'temporarily-missing']));
  value = updateSelection(options, value, { type: 'all' });
  assert.deepEqual(value.selectedIds, ['locked', 'temporarily-missing']);
  assert.equal(updateSelection(options, value, { type: 'option', id: 'locked' }), value);
  const resolved = resolveSelection([...options, { id: 'new', label: 'New' }], value);
  assert.deepEqual(resolved.activeSelectedIds, []);
  assert.deepEqual(resolved.visibleSelectedIds, ['locked']);
  assert.ok(resolved.savedIds.includes('temporarily-missing'));
  assert.ok(!resolved.savedIds.includes('new'));
});

test('every registered Demo loads the common Karla policy through a valid relative path', async () => {
  const root = new URL('../', import.meta.url);
  const portal = await readFile(new URL('aisee-design-system-preview.html', root), 'utf8');
  const paths = ['aisee-design-system-preview.html', 'index.html', ...[...portal.matchAll(/path: "([^"]+\.html)"/g)].map(match => match[1])];
  for (const path of new Set(paths)) {
    const url = new URL(path, root);
    const html = await readFile(url, 'utf8');
    const match = html.match(/href="([^"]+)" data-aisee-typography="karla"/);
    assert.ok(match, `${path} must load shared typography`);
    const css = await readFile(new URL(match[1], url), 'utf8');
    assert.match(css, /font-family: Karla, Arial, sans-serif !important/);
  }
  const face = await readFile(new URL('fonts/karla-face.css', root), 'utf8');
  assert.match(face, /Karla-VariableFont_wght\.ttf/);
  assert.match(face, /font-weight: 100 900/);
});

test('static workflow suppresses task states and motion even when status data is supplied', () => {
  const html = render(Steps, { mode: 'static', items: [{ id: 'one', label: 'One', status: 'active', iconSrc: '/feature.svg' }], thinkingSteps: [{ id: 'log', content: 'Working', status: 'active' }] });
  assert.match(html, /data-mode="static" data-animated="false"/);
  assert.match(html, /src="\/feature.svg"/);
  assert.doesNotMatch(html, /aria-current|data-status|aisee-steps__glyph|aisee-steps__thinking|In progress/);
});

test('TutorialSteps preserves content order and optional slots without imposing navigation', async () => {
  const TutorialSteps = await loadComponent('TutorialSteps');
  assert.equal(render(TutorialSteps, { items: [] }), '');
  const html = render(TutorialSteps, { orientation: 'vertical', 'aria-label': '使用教程', items: [
    { id: 'a', title: '添加来源', description: '关键词、账号或社区', iconSrc: '/watch.svg' },
    { id: 'b', title: '查看结果', action: createElement('a', { href: '/feed' }, '打开列表') },
  ] });
  assert.match(html, /data-orientation="vertical"/);
  assert.match(html, /<ol aria-label="使用教程"/);
  assert.ok(html.indexOf('添加来源') < html.indexOf('查看结果'));
  assert.equal((html.match(/aisee-tutorial-steps__description/g) || []).length, 1);
  assert.match(html, /href="\/feed"/);
  assert.doesNotMatch(html, /aria-current|role="button"/);
});

test('Badge source icons and semantic status presets retain existing appearances and localizable text', async () => {
  const Badge = await loadComponent('Badge');
  const source = render(Badge, { variant: 'source', iconName: 'manual', children: '手动创建' });
  assert.match(source, /aisee-badge--source/);
  assert.match(source, /aisee-badge__icon/);
  assert.match(source, /手动创建/);
  assert.doesNotMatch(source, /aisee-badge__dot/);
  for (const status of ['scheduled', 'published', 'draft', 'failed', 'removed']) {
    const html = render(Badge, { variant: 'status', status });
    assert.ok(html.includes(`aisee-badge--status-${status}`));
    assert.match(html, /aisee-badge__glyph/);
  }
  assert.match(render(Badge, { variant: 'dot', color: 'lime', children: 'Active' }), /aisee-badge__dot/);
  assert.match(render(Badge, { variant: 'status', status: 'scheduled', children: '已排期', icon: createElement('img', { src: '/custom.svg', alt: '' }) }), /src="\/custom.svg"/);
});
