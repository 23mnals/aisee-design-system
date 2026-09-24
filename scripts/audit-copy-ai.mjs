import {readFileSync} from 'node:fs';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = resolve(root, 'artifacts/copy-ai-audit');
const portal = await readFile(resolve(root, 'aisee-design-system-preview.html'), 'utf8');
const context = vm.createContext({URL});
vm.runInContext(await readFile(resolve(root, 'assets/component-config.js'), 'utf8'), context);
// Execute the same prompt builder used by the portal, not a second prompt template.
vm.runInContext(portal.slice(portal.indexOf('const componentAiGuidance ='), portal.indexOf('const baseItems =')) + '\nglobalThis.guidance = componentAiGuidance;', context);
vm.runInContext(await readFile(resolve(root, 'assets/ai-delivery.js'), 'utf8'), context);
const deliveries = {};
const deliveryCatalog=JSON.parse(await readFile(resolve(root,'assets/ai-deliveries/manifest.json'),'utf8'));
for(const [path,entry] of Object.entries(deliveryCatalog)) deliveries[path]=JSON.parse(await readFile(resolve(root,entry.url),'utf8'));
const api = context.AiseeComponentConfig;
const pathFor = name => `components/${name}/${name}.html`;
const cases = [];
const add = (name, label, selectors, verify = () => {}) => {
  const path = name === 'Avatar' ? 'preview/avatar.html' : pathFor(name);
  const doc = {querySelector:selector => {
    const attrs = selectors[selector];
    return attrs ? {checked:attrs.checked, getAttribute:key => attrs[key] ?? null} : null;
  }};
  try {
    const snapshot = api.read(doc, path);
    verify(snapshot.sections);
    const delivery=deliveries[path];assert.ok(delivery,'Missing production manifest');
    const prompt=context.AiseeAiDelivery.format(delivery,snapshot);
    assert.ok(prompt.startsWith(`Integrate AISEE ${delivery.name} into this React project.`));
    const motion=context.AiseeAiDelivery.format(delivery,snapshot,{mode:'motion'});
    assert.equal(prompt.replace(/^Goal — .*$/m,''),motion.replace(/^Goal — .*$/m,''));
    assert.ok(prompt.includes('Goal — Apply AISEE design:'));
    assert.ok(motion.includes('Goal — Add motion only:'));
    for (const rule of ['components.json','components/ui','exact allowed paths','page layout or copy','hook files','APIs','request layers','project/build/cache configuration','wait for my explicit confirmation']) assert.ok(prompt.includes(rule),rule);
    assert.ok(prompt.includes('/latest.json'));
    assert.doesNotMatch(prompt,/Variant playground|Selected variant target|"props"|previewState|ready-30/);
    const variants=context.AiseeAiDelivery.variants(delivery,snapshot);
    for(let variantIndex=0;variantIndex<variants.length;variantIndex++) {
      const selected=context.AiseeAiDelivery.format(delivery,snapshot,{variantIndex});
      assert.ok(selected.endsWith(JSON.stringify(variants[variantIndex])));
      assert.doesNotMatch(selected,/Variant playground/);
    }
    const sanitized=context.AiseeAiDelivery.configuration(delivery,snapshot);
    assert.ok(sanitized.every(s=>!s.previewState&&!s.composition&&!s.rules));
    cases.push({name, label, path, status:'pass', snapshot, prompt});
  } catch (error) { cases.push({name, label, path, status:'fail', error:error.message}); }
};
// Evaluate actual TSX configuration expressions with controlled state values.
// The marker is deliberately one JSX expression ending at the host element.
// This checks the export contract, not browser event wiring or generated visuals.
async function react(name) {
  const source = await readFile(resolve(root, `components/${name}/${name}.demo.tsx`), 'utf8');
  const expression = source.match(/data-aisee-config=\{([\s\S]*?)\}\s*(?:>|\/>)/)?.[1];
  const literals = {};
  for (const name of ['models','patterns','scenarios']) {
    const literal = source.match(new RegExp('const '+name+' = (\\[[\\s\\S]*?\\]);'))?.[1];
    if (literal) literals[name]=vm.runInNewContext('('+literal+')',literals);
  }
  assert.ok(expression,`${name}: missing live configuration declaration`);
  return (label,state,verify) => add(name,label,{'[data-aisee-config]':{'data-aisee-config':vm.runInNewContext(expression,{...literals,...state})}},verify);
}
const sidebar=await react('SidebarNavigation');
for (const variant of ['sidebar','muted','floating','inset']) for (const togglePosition of ['inside','outside']) sidebar(`${variant}/${togglePosition}`,{variant,togglePosition,reveal:'hover'},s=>assert.equal(s[0].props.togglePosition,togglePosition));
for (const reveal of ['hover','click']) sidebar(`topbar/${reveal}`,{variant:'topbar',togglePosition:'outside',reveal},s=>{assert.equal(s[0].props.reveal,reveal);assert.equal(s[0].props.togglePosition,undefined);});
const button=await react('Button');
for (const showIcon of [true,false]) for (const iconPosition of ['left','right']) button(`icon=${showIcon}/${iconPosition}`,{showIcon,iconPosition},s=>assert.equal(s[0].props.iconPosition,showIcon?iconPosition:undefined));
const toggle=await react('Toggle');
for (const color of ['lime','yellow']) for (const surface of ['light','dark']) for (const size of [16,24]) for (const state of ['on','off','disabled-on','disabled-off']) toggle(`${color}/${surface}/${size}/${state}`,{color,surface,size,state},s=>{assert.equal(s[0].props.checked,state.endsWith('on'));assert.equal(s[0].props.disabled,state.startsWith('disabled'));});
const empty=await react('EmptyState');
for (const size of ['default','compact']) for (const variant of ['plain','inset']) for (let mask=0;mask<16;mask++) {
  const slots=Object.fromEntries(['illustration','title','description','action'].map((name,i)=>[name,Boolean(mask&(1<<i))]));
  empty(`${size}/${variant}/slots-${mask}`,{size,variant,slots,illustrationName:'no-event',fullIllustration:'no-event',compactIllustration:'no-account'},s=>{assert.equal(s.length,3);assert.equal(s[2].props.illustrationName,slots.illustration?'no-event':undefined);});
}
const feature=await react('FeatureOverview');
for (const columns of ['1','2','3','4']) for (const summaryMode of ['text','icon']) feature(`${columns}/${summaryMode}`,{columns,summaryMode},s=>{assert.equal(s[0].props.columns,Number(columns));assert.equal(s[1].composition.valueDisplay,summaryMode);});
const card=await react('Card');
for (const pattern of ['input','group','choice','textarea','mixed','metrics','accounts','settings','preview']) card(pattern,{pattern},s=>{assert.equal(s[0].composition.id,pattern);assert.ok(s[0].composition.label);});
const group=await react('ToggleSelectionGroup');
const groupSource=await readFile(resolve(root,'components/ToggleSelectionGroup/ToggleSelectionGroup.demo.tsx'),'utf8');
const models=vm.runInNewContext('('+groupSource.match(/const models = (\[[\s\S]*?\]);/)[1]+')');
const scenarios=vm.runInNewContext('('+groupSource.match(/const scenarios = (\[[\s\S]*?\]);/)[1]+')',{models});
for (const scenario of scenarios) group(scenario.id,{scenarioId:scenario.id,scenario},s=>assert.equal(s[0].composition.id,scenario.id));
const tooltip=await react('TooltipToast');
for (const animation of ['subtle','playful','none']) tooltip(animation,{animation},s=>{assert.equal(s[0].props.animation,animation);assert.equal(s[0].props.placement,'auto');});
const thinking=await react('ThinkingIndicator');
for (const showIcon of [true,false]) for (const size of ['default','compact']) thinking(`${size}/icon=${showIcon}`,{showIcon,size},s=>{assert.equal(s[0].props.showIcon,showIcon);assert.equal(s[0].props.size,size);});
const runner=await react('AutomationRunner');
for (const view of ['default','expanded','minimized']) for (const placement of ['bottom-left','bottom-center','bottom-right']) runner(`${view}/${placement}`,{open:true,view,placement,page:'Overview'},s=>{assert.equal(s[0].props.defaultView,view);assert.equal(s[0].props.placement,placement);});
const steps=await react('Steps');
for (const animated of [true,false]) steps(`animated=${animated}`,{animated},s=>assert.equal(s[0].props.animated,animated));
for (const state of ['default','hover','focus','disabled','error']) add('Input',state,{'#stateLabel':{'data-state':state}},s=>assert.equal(s[0].props.disabled,state==='disabled'));
for (const theme of ['analysis','post','engage']) add('Checkbox',theme,{'[data-theme][aria-pressed="true"]':{'data-theme':theme}},s=>assert.equal(s[0].theme,theme));
for (const mode of ['editable','buttons']) add('QuantityStepper',mode,{'[data-mode-control][aria-pressed="true"]':{'data-mode-control':mode}},s=>assert.equal(s[0].props.inputMode,mode==='buttons'?'buttons-only':'editable'));
for (const icon of [true,false]) for (const count of [true,false]) add('Tabs',`icons=${icon}/counts=${count}`,{'#showIcons':{checked:icon},'#showCounts':{checked:count}},s=>{assert.equal(s[0].slots.icon,icon);assert.equal(s[1].slots.count,count);});
for (const composition of ['compact','search','filter','account','action']) for (const enabled of [true,false]) add('Select',`${composition}/${enabled}`,{'#compositionVariantControl':{'data-value':composition},'#variantIcons':{checked:enabled},'#variantOpen':{checked:enabled}},s=>{assert.equal(s[0].composition,composition);assert.equal(s[0].slots?.leadingIcon,composition==='action'?enabled:undefined);});
for (const state of ['ready','empty','loading','error']) for (const enabled of [true,false]) add('NotificationBell',`${state}/options=${enabled}`,{'#dotModeDemo':{checked:enabled},'#panelStateMenu [aria-selected="true"]':{'data-value':state},...Object.fromEntries(['showIcons','showStatus','showActions','showErrors'].map(id=>['#'+id,{checked:enabled}]))},s=>{assert.equal(s.length,1);assert.equal(s[0].component,'NotificationBell');assert.equal(Object.keys(s[0].props).length,0);});
for (const index of [1,22,24,25]) for (const enabled of [true,false]) add('Avatar',`asset=${index}/motion=${enabled}`,{'[data-picker="account"] [aria-selected="true"]':{'data-index':String(index)},'[data-picker="social"] [aria-selected="true"]':{'data-index':String(index)},'#avatarMotion':{checked:enabled}},s=>assert.equal(s[0].composition.assetIndex,index));
for (const name of ['SegmentedChoice','PlanCardCurrent','TagInput','TreeNav','Badge','StatCardCurrent','Table','Chart','ScoreGauge','CreditBar','Dialog','ConfirmationDialog']) add(name,'gallery',{},s=>assert.equal(s.length,0));

