import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const portalUrl = new URL('../aisee-design-system-preview.html', import.meta.url);
const projectUrl = new URL('../', import.meta.url);
const portal = await readFile(portalUrl, 'utf8');

test('system portal preserves the four required sections', () => {
  assert.match(portal, />README</);
  assert.match(portal, />Brand</);
  assert.match(portal, />Components</);
  assert.match(portal, />UI Kits — Webapp</);
});

test('every catalog preview exists and paths are unique', async () => {
  const paths = [...portal.matchAll(/path: "([^"]+)"/g)].map(match => match[1]);
  assert.ok(paths.length >= 40, `expected at least 40 previews, found ${paths.length}`);
  assert.equal(new Set(paths).size, paths.length, 'catalog paths must be unique');
  await Promise.all(paths.map(path => access(new URL(path, projectUrl))));
});

test('standalone portal script is syntactically valid', () => {
  const script = portal.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'inline script should exist');
  assert.doesNotThrow(() => new Function(script));
});

test('portal and v6 previews self-host Karla', async () => {
  const foundations = await readFile(new URL('../preview/dapp-v6-foundations.html', import.meta.url), 'utf8');
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  for (const html of [portal, foundations, components]) {
    assert.match(html, /Karla-VariableFont_wght\.ttf/);
  }
  assert.match(foundations, /Homepage \/ Brand.*Karla \+ Gotu/);
  assert.match(foundations, /dApp.*Karla/);
});
