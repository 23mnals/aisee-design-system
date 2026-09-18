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
const { SegmentedChoice } = await load('SegmentedChoice');
const options = [
  { id: 'single', label: 'Single post', requirement: '280 characters', description: 'A standalone post.' },
  { id: 'thread', label: 'Thread', requirement: 'Connected posts', description: 'A series of posts.' },
  { id: 'locked', label: 'Unavailable', disabled: true },
];
const render = props => renderToStaticMarkup(createElement(SegmentedChoice, { label: 'Post format', options, ...props }));
test('segmented choice exposes one form radio group with requirements and selected explanation', () => {
  const html = render({ name:'format', defaultValue:'single', required:true });
  assert.equal((html.match(/type="radio"/g) || []).length,3);
  assert.equal((html.match(/name="format"/g) || []).length,3);
  assert.equal((html.match(/checked=""/g) || []).length,1);
  assert.match(html, /disabled=""[^>]*value="locked"|value="locked"[^>]*disabled=""/);
  const described = html.match(/aria-describedby="([^"]+)"/)[1].split(' ');
  described.forEach(id=>assert.ok(html.includes(`id="${id}"`)));
  assert.match(html, /aria-live="polite">A standalone post/);
});
test('controlled choice wins over its default and fieldset can disable the full group', () => {
  const html = render({ value:'thread', defaultValue:'single', disabled:true, tone:'yellow' });
  assert.match(html, /<fieldset[^>]*disabled=""/);
  assert.match(html, /checked=""[^>]*value="thread"|value="thread"[^>]*checked=""/);
  assert.match(html, /aria-live="polite">A series of posts/);
  assert.match(html, /aisee-segmented-choice--yellow/);
});