const checks=[];
try {
  assert.deepEqual([...new Set(cases.map(c=>c.path))].sort(),Object.keys(context.guidance).sort());
  for (const path of ['components/NotificationBell/NotificationBell.html']) await access(resolve(root,path));
  checks.push({name:'All Copy for AI entries covered and references exist',status:'pass'});
} catch(error) { checks.push({name:'Entry coverage',status:'fail',error:error.message}); }

// Compile exported props against the actual public component types.
await mkdir(output,{recursive:true});
const typed=cases.filter(c=>c.snapshot).flatMap(c=>context.AiseeAiDelivery.configuration(deliveries[c.path],c.snapshot)).filter(s=>s.props && Object.keys(s.props).length);
const typeSource="import type { ComponentProps } from 'react';\nimport * as DS from '../../src/index';\n"+typed.map((s,i)=>`const config${i}: Partial<ComponentProps<typeof DS.${s.component}>> = ${JSON.stringify(s.props)};`).join('\n');
await writeFile(resolve(output,'props.tsx'),typeSource);
await writeFile(resolve(output,'tsconfig.json'),JSON.stringify({extends:'../../tsconfig.json',include:['props.tsx','../../src/vite-env.d.ts']}));
const typecheck=spawnSync(resolve(root,'node_modules/.bin/tsc'),['-p',resolve(output,'tsconfig.json')],{cwd:root,encoding:'utf8'});
checks.push({name:'Exported props match public TypeScript API',status:typecheck.status===0?'pass':'fail',...(typecheck.status===0?{}:{error:typecheck.stdout+typecheck.stderr+String(typecheck.error||'')})});
const regression=spawnSync(process.execPath,['--test','tests/component-config.test.mjs'],{cwd:root,encoding:'utf8'});
checks.push({name:'Actual copy handler, stale frame and missing configuration regressions',status:regression.status===0?'pass':'fail',...(regression.status===0?{}:{error:regression.stdout+regression.stderr})});

