import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'vite';

const require = createRequire(import.meta.url);
async function load(name) {
  const result = await build({ configFile: false, logLevel: 'silent', build: {
    write: false, minify: false,
    lib: { entry: fileURLToPath(new URL(`../src/components/${name}.tsx`, import.meta.url)), formats: ['cjs'] },
    rollupOptions: { external: ['react', 'react/jsx-runtime'] },
  } });
  const output = (Array.isArray(result) ? result[0] : result).output.find(item => item.type === 'chunk');
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output.code)(require, module, module.exports);
  return module.exports;
}
const { Card } = await load('Card');
const { Textarea } = await load('Input');
const render = (component, props) => renderToStaticMarkup(createElement(component, props));

test('collapsible cards preserve field DOM and link the toggle to its hidden content', () => {
  const props = { title: 'Preferences', collapsible: true, defaultExpanded: false,
    headerAction: createElement('button', null, 'Help'),
    children: createElement('input', { defaultValue: 'Saved value' }), footer: 'Save changes' };
  const html = render(Card, props);
  const contentId = html.match(/aria-controls="([^"]+)"/)[1];
  assert.match(html, /aria-expanded="false"/);
  assert.ok(html.includes(`id="${contentId}" class="aisee-card__content" hidden=""`));
  assert.match(html, /value="Saved value"/);
  assert.match(html, /Save changes/);
  assert.ok(html.indexOf('Help') < html.indexOf(`id="${contentId}"`));
  const controlled = render(Card, { ...props, expanded: true });
  assert.match(controlled, /aria-expanded="true"/);
  assert.doesNotMatch(controlled, /hidden=""/);
});

test('existing neutral cards stay static and section styling is opt-in', () => {
  const plain = render(Card, { title: 'Default card', shadow: true, children: 'Content' });
  assert.match(plain, /aisee-card aisee-card--shadow/);
  assert.doesNotMatch(plain, /aisee-card--section|aria-expanded|<button/);
  const section = render(Card, { variant: 'section', title: 'Basic Information', children: 'Form' });
  assert.match(section, /aisee-card--section/);
  const titleId = section.match(/aria-labelledby="([^"]+)"/)[1];
  assert.ok(section.includes(`<h3 id="${titleId}"`));
});

test('Textarea connects errors and caller descriptions while preserving native form attributes', () => {
  const html = render(Textarea, { id: 'description', label: 'Description', error: 'Too long', hint: 'Help',
    'aria-describedby': 'external-help', disabled: true, required: true, name: 'description', defaultValue: '<script>content</script>' });
  assert.match(html, /for="description"/);
  assert.match(html, /aria-describedby="external-help description-description"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /required=""/);
  assert.match(html, /&lt;script&gt;content&lt;\/script&gt;/);
  assert.match(html, /id="description-description"[^>]*>Too long/);
  assert.doesNotMatch(html, />Help</);
});
