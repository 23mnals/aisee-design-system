import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('assets/component-config.js', root), 'utf8');
const portal = await readFile(new URL('aisee-design-system-preview.html', root), 'utf8');
const context = vm.createContext({URL});
vm.runInContext(source, context);
const api = context.AiseeComponentConfig;
const path = name => `components/${name}/${name}.html`;
const element = attributes => ({checked:attributes.checked, getAttribute:name => attributes[name] ?? null});
const doc = selectors => ({querySelector:selector => selectors[selector] || null});
const plain = value => JSON.parse(JSON.stringify(value));

test('every Copy for AI entry has an explicit production manifest', async () => {
  const manifest = JSON.parse(await readFile(new URL('assets/ai-deliveries/manifest.json', root), 'utf8'));
  assert.deepEqual(Object.keys(manifest).sort(), [...api.supportedPaths].sort());
  const registry=JSON.parse(await readFile(new URL('delivery/components.json',root),'utf8'));
  assert.equal(registry.components.length,api.supportedPaths.length);
  assert.ok(registry.components.every(c=>c.productionFiles.length && c.entries.length));
});

test('every Copy for AI entry registers either a live reader or an explicit gallery fallback', () => {
  const guidance = portal.slice(portal.indexOf('const componentAiGuidance'), portal.indexOf('function buildComponentAiPrompt'));
  const entries = [...guidance.matchAll(/"((?:components|preview)\/[^"\n]+\.html)":\s*\{/g)].map(m=>m[1]);
  assert.ok(entries.length>0);
  assert.deepEqual([...api.supportedPaths].sort(), entries.sort());
  JSON.parse(portal.match(/id="aisee-ai-contract">([\s\S]*?)<\/script>/)[1]);
});

test('React choices are read fresh on every copy, with independent example scopes', () => {
  const marker = {'data-aisee-config':JSON.stringify([{scope:'Interactive preview',component:'SidebarLayout',props:{variant:'floating',togglePosition:'outside'}}])};
  const page = doc({'[data-aisee-config]':element(marker)});
  assert.equal(api.read(page,path('SidebarNavigation')).sections[0].props.variant,'floating');
  marker['data-aisee-config'] = JSON.stringify([{scope:'Interactive preview',component:'SidebarLayout',props:{variant:'topbar',reveal:'click'}}]);
  const next = api.read(page,path('SidebarNavigation'));
  assert.deepEqual(plain(next.sections[0].props),{variant:'topbar',reveal:'click'});
  marker['data-aisee-config'] = JSON.stringify([{scope:'Full',component:'EmptyState',props:{illustrationName:'no-event'}},{scope:'Compact',component:'EmptyState',props:{illustrationName:'no-account'}}]);
  assert.equal(api.read(page,path('EmptyState')).sections.length,2);
  assert.match(api.format(next),/"reveal": "click"/);
});

test('only active composition controls are exported; hidden stale values and business inputs are ignored', () => {
  const attributes = {'data-value':'action'};
  const page = doc({'#compositionVariantControl':element(attributes),'#variantIcons':element({checked:false}),'#variantOpen':element({checked:true}),'input':element({value:'private business data'})});
  let result = api.read(page,path('Select'));
  assert.deepEqual(plain(result.sections[0].slots),{leadingIcon:false});
  assert.equal(result.sections[0].previewState,undefined);
  attributes['data-value']='account';
  result=api.read(page,path('Select'));
  assert.equal(result.sections[0].slots,undefined);
  assert.doesNotMatch(JSON.stringify(result),/private business data/);
  attributes['data-value']='compact';
  assert.equal(api.read(page,path('Select')).sections[0].previewState.open,true);
});

test('static controls map to real API types and retain separate tabs examples', () => {
  const quantity=api.read(doc({'[data-mode-control][aria-pressed="true"]':element({'data-mode-control':'buttons'})}),path('QuantityStepper'));
  assert.deepEqual(plain(quantity.sections[0].props),{inputMode:'buttons-only'});
  const input=api.read(doc({'#stateLabel':element({'data-state':'error'})}),path('Input'));
  assert.equal(typeof input.sections[0].props.error,'string');
  const tabs=api.read(doc({'#showIcons':element({checked:false}),'#showCounts':element({checked:true})}),path('Tabs'));
  assert.deepEqual(plain(tabs.sections.map(s=>s.slots)),[{icon:false},{count:true}]);
});

test('navigation races, incomplete state and unregistered pages cannot silently copy defaults', () => {
  const page=doc({});
  Object.assign(page,{URL:'http://localhost/components/Badge/Badge.html',readyState:'complete'});
  assert.throws(()=>api.readFrame({contentDocument:page},path('Button'),'http://localhost/'),/finish loading/);
  page.readyState='loading';
  assert.throws(()=>api.readFrame({contentDocument:page},path('Badge'),'http://localhost/'),/finish loading/);
  assert.throws(()=>api.read(doc({}),path('SidebarNavigation')),/not ready/);
  assert.throws(()=>api.read(doc({}),path('Unknown')),/not been registered/);
  const gallery=api.read(doc({}),path('Badge'));
  assert.equal(gallery.status,'no-variable-controls');
  assert.equal(gallery.sections.length,0);
});