await mkdir(output,{recursive:true});
const failed=cases.filter(c=>c.status==='fail').length+checks.filter(c=>c.status==='fail').length;
const report={generatedAt:new Date().toISOString(),scope:'Configuration contract tests using controlled state fixtures; NOT browser interaction or AI-generated visual acceptance.',components:new Set(cases.map(c=>c.path)).size,cases:cases.length,failed,checks,results:cases};
await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
const csvCell=value=>'\"'+String(value).replaceAll('\"','\"\"')+'\"';
await writeFile(resolve(output,'review.csv'),'component,case,contract,browser,AI_output,model,viewport,evidence,deviations\n'+cases.map(c=>[c.name,c.label,c.status,'NOT RUN','NOT RUN','','','',''].map(csvCell).join(',')).join('\n'));
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await writeFile(resolve(output,'report.html'),`<!doctype html><meta charset="utf-8"><title>Copy for AI 批量检查</title><style>body{font:16px/1.6 system-ui;max-width:1080px;margin:40px auto;padding:0 24px;background:#fafafa;color:#111}details{background:white;border:1px solid #ddd;border-radius:8px;margin:8px 0;padding:12px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}summary{cursor:pointer}.warning{background:#fff5d6;padding:16px}</style><h1>Copy for AI 批量检查</h1><p>${report.components} 个组件 · ${cases.length} 个配置案例 · ${failed} 项失败</p><p class="warning">本报告验证复制配置与 API 契约。浏览器点击路径、视觉还原和其他 AI 的实际生成结果仍须单独验收。未测试项不能当作通过。案例使用受控测试值，不代表用户当前浏览器选择或产品默认值。</p><h2>检查结果</h2>${checks.map(c=>`<details open><summary>${escape(c.status+' · '+c.name)}</summary><pre>${escape(c.error||'通过')}</pre></details>`).join('')}<h2>配置与真实提示词模板</h2>${cases.map(c=>`<details><summary>${escape(c.status+' · '+c.name+' · '+c.label)}</summary><p>参考：${escape(c.path)}</p><pre>${escape(c.error||c.prompt)}</pre></details>`).join('')}<h2>生成结果验收（尚未执行）</h2><p>固定模型、版本、目标任务与视口；使用带既有样式和交互的真实宿主，记录接入前后截图与行为。两种模式都保留页面布局、业务逻辑、点击、焦点、禁用和状态流转；Apply AISEE design 只更新组件视觉与动效，Add motion only 保留静态外观、只增加缺失动效。验证 reduced-motion 和监听清理；范围外改动必须先获明确确认。另测目标不存在时新增，以及不兼容时保留原实现并报告冲突。</p>`);
console.log(`Copy for AI: ${report.components} components, ${cases.length} controlled cases, ${failed} failures.\nReport: ${resolve(output,'report.html')}\nBrowser / AI output verification: NOT RUN by this command.`);
for(const check of checks.filter(c=>c.status==='fail')) console.error(check.error);
for(const entry of cases.filter(c=>c.status==='fail')) console.error(entry.name,entry.label,entry.error);
if(failed) process.exitCode=1;
