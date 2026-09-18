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

test('every Copy for AI entry registers either a live reader or an explicit gallery fallback', () => {
  const guidance = portal.slice(portal.indexOf('const componentAiGuidance'), portal.indexOf('function buildComponentAiPrompt'));
  const entries = [...guidance.matchAll(/"((?:components|preview)\/[^"\n]+\.html)":\s*\{/g)].map(m=>m[1]);
  assert.equal(entries.length, 28);
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

test('the actual copy handler writes current configuration and never writes on a reader failure', async () => {
  const handler=portal.match(/async function copyAiPrompt\(\) \{[\s\S]*?(?=\n      async function copyLogoTsx)/)[0];
  const state={'data-aisee-config':JSON.stringify([{scope:'Icon variants',component:'Button',props:{showIcon:false}}])};
  const page=doc({'[data-aisee-config]':element(state)});
  Object.assign(page,{URL:'http://localhost/'+path('Button'),readyState:'complete'});
  const writes=[];
  const sandbox=vm.createContext({items:[{path:path('Button'),name:'Button'}],activePath:path('Button'),buildComponentAiPrompt:()=> 'Current Button rules',AiseeComponentConfig:api,previewFrame:{contentDocument:page},document:{baseURI:'http://localhost/'},copyAiHeader:{},copyAiHeaderLabel:{},writeClipboard:async text=>writes.push(text),showToast:()=>{},window:{setTimeout:fn=>fn()}});
  vm.runInContext(handler,sandbox);
  await sandbox.copyAiPrompt();
  assert.match(writes[0],/"showIcon": false/);
  state['data-aisee-config']=JSON.stringify([{scope:'Icon variants',component:'Button',props:{showIcon:true,iconPosition:'right'}}]);
  await sandbox.copyAiPrompt();
  assert.match(writes[1],/"iconPosition": "right"/);
  page.URL='http://localhost/'+path('Badge');
  await sandbox.copyAiPrompt();
  assert.equal(writes.length,2);
});
