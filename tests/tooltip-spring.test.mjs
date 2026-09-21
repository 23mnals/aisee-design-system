import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
const result = await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:fileURLToPath(new URL('../src/utils/spring.ts',import.meta.url)),formats:['cjs']}}});
const code=(Array.isArray(result)?result[0]:result).output.find(item=>item.type==='chunk').code;
const module={exports:{}};
new Function('module','exports',code)(module,module.exports);
const {stepSpring}=module.exports;
test('pointer spring overshoots then settles symmetrically for left and right entrances',()=>{
  for(const direction of [-1,1]) {
    let s={value:12*direction,velocity:160*direction},peak=0;
    for(let i=0;i<600;i++) {s=stepSpring(s.value,s.velocity,18*direction,100,5,1/60);peak=Math.max(peak,s.value*direction);}
    assert.ok(peak>24, 'visible overshoot rather than a linear tilt');
    assert.ok(Math.abs(s.value-18*direction)<.001);
  }
});
test('changing pointer direction retains inertia and eventually follows the new target',()=>{
  let s={value:0,velocity:0};
  for(let i=0;i<8;i++) s=stepSpring(s.value,s.velocity,18,100,5,1/60);
  const before=s.value;
  s=stepSpring(s.value,s.velocity,-18,100,5,1/120);
  assert.ok(s.value>before, 'keeps momentum before reversing');
  for(let i=0;i<600;i++) s=stepSpring(s.value,s.velocity,-18,100,5,1/60);
  assert.ok(Math.abs(s.value+18)<.001);
});
test('entry spring settles with overshoot at low and high refresh rates',()=>{
  for(const fps of [30,60,120]) {
    let s={value:0,velocity:0},peak=0;
    for(let i=0;i<fps*5;i++) {s=stepSpring(s.value,s.velocity,1,260,10,1/fps);peak=Math.max(peak,s.value);}
    assert.ok(peak>1.2 && peak<1.5); assert.ok(Math.abs(s.value-1)<.001);
  }
});
