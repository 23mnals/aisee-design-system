import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {validateManifest} from '../scripts/production-delivery.mjs';
import {hostIntegrationGuide} from '../scripts/host-project-compatibility.mjs';
import {cssDependencyClosure} from '../scripts/css-delivery.mjs';

const read = path => readFile(new URL('../'+path, import.meta.url), 'utf8');
const registry = JSON.parse(await read('delivery/components.json'));

test('every production manifest declares host-first boundaries without assuming a framework', () => {
  for (const manifest of registry.components) {
    assert.doesNotThrow(() => validateManifest(manifest));
    assert.throws(() => validateManifest({...manifest,integrationMode:undefined}), /integrationMode/);
    assert.throws(() => validateManifest({...manifest,primitives:undefined}), /primitives/);
    assert.throws(() => validateManifest({...manifest,preserve:[]}), /preserve/);
    assert.throws(() => validateManifest({...manifest,primitives:[{role:'button',sourceFiles:['Demo.tsx'],requiredCapabilities:['ref'],fallback:'standalone'}]}), /production/);
  }
  const dialog=registry.components.find(m=>m.name==='Dialog');
  const boundary=dialog.primitives[0];
  assert.throws(()=>validateManifest({...dialog,primitives:[{...boundary,requiredCapabilities:[]}]}), /capabilities/);
  assert.throws(()=>validateManifest({...dialog,primitives:[boundary,boundary]}), /duplicate/);
  assert.throws(()=>validateManifest({...dialog,primitives:[{...boundary,fallback:'install-mui'}]}), /fallback/);
  assert.match(hostIntegrationGuide(dialog), /native dialog ref API/);
  assert.deepEqual(registry.components.find(m=>m.name==='ThinkingIndicator').primitives, []);
});

test('every current delivery carries the contract in latest, archive metadata and the linked guide', async () => {
  for (const m of registry.components) {
    const latest=JSON.parse(await read(`assets/ai-deliveries/${m.slug}/latest.json`));
    const archive=JSON.parse(await read(`assets/ai-deliveries/${m.name}.json`));
    const guide=await read(`assets/ai-deliveries/${m.slug}/${latest.delivery}`);
    for (const delivery of [latest,archive]) {
      assert.equal(delivery.integrationMode,m.integrationMode);
      assert.deepEqual(delivery.primitives,m.primitives);
      assert.deepEqual(delivery.preserve,m.preserve);
    }
    assert.ok(guide.indexOf('Host Project Compatibility') < guide.indexOf('## Production implementation'));
    assert.match(guide,/before downloading\/executing the installer/);
    for (const name of ['shadcn/ui','Radix','MUI','Ant Design','Chakra','Headless UI']) assert.ok(guide.includes(name));
    assert.match(guide,/Do not install another complete UI framework/);
    assert.match(guide,/Never emit unscoped button\/input\/svg\/body\/reset rules/);
    assert.match(guide,/never add or replace a global provider/);
    assert.match(guide,/does not detect or modify the host framework automatically/);
    assert.match(guide,/If no existing primitive satisfies all requirements/);
    for (const requirement of m.preserve) assert.ok(guide.includes(requirement));
    const files=JSON.parse(gunzipSync(Buffer.from(archive.payload,'base64')));
    assert.deepEqual(Object.keys(files),latest.files); // Contract metadata must not add a runtime framework or demo.
    assert.doesNotMatch(Buffer.from(files['styles.css'],'base64').toString(), /@font-face|:root\s*\{/);
  }
});

test('CSS closure keeps component-scoped host control rules and rejects global resets', () => {
  const {tree}=cssDependencyClosure([{path:'styles.css',classes:['aisee-example'],css:`
    button,input,svg,body,* { color: red; margin:0 }
    .aisee-example button:hover { color:blue }
    .aisee-example { color:black; input:focus { outline:1px solid } }
    @supports (display:grid) { body { display:grid } .aisee-example svg { fill:currentColor } }
    @media (prefers-reduced-motion:reduce) { .aisee-example { animation:none } }
  `}]);
  const css=tree.toString();
  assert.doesNotMatch(css,/color: red|margin:0|body/);
  assert.match(css,/\.aisee-example button:hover/);
  assert.match(css,/input:focus/);
  assert.match(css,/prefers-reduced-motion/);
});
