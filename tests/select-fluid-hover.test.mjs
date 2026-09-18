import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../components/Select/Select.html', import.meta.url), 'utf8');
const start = html.indexOf('function installFluidHover(surface){');
const end = html.indexOf("document.querySelectorAll('.menu,.variant-select__menu').forEach(installFluidHover);", start);

function fixture() {
  let top = 1000, nextFrame = 0;
  const frames = new Map(), events = new Map();
  const highlight = { className: '', dataset: {}, style: {}, setAttribute() {} };
  const items = [10, 54, 98].map((offset, index) => ({
    dataset: {}, hidden: false, classList: { add() {} },
    getClientRects: () => [1], closest: () => null,
    getAttribute: name => name === 'aria-selected' && index === 0 ? 'true' : null,
    getBoundingClientRect: () => ({ top: top + offset, left: 0, width: 200, height: 40 }),
  }));
  const surface = {
    clientLeft: 0, clientTop: 0, classList: { add() {} }, prepend() {},
    querySelectorAll: () => items,
    getBoundingClientRect: () => ({ top, left: 0 }),
    addEventListener: (name, handler) => events.set(name, handler),
  };
  const context = vm.createContext({
    surface, document: { createElement: () => highlight },
    window: { addEventListener() {} },
    MutationObserver: class { observe() {} },
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  vm.runInContext(html.slice(start, end) + '\ninstallFluidHover(surface);', context);
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
  flush();
  return {
    items, highlight, flush,
    scrollTo: value => { top = value; },
    gap: y => events.get('pointermove')({ clientY: y, target: { closest: () => null } }),
    direct: index => events.get('pointermove')({ clientY: top + 20, target: { closest: selector => selector === '.fluid-hover-item' ? items[index] : null } }),
    blocked: () => events.get('pointermove')({ target: { closest: () => ({}) } }),
    leave: () => events.get('pointerleave')(),
  };
}

test('Select gap hover stays on the nearest row after its page scrolls', () => {
  const f = fixture();
  f.scrollTo(100);
  f.gap(197);
  f.flush();
  assert.equal(f.items[2].dataset.active, 'true');
  assert.equal(f.highlight.dataset.visible, 'true');
  f.scrollTo(-300);
  f.gap(-203);
  f.flush();
  assert.equal(f.items[2].dataset.active, 'true');
});

test('Queued gap hover cannot override a newer row, control, or pointer exit', () => {
  for (const next of ['direct', 'blocked', 'leave']) {
    const f = fixture();
    f.gap(1097);
    if (next === 'direct') f.direct(1);
    else f[next]();
    f.flush();
    assert.equal(f.items[next === 'direct' ? 1 : 0].dataset.active, 'true');
  }
});

test('Instant hover repositioning preserves visibility instead of fading out', () => {
  const rule = html.match(/\.fluid-hover-highlight\[data-instant=true\]\{([^}]+)\}/)?.[1];
  assert.ok(rule);
  assert.doesNotMatch(rule, /opacity\s*:\s*0/);
  assert.match(rule, /transition:none/);
});