test('actual copy handler uses generic production resolver, live choices, and fails closed on navigation/errors', async () => {
  const handler=portal.match(/async function copyAiPrompt\(\) \{[\s\S]*?(?=\n      async function copyLogoTsx)/)[0];
  assert.doesNotMatch(handler,/Notification|isSourcePilot/);
  const state={'data-aisee-config':JSON.stringify([{scope:'Icons',component:'Button',props:{showIcon:false}}])};
  const page=doc({'[data-aisee-config]':element(state)});
  Object.assign(page,{URL:'http://localhost/'+path('Button'),readyState:'complete'});
  const writes=[];
  const sandbox=vm.createContext({URL,items:[{path:path('Button'),name:'Button'}],activePath:path('Button'),buildComponentAiPrompt:()=> 'registered',AiseeComponentConfig:api,previewFrame:{contentDocument:page},document:{baseURI:'http://localhost/'},copyAiHeader:{},copyAiHeaderLabel:{},writeClipboard:async text=>writes.push(text),showToast:()=>{},window:{setTimeout:fn=>fn()}});
  vm.runInContext(await readFile(new URL('assets/ai-delivery.js',root),'utf8'),sandbox);
  const format=sandbox.window.AiseeAiDelivery.format;
  const delivery={name:'Button',latestUrl:'https://example.com/button/latest.json',configuration:{props:{Button:['showIcon','iconPosition']}}};
  sandbox.AiseeAiDelivery={format,resolveDelivery:async()=>delivery};
  vm.runInContext(handler,sandbox);
  await sandbox.copyAiPrompt();assert.match(writes[0],/"showIcon":false/);
  state['data-aisee-config']=JSON.stringify([{scope:'Icons',component:'Button',props:{showIcon:true,iconPosition:'right'},previewState:{mock:true}}]);
  await sandbox.copyAiPrompt();assert.match(writes[1],/"iconPosition":"right"/);assert.doesNotMatch(writes[1],/mock|previewState/);
  page.URL='http://localhost/'+path('Badge');await sandbox.copyAiPrompt();assert.equal(writes.length,2);
  page.URL='http://localhost/'+path('Button');
  sandbox.AiseeAiDelivery.resolveDelivery=async()=>{sandbox.activePath=path('Badge');return delivery;};
  await sandbox.copyAiPrompt();assert.equal(writes.length,2,'Navigation while fetching must not copy stale component');
  sandbox.activePath=path('Button');sandbox.AiseeAiDelivery.resolveDelivery=async()=>{throw Error('not published');};
  await sandbox.copyAiPrompt();assert.equal(writes.length,2,'Never fall back to incomplete repository prompt');
});

test('latest pointer advances without changing copied URL; validates guides and installer bytes', async () => {
  const {webcrypto,createHash}=await import('node:crypto');
  const ctx=vm.createContext({URL,crypto:webcrypto,Uint8Array});
  vm.runInContext(await readFile(new URL('assets/ai-delivery.js',root),'utf8'),ctx);
  const bytes=new TextEncoder().encode('installer fixture');
  const sha=createHash('sha256').update(bytes).digest('hex');
  const base={schemaVersion:3,name:'Button',page:path('Button'),latestUrl:'https://example.com/button/latest.json',configuration:{props:{Button:['variant']}}};
  let latest={...base,version:'first',delivery:'./releases/first/ready.md',installer:'./releases/first/install.cjs',installerSha256:sha};
  const visited=[];
  ctx.fetch=async url=>{visited.push(url);return url.endsWith('.json')?{ok:true,json:async()=>latest}:url.endsWith('.md')?{ok:true,text:async()=>sha}:{ok:true,arrayBuffer:async()=>bytes.buffer};};
  const first=await ctx.AiseeAiDelivery.checkPublished({...base,version:'first'});
  latest={...latest,version:'second',delivery:'./releases/second/ready.md',installer:'./releases/second/install.cjs'};
  const second=await ctx.AiseeAiDelivery.checkPublished({...base,version:'second'});
  assert.equal(ctx.AiseeAiDelivery.format(first),ctx.AiseeAiDelivery.format(second));
  assert.ok(visited.some(u=>u.endsWith('/second/install.cjs')));
  await assert.rejects(()=>ctx.AiseeAiDelivery.checkPublished({...base,version:'first'}),/不匹配/);
  latest.installerSha256='bad';await assert.rejects(()=>ctx.AiseeAiDelivery.checkPublished({...base,version:'second'}),/校验/);
  ctx.fetch=async()=>({ok:false,status:404});await assert.rejects(()=>ctx.AiseeAiDelivery.checkPublished(base),/404/);
});

test('all Notification demo combinations produce exactly the same production prompt', async () => {
  const ctx=vm.createContext({URL});vm.runInContext(await readFile(new URL('assets/ai-delivery.js',root),'utf8'),ctx);
  const bell=JSON.parse(await readFile(new URL('assets/ai-deliveries/NotificationBell.json',root),'utf8'));
  const prompt=ctx.AiseeAiDelivery.format(bell,{sections:[]});assert.ok(prompt.length<200);
  assert.match(prompt,/Integrate AISEE NotificationBell/);assert.match(prompt,/latest.json/);
  for(const state of ['ready','empty','loading','error'])for(let mask=0;mask<32;mask++) {
    const snapshot={sections:[{component:'NotificationBell',props:{dot:!!(mask&1),count:42}},{component:'NotificationPanel',props:{state,showIcons:!!(mask&2),showStatus:!!(mask&4),showActions:!!(mask&8)},slots:{errorDetail:!!(mask&16)}}]};
    assert.equal(ctx.AiseeAiDelivery.format(bell,snapshot),prompt);
  }
});
