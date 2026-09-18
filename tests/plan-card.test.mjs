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
const {PlanCard}=await load('PlanCard');
test('subscription card exposes price, entitlements, brand context and actions',()=>{
 const output=render(h(PlanCard,{variant:'subscription',name:'Growth Loop',title:'Unlock full analysis',description:'Start your report.',price:'$99',credits:'8,000',companyName:'Aisee',website:'https://aisee.live',onAction:()=>{},onDismiss:()=>{}}));
 for(const text of ['$99','/month','8,000','Full access to all features','Aisee','https://aisee.live','Maybe later','Subscribe &amp; Start Analysis']) assert.ok(output.includes(text),text);
 assert.equal((output.match(/<button/g)||[]).length,2);
 assert.match(output,/aria-labelledby=/);
 assert.doesNotMatch(output,/aisee-plan-card__sections/);
});
test('subscription disables only purchase and escapes supplied brand values',()=>{
 const output=render(h(PlanCard,{variant:'subscription',name:'Plan',title:'Subscribe',description:'Description',price:'$10',credits:'100',companyName:'<script>brand</script>',website:'example.test',disabled:true,onAction:()=>{},onDismiss:()=>{}}));
 assert.equal((output.match(/disabled=""/g)||[]).length,1);
 assert.match(output,/&lt;script&gt;brand/);
});
test('previous comparison props and current-plan disabled behavior remain compatible',()=>{
 const output=render(h(PlanCard,{name:'Starter',audience:'Individuals',description:'Basics',price:'$9',credits:'1,000',action:'current',actionLabel:'Current Plan',sections:[{title:'Analysis',items:[{label:'Report'}]}]}));
 assert.match(output,/aisee-plan-card__sections/);assert.match(output,/Current Plan/);assert.match(output,/disabled=""/);assert.match(output,/Report/);
});
