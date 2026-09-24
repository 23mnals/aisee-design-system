import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/copy-ai-controls.js',import.meta.url),'utf8');
const deliverySource=await readFile(new URL('../assets/ai-delivery.js',import.meta.url),'utf8');
const delivery=JSON.parse(await readFile(new URL('../assets/ai-deliveries/Toggle.json',import.meta.url),'utf8'));
function fixture() {
  const ctx=vm.createContext({URL});vm.runInContext(deliverySource,ctx);vm.runInContext(source,ctx);
  const elements={}, documentListeners={};
  const fakeDocument={activeElement:null,getElementById:id=>elements[id],createElement:()=>element(),addEventListener:(key,fn)=>documentListeners[key]=fn};
  function element(){return {value:'',hidden:false,disabled:false,textContent:'',children:[],listeners:{},attributes:{},
    addEventListener(k,fn){this.listeners[k]=fn;},setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k]??null;},
    replaceChildren(...children){this.children=children;},append(...children){this.children.push(...children);},focus(){fakeDocument.activeElement=this;},
    contains(target){return this===target||this.children.some(child=>child.contains(target));},
    querySelectorAll(selector){const attr=selector.includes('role=')?'role':selector.slice(1,-1);return this.children.flatMap(child=>[...(child.attributes[attr]!==undefined&&(attr!=='role'||child.attributes.role==='menuitemradio')?[child]:[]),...child.querySelectorAll(selector)]);},
    change(value){this.value=value;this.listeners.change?.();}};}
  for(const id of ['copyAiControls','copyAiHeader','copyAiHeaderLabel','copyAiMode','copyAiVariant','copyAiVariantRow','copyAiStatus','copyAiModeLabel','copyAiMenuTrigger','copyAiMenu','copyAiVariantOptions'])elements[id]=element();
  const modeOptions=['design','motion'].map(value=>{const option=element();option.setAttribute('data-copy-mode',value);option.setAttribute('role','menuitemradio');return option;});
  elements.copyAiMenu.children=[...modeOptions,elements.copyAiVariantOptions];
  elements.copyAiControls.children=[elements.copyAiMenuTrigger,elements.copyAiMenu];
  const f={elements,modeOptions,document:fakeDocument,documentListeners,writes:[],toasts:[],timers:[],context:{path:delivery.page,name:'Toggle'},snapshot:{sections:[{scope:'Variant playground',component:'Toggle',props:{color:'lime',surface:'light',size:16,checked:true}}]},resolve:async()=>delivery};
  f.controls=ctx.AiseeCopyAiControls.create({document:fakeDocument,deliveryApi:ctx.AiseeAiDelivery,getContext:()=>f.context,readSnapshot:()=>{if(f.loading)throw Error('Please wait for the current component preview to finish loading.');return f.snapshot;},resolveDelivery:path=>f.resolve(path),writeClipboard:async text=>f.writes.push(text),showToast:text=>f.toasts.push(text),schedule:fn=>f.timers.push(fn)});
  f.api=ctx.AiseeAiDelivery; f.controls.reset(true); return f;
}
test('default and motion copy retain mode in UI and omit every implicit preview value',async()=>{
  const f=fixture();await f.controls.refresh();
  assert.equal(f.elements.copyAiMode.value,'design');assert.equal(f.elements.copyAiVariant.value,'');
  assert.equal(f.elements.copyAiVariant.children.length,2);
  await f.controls.copy();assert.equal(f.writes[0],f.api.format(delivery));
  assert.match(f.elements.copyAiStatus.textContent,/Copied · Apply AISEE design · No specific variant/);
  f.elements.copyAiMode.change('motion');await f.controls.copy();
  assert.equal(f.writes[1],f.api.format(delivery,undefined,{mode:'motion'}));
  assert.match(f.elements.copyAiStatus.textContent,/Copied · Add motion only/);
  assert.match(f.elements.copyAiHeader.attributes['aria-label'],/Add motion only/);
});
test('one explicitly selected variant is copied; preview changes and navigation clear that intent',async()=>{
  const f=fixture();await f.controls.refresh();f.elements.copyAiVariant.change('0');await f.controls.copy();
  assert.match(f.writes[0],/Selected variant target/);assert.doesNotMatch(f.writes[0],/Variant playground|"checked"/);
  f.snapshot.sections[0].props.color='yellow';await f.controls.refresh();
  assert.equal(f.elements.copyAiVariant.value,'');assert.match(f.elements.copyAiStatus.textContent,/choose a variant again/);
  await f.controls.copy();assert.doesNotMatch(f.writes[1],/"yellow"|Selected variant target/);
  f.elements.copyAiMode.change('motion');f.controls.reset(true);
  assert.equal(f.elements.copyAiMode.value,'design');assert.equal(f.elements.copyAiVariant.value,'');
});
test('copy rejects a stale selected variant even before its preview refresh event arrives',async()=>{
  const f=fixture();await f.controls.refresh();f.elements.copyAiVariant.change('0');
  f.snapshot.sections[0].props.size=24;await f.controls.copy();
  assert.equal(f.writes.length,0);assert.match(f.toasts[0],/Preview changed/);
});
test('navigation or mode changes while resolving never copy an obsolete task',async()=>{
  const f=fixture();let done;f.resolve=()=>new Promise(resolve=>done=resolve);
  let pending=f.controls.copy();assert.equal(f.elements.copyAiMode.disabled,true);
  f.context={path:'components/Button/Button.html',name:'Button'};f.controls.reset(true);done(delivery);await pending;
  assert.equal(f.writes.length,0);assert.equal(f.elements.copyAiHeaderLabel.textContent,'Copy for AI');
  f.context={path:delivery.page,name:'Toggle'};pending=f.controls.copy();f.elements.copyAiMode.change('motion');done(delivery);await pending;
  assert.equal(f.writes.length,0);
});
test('loading frames and inaccessible source fail closed; gallery stays without a variant',async()=>{
  const f=fixture();f.loading=true;await f.controls.copy();assert.equal(f.writes.length,0);
  f.loading=false;f.resolve=async()=>{throw Error('not published');};await f.controls.copy();
  assert.equal(f.writes.length,0);assert.ok(f.toasts.includes('not published'));
  f.resolve=async()=>delivery;f.snapshot={sections:[]};await f.controls.refresh();
  assert.equal(f.elements.copyAiVariantRow.hidden,true);await f.controls.copy();assert.equal(f.writes[0],f.api.format(delivery));
});

