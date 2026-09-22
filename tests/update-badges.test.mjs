import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../assets/update-badges.js', import.meta.url), 'utf8');
const context = vm.createContext({ Date, Intl });
vm.runInContext(source, context);
const { isRecent, apply, dateFor } = context.AiseeUpdates;

test('NEW includes update day through day three and expires at Taipei midnight on day four', () => {
  assert.equal(isRecent('2026-09-17', new Date('2026-09-16T16:00:00Z')), true);
  assert.equal(isRecent('2026-09-17', new Date('2026-09-19T15:59:59.999Z')), true);
  assert.equal(isRecent('2026-09-17', new Date('2026-09-19T16:00:00Z')), false);
  assert.equal(isRecent('2026-09-17', new Date('2026-09-20T12:00:00Z')), false);
});
test('NEW crosses month, year and leap-day boundaries without a rolling-hour offset', () => {
  assert.equal(isRecent('2026-12-30', new Date('2026-12-31T16:00:00Z')), true);
  assert.equal(isRecent('2026-12-30', new Date('2027-01-01T16:00:00Z')), false);
  assert.equal(isRecent('2028-02-29', new Date('2028-03-01T16:00:00Z')), true);
  assert.equal(isRecent('2028-02-29', new Date('2028-03-02T16:00:00Z')), false);
});
test('missing, invalid and future update dates never generate a permanent NEW label', () => {
  for (const value of [undefined, '', 'updated', '2026-02-30', '2026-9-17', '2026-09-18']) {
    assert.equal(isRecent(value, new Date('2026-09-17T04:00:00Z')), false, String(value));
  }
  assert.equal(dateFor('missing-page'), undefined);
  assert.equal(dateFor('components/Toggle/Toggle.html'), '2026-09-18');
});
test('content badges can expire and refresh without touching product badges', () => {
  const styles = new Map();
  const badge = { dataset: {}, hidden: false, style: {
    setProperty: (key, value, priority) => styles.set(key, [value, priority]),
    removeProperty: key => styles.delete(key),
  } };
  const doc = { querySelectorAll(selector) {
    assert.equal(selector, '.aisee-content-new, .nav-new-label');
    return [badge];
  } };
  apply(doc, '2026-09-17', new Date('2026-09-19T16:00:00Z'));
  assert.equal(badge.hidden, true);
  assert.deepEqual(styles.get('display'), ['none', 'important']);
  badge.dataset.updatedAt = '2026-09-20';
  apply(doc, '2026-09-17', new Date('2026-09-19T16:00:00Z'));
  assert.equal(badge.hidden, false);
  assert.equal(styles.has('display'), false);
});
test('every Current standalone component loads the same expiry script', async () => {
  const portal = await readFile(new URL('../aisee-design-system-preview.html', import.meta.url), 'utf8');
  const paths = [...portal.matchAll(/\{ group: "Components",[^\n]+?path: "([^"]+)"[^\n]+?status: "Current"/g)].map(match => match[1]);
  for (const path of paths) {
    const html = await readFile(new URL('../' + path, import.meta.url), 'utf8');
    assert.match(html, /<script src="[^"\n]*assets\/update-badges\.js"><\/script>/, path);
  }
  assert.match(portal, /const hasUpdate = AiseeUpdates\.isRecent\(AiseeUpdates\.dateFor\(item\.path, item\.updatedAt\)\)/);
  assert.doesNotMatch(portal, /item\.updated === true && AiseeUpdates\.isRecent/);
  assert.match(source, /scheduleMidnight/);
  assert.match(source, /visibilitychange/);
});

test('Tooltip additions remain NEW for their actual update date and then expire', async () => {
  const path = 'components/TooltipToast/TooltipToast.html';
  assert.equal(dateFor(path), '2026-09-20');
  assert.equal(isRecent(dateFor(path), new Date('2026-09-21T04:00:00Z')), true);
  assert.equal(isRecent(dateFor(path), new Date('2026-09-22T16:00:00Z')), false);
  const html = await readFile(new URL('../' + path, import.meta.url), 'utf8');
  const demo = await readFile(new URL('../components/TooltipToast/TooltipToast.demo.tsx', import.meta.url), 'utf8');
  assert.match(html, /Tooltip <span class="aisee-content-new"/);
  assert.match(demo, /Avatar hover <span className="aisee-content-new"/);
});
