import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync,gzipSync} from 'node:zlib';
import {validateManifest,productionFiles,imports} from '../scripts/production-delivery.mjs';
import {cssDependencyClosure} from '../scripts/css-delivery.mjs';
const root=new URL('../',import.meta.url).pathname;
const registry=JSON.parse(await readFile(new URL('../delivery/components.json',import.meta.url)));
const bell=registry.components.find(c=>c.name==='NotificationBell');

test('manifest boundary rejects demos/fonts/global sheets and missing transitive dependencies',async()=>{
  for(const path of ['src/Playground.tsx','src/mock-data.ts','fonts/Karla.ttf','src/index.ts','src/tokens/tokens.css'])assert.throws(()=>validateManifest({...bell,productionFiles:[...bell.productionFiles,path]}));
  const confirmation=registry.components.find(c=>c.name==='ConfirmationDialog');
  await assert.rejects(()=>productionFiles({...confirmation,productionFiles:confirmation.productionFiles.filter(f=>f!=='src/components/Button.tsx'),primitives:confirmation.primitives.filter(p=>!p.sourceFiles.includes('src/components/Button.tsx'))},decodeURIComponent(root)),/undeclared production dependency/);
  await assert.rejects(()=>productionFiles({...bell,productionFiles:[...bell.productionFiles,'src/components/Tabs.tsx']},decodeURIComponent(root)),/unused production source/);
});

test('CSS closure preserves selectors, pseudo states and conditional ancestry without negative-selector false matches',()=>{
  const {tree}=cssDependencyClosure([{path:'component.css',classes:['aisee-bell'],css:`
    .aisee-bell:hover::before,.foreign { color: red }
    :is(.aisee-bell,.foreign):focus-visible { outline: 1px solid }
    .foreign:not(.aisee-bell), .foreign:has(.aisee-bell), [title=".aisee-bell"] { color: pink }
    .aisee-bell :is(.utility,.aisee-bell__child) { display:block }
    @layer motion { @supports (display:grid) { @media (prefers-reduced-motion:reduce) {
      .aisee-bell { transition:none; &::after { transform:none } @supports (color:red) { color:var(--nested, red) } }
    } } }
  `}]);
  const css=tree.toString();
  assert.match(css,/hover::before/);assert.match(css,/:is\(\.aisee-bell\):focus-visible/);
  assert.doesNotMatch(css,/foreign|pink|title/);assert.match(css,/utility/);
  assert.match(css,/@layer motion/);assert.match(css,/@supports/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/&::after/);assert.match(css,/color:var\(--nested, red\)/);
});