test('compact options menu selects modes, supports Escape focus return and closes outside',async()=>{
  const f=fixture();await f.controls.refresh();
  f.elements.copyAiMenuTrigger.listeners.click();
  assert.equal(f.elements.copyAiMenu.hidden,false);
  assert.equal(f.elements.copyAiMenuTrigger.attributes['aria-expanded'],'true');
  f.modeOptions[1].listeners.click();
  assert.equal(f.elements.copyAiMode.value,'motion');assert.equal(f.elements.copyAiModeLabel.textContent,'Motion only');
  assert.equal(f.elements.copyAiMenu.hidden,true);assert.equal(f.document.activeElement,f.elements.copyAiMenuTrigger);
  f.elements.copyAiMenuTrigger.listeners.click();
  f.elements.copyAiMenu.listeners.keydown({key:'Escape',preventDefault(){},stopPropagation(){}});
  assert.equal(f.elements.copyAiMenu.hidden,true);
  f.elements.copyAiMenuTrigger.listeners.click();f.documentListeners.pointerdown({target:{}});
  assert.equal(f.elements.copyAiMenu.hidden,true);
});
test('custom variant menu keeps explicit selection separate from preview defaults',async()=>{
  const f=fixture();await f.controls.refresh();
  assert.equal(f.elements.copyAiVariant.value,'');
  const options=f.elements.copyAiVariantOptions.children;
  assert.equal(options[0].attributes['aria-checked'],'true');
  options[1].listeners.click();await f.controls.copy();
  assert.match(f.writes[0],/Selected variant target/);
  assert.equal(f.elements.copyAiMenu.hidden,true);
  options[0].listeners.click();await f.controls.copy();
  assert.doesNotMatch(f.writes[1],/Selected variant target/);
});
