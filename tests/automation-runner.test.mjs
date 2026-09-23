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
const entry = new URL('../src/components/AutomationRunner.tsx', import.meta.url);
const output = await build({
  configFile: false,
  logLevel: 'silent',
  build: { write: false, minify: false, lib: { entry: fileURLToPath(entry), formats: ['cjs'] }, rollupOptions: { external: ['react', 'react/jsx-runtime'] } },
});
const code = (Array.isArray(output) ? output[0] : output).output.find(item => item.type === 'chunk').code;
const module = { exports: {} };
new Function('require', 'module', 'exports', code)(require, module, module.exports);
const render = props => renderToStaticMarkup(createElement(module.exports.AutomationRunner, props));

test('automation runner renders accessible default, expanded and minimized states', () => {
  const normal = render({ title: 'Running', description: 'Keep open' });
  assert.match(normal, /data-view="default"/);
  assert.match(normal, /aria-expanded="false"/);
  assert.match(normal, /Running/);
  assert.match(normal, /Keep open/);

  const expanded = render({ defaultView: 'expanded', details: [{ id: 'one', label: 'Scheduled publishing', value: 'On' }], onAction() {} });
  assert.match(expanded, /data-view="expanded"/);
  assert.match(expanded, /aria-expanded="true"/);
  assert.match(expanded, /Scheduled publishing/);
  assert.match(expanded, /Back to Automation/);

  const minimized = render({ defaultView: 'minimized' });
  assert.match(minimized, /data-view="minimized"/);
  assert.match(minimized, /aria-label="Restore runner"/);
});

test('automation runner source keeps host-owned state, drag, unique ids and motion fallbacks', async () => {
  const source = await readFile(entry, 'utf8');
  const css = await readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.match(source, /useId\(\)/);
  assert.match(source, /onOpenChange/);
  assert.match(source, /onViewChange/);
  assert.match(source, /setPointerCapture/);
  assert.match(source, /window\.addEventListener\('pointermove'/);
  assert.match(source, /data-dragged/);
  assert.match(source, /onPointerDown=\{beginDrag\}/);
  assert.match(source, /onClickCapture=\{preventDragClick\}/);
  assert.match(source, /onClick=\{restoreFromMinimized\}/);
  assert.match(source, /if \(!session\.moved\) \{[\s\S]*session\.moved = true;[\s\S]*setPointerCapture/);
  assert.match(source, /if \(minimized\) updateView\('default'\)/);
  assert.match(source, /Math\.hypot\(deltaX, deltaY\) < 4/);
  for (const animation of ['aisee-runner-enter', 'aisee-runner-exit', 'aisee-runner-mascot-jelly', 'aisee-runner-blink', 'aisee-runner-eye-panic-open', 'aisee-runner-iris-panic-search']) assert.match(css, new RegExp('@keyframes ' + animation));
  assert.match(css, /__panel:hover \.aisee-automation-runner__eye-window \{ animation: aisee-runner-eye-panic-open/);
  assert.match(css, /__panel:hover \.aisee-automation-runner__iris \{ animation: aisee-runner-iris-panic-search/);
  assert.match(css, /@keyframes aisee-runner-eye-panic-open \{ 0% \{ top: 5\.6px; left: 6px; width: 15\.323px; height: 6\.805px; \}/);
  assert.doesNotMatch(css, /@keyframes aisee-runner-eye-panic-open[^}]*transform: scale/);
  assert.match(css, /@keyframes aisee-runner-iris-panic-search \{ 0% \{ top: 1px; left: 2\.5px; width: 6\.9px; height: 6\.9px;/);
  assert.match(css, /14% \{ top: 2\.821px; left: 4\.182px; width: 7\.582px; height: 9\.845px;/);
  assert.match(source, /--aisee-runner-eye-x-wide/);
  assert.match(source, /onPointerEnter=\{event =>/);
  assert.match(source, /aisee-runner-mascot-jelly/);
  assert.match(css, /prefers-reduced-motion/);
});

test('automation runner delivery is production-only and includes exact required assets', async () => {
  const bundle = JSON.parse(await readFile(new URL('../assets/ai-deliveries/AutomationRunner.json', import.meta.url)));
  const files = JSON.parse(gunzipSync(Buffer.from(bundle.payload, 'base64')));
  const names = Object.keys(files).sort();
  for (const name of ['AutomationRunner.tsx', 'index.ts', 'styles.css', 'styles.css.d.ts']) assert.ok(names.includes(name), name);
  for (const name of ['chevron-down.svg', 'close.svg', 'drag-handle.svg', 'eye-mask.svg', 'minimize.svg']) assert.ok(names.includes(`assets/automation-runner/${name}`), name);
  assert.ok(!names.some(name => /demo|mock|font|playground|showcase/i.test(name)));
  const css = Buffer.from(files['styles.css'], 'base64').toString();
  assert.match(css, /aisee-runner-blink/);
  assert.match(css, /aisee-runner-mascot-jelly/);
  assert.match(css, /aisee-runner-eye-panic-open/);
  assert.match(css, /aisee-runner-iris-panic-search/);
  assert.match(css, /data-view='minimized'\] \.aisee-automation-runner__panel \{ cursor: pointer; \}/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /@font-face|:root|Karla/);
  assert.deepEqual(bundle.dependencies.map(dependency => dependency.name), ['react']);
  assert.match(bundle.preserve.join('\n'), /Update a compatible existing implementation in place/);
  assert.match(bundle.preserve.join('\n'), /wide-eyed two-pass panic scan when entering the whole card/);
  assert.match(bundle.preserve.join('\n'), /clicking anywhere on the minimized card restores the default view/);
  const latest = JSON.parse(await readFile(new URL('../assets/ai-deliveries/automation-runner/latest.json', import.meta.url)));
  const guide = await readFile(new URL(`../assets/ai-deliveries/automation-runner/${latest.delivery}`, import.meta.url), 'utf8');
  assert.match(guide, /do not duplicate their DOM, state, keyframes or window pointermove listener/);
  assert.match(guide, /pointer-directed card lean, a wide-eyed two-pass panic scan when entering the whole card/);
});

test('automation runner demo keeps compact placement controls and an unbroken heading', async () => {
  const demo = await readFile(new URL('../components/AutomationRunner/AutomationRunner.demo.tsx', import.meta.url), 'utf8');
  const css = await readFile(new URL('../components/AutomationRunner/AutomationRunner.demo.css', import.meta.url), 'utf8');
  assert.match(demo, /id:'bottom-right',label:'Right'/);
  assert.match(demo, /id:'bottom-center',label:'Center'/);
  assert.match(demo, /id:'bottom-left',label:'Left'/);
  assert.doesNotMatch(demo, /label:'Bottom (?:right|center|left)'/);
  assert.match(demo, /Demo pages · runner stays visible/);
  assert.match(demo, /runner-demo__route-tabs/);
  assert.match(css, /\.runner-demo__heading h2 \{[^}]*flex-wrap: nowrap;[^}]*white-space: nowrap;/);
  assert.match(css, /\.runner-demo__heading h2 \.aisee-content-new \{ flex: 0 0 auto; \}/);
  assert.match(css, /\.runner-demo__route-label \{[^}]*white-space: nowrap;/);
});