test('CSS closure follows nested variable fallbacks, theme providers, animation aliases and keyframe variable dependencies',()=>{
  const {tree}=cssDependencyClosure([{path:'component.css',classes:['aisee-bell'],css:`
    .aisee-bell { color: var(--optional, var(--ink)); animation: var(--motion) }
    @supports (display:grid) { @keyframes sway { to { transform:translateX(var(--distance)); opacity:var(--opacity, .8) } } }
    @keyframes unused { to { opacity:0 } }
  `}],[{path:'tokens.css',css:`
    :root { --ink:var(--base); --base:rgb(1, 2, 3); --motion:200ms var(--name); --name:sway; --distance:4px; --unrelated:blue }
    @media (prefers-color-scheme:dark) { :root { --base:white } }
    @supports (color:oklch(0 0 0)) { [data-theme="dark"] { --base:oklch(.5 0 0); --unrelated:yellow } }
    @property --distance { syntax:"<length>"; inherits:false; initial-value:0px }
  `}]);
  const css=tree.toString();
  assert.match(css,/var\(--ink, var\(--base, rgb\(1, 2, 3\)\)\)/);
  assert.match(css,/@keyframes sway/);assert.match(css,/var\(--distance, 4px\)/);
  assert.match(css,/@property --distance/);assert.match(css,/prefers-color-scheme:dark/);
  assert.match(css,/:where\(\[data-theme/);assert.match(css,/@supports/);
  assert.doesNotMatch(css,/:root|unrelated|@keyframes unused/);
});

test('CSS closure fails for unresolved variables, undeclared imported dependencies and circular defaults',()=>{
  const source=css=>({path:'component.css',classes:['aisee-bell'],css});
  assert.throws(()=>cssDependencyClosure([source('.aisee-bell { color:var(--missing) }')]),/Unresolved/);
  assert.doesNotThrow(()=>cssDependencyClosure([source('.aisee-bell { transform:var(--runtime) }')],[],['--runtime']));
  assert.throws(()=>cssDependencyClosure([source('.aisee-bell { color:var(--a) }')],[{path:'tokens.css',css:':root{--a:var(--b);--b:var(--a)}'}]),/Circular/);
  assert.throws(()=>cssDependencyClosure([source('.aisee-bell{animation:motion 1s}'),{...source('@keyframes motion{to{opacity:0}}'),path:'imported.css',undeclared:true}]),/Undeclared CSS animation/);
});

test('compatibility is explicit per component and preserved in latest, archive and installation guide',async()=>{
  assert.throws(()=>validateManifest({...bell,compatibility:undefined}),/compatibility/);
  assert.throws(()=>validateManifest({...bell,compatibility:{react:'>=19'}}),/disagree/);
  assert.doesNotThrow(()=>validateManifest({...bell,compatibility:{react:'>=19',node:'>=22'},dependencies:bell.dependencies.map(d=>d.name==='react'?{...d,range:'>=19'}:d)}));
  for(const m of registry.components){
    const base=new URL('../assets/ai-deliveries/'+m.slug+'/',import.meta.url);
    const latest=JSON.parse(await readFile(new URL('latest.json',base)));
    const guide=await readFile(new URL(latest.delivery,base),'utf8');
    const archive=JSON.parse(await readFile(new URL('../assets/ai-deliveries/'+m.name+'.json',import.meta.url)));
    assert.deepEqual(latest.compatibility,m.compatibility);assert.deepEqual(archive.compatibility,m.compatibility);
    for(const [name,range] of Object.entries(m.compatibility))assert.ok(guide.includes(name+' '+range));
    assert.doesNotMatch(guide,/Requires Node 20\+/);assert.match(guide,/at execution time/);
  }
});

test('TSX parser catches imports, reexports and dynamic imports without mistaking strings for dependencies',()=>{
  const refs=imports('test.tsx',`import {A} from './A'; export {B} from './B'; const p=import('./C'); const text="import x from './fake'";`);
  assert.deepEqual(refs.map(r=>r.value),['./A','./B','./C']);
  assert.throws(()=>imports('test.tsx','const p=import(path);'),/explicit/);
});

test('bell delivery preserves original runtime logic and both reduced-motion animation rules without demo dependencies',async()=>{
  const delivery=JSON.parse(await readFile(new URL('../assets/ai-deliveries/NotificationBell.json',import.meta.url)));
  const files=JSON.parse(gunzipSync(Buffer.from(delivery.payload,'base64')));
  const source=Buffer.from(files['NotificationBell.tsx'],'base64').toString();
  const original=await readFile(new URL('../src/components/NotificationBell.tsx',import.meta.url),'utf8');
  assert.equal(source,'"use client";\nimport "./styles.css";\n'+original);
  assert.deepEqual(Object.keys(files).sort(),['NotificationBell.tsx','index.ts','styles.css','styles.css.d.ts']);
  const css=Buffer.from(files['styles.css'],'base64').toString();
  assert.match(css,/@keyframes aisee-notification-bell-ring/);assert.match(css,/@keyframes aisee-notification-bell-badge-in/);assert.match(css,/prefers-reduced-motion/);assert.doesNotMatch(css,/url\(|notification-panel|notification-item|:root/);
});

test('components can have different production sizes and ship all declared production assets',async()=>{
  const counts=new Set();
  for(const manifest of registry.components){const d=JSON.parse(await readFile(new URL(`../assets/ai-deliveries/${manifest.name}.json`,import.meta.url)));counts.add(d.fileCount);const generated=await productionFiles(manifest,decodeURIComponent(root));assert.deepEqual(Object.keys(generated),d.files);}
  assert.ok(counts.size>4);assert.ok(Math.max(...counts)>10);
});

test('all generated latest pointers work through the real browser resolver without component special cases',async()=>{
  const vm=await import('node:vm');const {webcrypto}=await import('node:crypto');
  const ctx=vm.createContext({URL,crypto:webcrypto,Uint8Array,fetch:async(url,options)=>{
    assert.equal(options.cache,'no-store');
    const pathname=new URL(url).pathname.replace(/^\/aisee-design-system\//,'/');
    try {const data=await readFile(new URL('..'+pathname,import.meta.url));return {ok:true,json:async()=>JSON.parse(data),text:async()=>data.toString(),arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength)};}catch{return {ok:false,status:404};}
  }});
  vm.runInContext(await readFile(new URL('../assets/ai-delivery.js',import.meta.url),'utf8'),ctx);
  for(const m of registry.components){const d=await ctx.AiseeAiDelivery.resolveDelivery(m.page,'https://23mnals.github.io/aisee-design-system/');assert.equal(d.name,m.name);assert.ok(ctx.AiseeAiDelivery.format(d).includes('/latest.json'));}
});


test('production archives are reproducible across platform gzip headers',async()=>{
  for(const manifest of registry.components){
    const delivery=JSON.parse(await readFile(new URL(`../assets/ai-deliveries/${manifest.name}.json`,import.meta.url)));
    const published=Buffer.from(delivery.payload,'base64');
    const regenerated=gzipSync(gunzipSync(published),{level:9});
    regenerated[9]=255;
    assert.equal(published[9],255,manifest.name+' uses a platform-neutral gzip header');
    assert.deepEqual(regenerated,published,manifest.name+' reproduces the exact version payload');
  }
});
