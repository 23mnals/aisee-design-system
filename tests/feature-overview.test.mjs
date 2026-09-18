import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { build } from 'vite';
const require = createRequire(import.meta.url);
async function load(name) {
  const result = await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,
    lib:{entry:fileURLToPath(new URL(`../src/components/${name}.tsx`,import.meta.url)),formats:['cjs']},
    rollupOptions:{external:['react','react/jsx-runtime']}}});
  const output=(Array.isArray(result)?result[0]:result).output.find(item=>item.type==='chunk');
  const module={exports:{}};
  new Function('require','module','exports',output.code)(require,module,module.exports);
  return module.exports;
}
const {CardGrid}=await load('Card');
const {FeatureList}=await load('FeatureList');
const {FeatureOverview}=await load('FeatureOverview');
const {StatCard,StatCardGroup}=await load('StatCard');

test('divided grids preserve arbitrary content and ignore absent sections',()=>{
  const output=render(h(CardGrid,{divided:true,columns:3},h('input',{defaultValue:'Kept'}),null,false,h('p',null,'Details')));
  assert.equal((output.match(/class="aisee-card-grid__cell"/g)||[]).length,2);
  assert.match(output,/data-columns="3"/);
  assert.match(output,/value="Kept"/);
  const regular=render(h(CardGrid,null,h('p',null,'Original')));
  assert.doesNotMatch(regular,/aisee-card-grid__cell|aisee-card-grid--divided/);
});
test('feature lists expose read-only list content and escape text without creating selection controls',()=>{
  const output=render(h(FeatureList,{tone:'engage','aria-label':'Benefits',items:[
    {id:'a',content:h('strong',null,'Included'),supporting:'More detail',trailing:h('span',null,'5 engines')},
    {id:'b',content:'<script>unsafe</script>'}]}));
  assert.match(output,/<ul[^>]*aria-label="Benefits"/);
  assert.equal((output.match(/<li /g)||[]).length,2);
  assert.match(output,/<strong>Included<\/strong>/);
  assert.match(output,/More detail/);assert.match(output,/5 engines/);
  assert.match(output,/&lt;script&gt;unsafe/);
  assert.doesNotMatch(output,/<input|<button|role="checkbox"|tabindex/);
});
test('overview composes named sections and optional slots without adding billing or interaction state',()=>{
  const output=render(h(FeatureOverview,{'aria-label':'Capabilities',sections:[
    {id:'one',title:'First',items:[{id:'a',content:'Benefit'}],summary:'Limits',footer:'Channels'},
    {id:'two',title:'Second',items:[]},
  ]}));
  assert.equal((output.match(/aisee-card--divided/g)||[]).length,1);
  assert.match(output,/aria-label="First features"/);
  assert.match(output,/Limits/);assert.match(output,/Channels/);
  assert.equal((output.match(/<h3/g)||[]).length,2);
  assert.doesNotMatch(output,/aria-expanded|<button|price|billing/);
});
test('compact information strips keep existing default metrics and accept icon values',()=>{
  const defaults=render(h(StatCard,{value:'66.2',label:'Visibility',badge:'Baseline'}));
  assert.doesNotMatch(defaults,/--compact/);assert.match(defaults,/Baseline/);
  const compact=render(h(StatCardGroup,{variant:'compact','aria-label':'Modes'},
    h(StatCard,{value:h('img',{src:'/auto.svg',alt:''}),label:'Auto Publish'}),
    h(StatCard,{value:'24h',label:'Frequency'})));
  assert.match(compact,/aisee-stat-card-group--compact/);
  assert.match(compact,/aria-label="Modes"/);assert.match(compact,/Auto Publish/);
  assert.match(compact,/src="\/auto.svg"/);assert.doesNotMatch(compact,/<button|role="radio"/);
});
