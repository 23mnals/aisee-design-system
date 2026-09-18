import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createElement as h} from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import {build} from 'vite';
const require=createRequire(import.meta.url);
const result=await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:'src/components/SidebarNavigation.tsx',formats:['cjs']},rollupOptions:{external:['react','react-dom','react/jsx-runtime']}}});
const module={exports:{}};
new Function('require','module','exports',(Array.isArray(result)?result[0]:result).output.find(entry=>entry.type==='chunk').code)(require,module,module.exports);
const {SidebarLayout,SidebarNavigation}=module.exports;
const groups=[{id:'main',label:'Workspace',items:[{id:'home',label:'Home'},{id:'report',label:'Reports',children:[{id:'summary',label:'Summary'}]}]}];

test('layout context supplies every variant and independent toggle position without losing navigation content',()=>{
  for(const variant of ['sidebar','muted','floating','inset']) for(const togglePosition of ['inside','outside']) {
    const output=render(h(SidebarLayout,{variant,togglePosition,sidebar:h(SidebarNavigation,{groups,value:'summary',defaultOpenItemIds:['report'],header:'Project',footer:'Account'})},h('h1',null,'Summary')));
    assert.ok(output.includes(`aisee-sidebar-layout--${variant}`));
    assert.ok(output.includes(`aisee-sidebar--${variant} aisee-sidebar--toggle-${togglePosition}`));
    assert.match(output,/aria-current="page"[^>]*><span[^>]*>Summary/);
    assert.equal((output.match(/aria-label="Close sidebar"/g)||[]).length,togglePosition === 'inside' ? 1 : 0);
    if (togglePosition === 'outside') assert.match(output,/aisee-sidebar-layout__toggle-slot/);
    assert.match(output,/Project/);assert.match(output,/Account/);assert.match(output,/<h1>Summary<\/h1>/);
    if (togglePosition === 'inside') assert.match(output,/aria-expanded="true" aria-controls=/);
  }
});
test('standalone sidebar defaults stay compatible and controlled collapsed state overrides the initial state',()=>{
  const output=render(h(SidebarNavigation,{groups,defaultCollapsed:true,collapsed:false}));
  assert.match(output,/aisee-sidebar--sidebar aisee-sidebar--toggle-inside/);
  assert.doesNotMatch(output,/aisee-sidebar--collapsed/);
  assert.match(output,/aria-label="Close sidebar"/);
  const collapsed=render(h(SidebarNavigation,{groups,defaultCollapsed:true,togglePosition:'outside'}));
  assert.match(collapsed,/aisee-sidebar--collapsed/);
  assert.match(collapsed,/aria-label="Open sidebar"/);
  assert.match(collapsed,/aria-haspopup="menu"/);
});

test('top navigation keeps a header and fully hides navigation instead of showing an icon rail',()=>{
  for (const reveal of ['hover','click']) {
    const output=render(h(SidebarLayout,{variant:'topbar',reveal,header:h('h1',null,'Report'),sidebar:h(SidebarNavigation,{groups,defaultCollapsed:true,defaultOpenItemIds:['report']})},h('main',null,'Page content')));
    assert.match(output,/aisee-sidebar-layout--topbar/);
    assert.match(output,/aisee-sidebar--topbar aisee-sidebar--toggle-outside aisee-sidebar--hidden/);
    assert.match(output,/<aside[^>]*inert=""[^>]*aria-hidden="true"/);
    assert.doesNotMatch(output,/aisee-sidebar--collapsed/);
    assert.match(output,/<header class="aisee-sidebar-layout__header">/);
    assert.match(output,/<h1>Report<\/h1>/);
    assert.match(output,/aisee-sidebar-layout__toggle-slot/);
    assert.match(output,/Summary/);
  }
});
