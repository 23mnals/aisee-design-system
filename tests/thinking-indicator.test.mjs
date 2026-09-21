import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'vite';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const output = await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:fileURLToPath(new URL('../src/components/ThinkingIndicator.tsx',import.meta.url)),formats:['cjs']},rollupOptions:{external:['react','react/jsx-runtime']}}});
const code = (Array.isArray(output) ? output[0] : output).output.find(item => item.type === 'chunk').code;
const module = {exports:{}};
new Function('require','module','exports',code)(require,module,module.exports);
const render = props => renderToStaticMarkup(createElement(module.exports.ThinkingIndicator, props));

test('thinking indicator is SSR safe, defaults to one stable accessible status and decorative content', () => {
  const html = render({});
  assert.match(html,/role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(html,/__sr-only">Thinking…/);
  assert.match(html,/__words" aria-hidden="true"/);
  assert.match(html,/data-size="default"/);
  assert.match(html,/<svg/);
  assert.doesNotMatch(html,/<animate/,'Server render stays static until browser motion preference is known');
});

test('text-only compact and localized labels preserve host semantics without a provider', () => {
  const html = render({showIcon:false,size:'compact',labels:['思考中','整理中'],'aria-label':'请稍候',className:'host-status'});
  assert.doesNotMatch(html,/<svg|Thinking…|Planning/);
  assert.match(html,/data-size="compact"/);assert.match(html,/host-status/);assert.match(html,/__sr-only">请稍候/);
  assert.match(html,/思考中/);assert.match(html,/整理中/);
  assert.match(render({labels:['','  ']}),/Thinking/,'Empty phrases cannot leave the waiting indicator blank');
});

test('thinking delivery contains its full motion CSS and no demo, font or animation-library dependency', async () => {
  const bundle = JSON.parse(await readFile(new URL('../assets/ai-deliveries/ThinkingIndicator.json',import.meta.url)));
  const files = JSON.parse(gunzipSync(Buffer.from(bundle.payload,'base64')));
  assert.deepEqual(Object.keys(files).sort(),['ThinkingIndicator.tsx','index.ts','styles.css','styles.css.d.ts']);
  const css = Buffer.from(files['styles.css'],'base64').toString();
  assert.match(css,/@supports/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/forced-colors/);
  for (const name of ['aisee-thinking-word-in','aisee-thinking-word-out','aisee-thinking-shimmer']) assert.ok(css.includes('@keyframes '+name));
  assert.doesNotMatch(css,/@font-face|:root|Karla|thinking-demo/);
  assert.deepEqual(bundle.dependencies.map(d=>d.name),['react']);
});
