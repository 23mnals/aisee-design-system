import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
const result = await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:fileURLToPath(new URL('../src/utils/tooltip-position.ts',import.meta.url)),formats:['cjs']}}});
const code=(Array.isArray(result)?result[0]:result).output.find(item=>item.type==='chunk').code;
const module={exports:{}};
new Function('module','exports',code)(module,module.exports);
const {positionTooltip}=module.exports;
const rect=(left,top,width=40,height=24)=>({left,top,width,height,right:left+width,bottom:top+height});
const bubble={width:140,height:40}, viewport={width:400,height:300};
test('auto uses top when it fits and flips below near the top edge',()=>{
  assert.equal(positionTooltip(rect(100,100),bubble,viewport).side,'top');
  const p=positionTooltip(rect(100,4),bubble,viewport);
  assert.equal(p.side,'bottom'); assert.equal(p.y,36);
});
test('explicit bottom still flips above at the bottom edge',()=>{
  const p=positionTooltip(rect(100,270),bubble,viewport,'bottom');
  assert.equal(p.side,'top'); assert.equal(p.y,222);
});
test('horizontal preferences flip at the left and right edges',()=>{
  assert.equal(positionTooltip(rect(355,100),bubble,viewport,'right').side,'left');
  assert.equal(positionTooltip(rect(4,100),bubble,viewport,'left').side,'right');
});
test('auto uses a horizontal side when neither vertical side fits',()=>{
  assert.equal(positionTooltip(rect(50,110),{width:80,height:160},viewport).side,'right');
  assert.equal(positionTooltip(rect(300,110),{width:80,height:160},viewport).side,'left');
});
test('cross-axis shifting preserves the side and keeps long labels inside narrow views',()=>{
  for(const anchor of [rect(0,90),rect(265,90)]) {
    const p=positionTooltip(anchor,{width:284,height:44},{width:300,height:200});
    assert.equal(p.side,'top'); assert.equal(p.x,8); assert.ok(p.y>=8);
  }
});
