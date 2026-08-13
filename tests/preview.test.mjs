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

test('portal uses the official AISEE logo mark', async () => {
  assert.match(portal, /src="\.\/assets\/aisee-logo-mark\.png"/);
  await access(new URL('../assets/aisee-logo-mark.png', import.meta.url));
});

test('legacy buttons preview uses official logo assets instead of a CSS redraw', async () => {
  const buttons = await readFile(new URL('../preview/components-buttons-badges.html', import.meta.url), 'utf8');
  assert.match(buttons, /src="\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(buttons, /src="\.\.\/assets\/logo-wordmark\.png"/);
  assert.doesNotMatch(buttons, /logo-mark-bg|logo-mark-face/);
});

test('brand logo preview uses official assets instead of a CSS redraw', async () => {
  const logo = await readFile(new URL('../preview/brand-logo.html', import.meta.url), 'utf8');
  assert.match(logo, /src="\.\.\/assets\/aisee-logo-mark\.png"/);
  assert.match(logo, /src="\.\.\/assets\/logo-wordmark\.png"/);
  assert.doesNotMatch(logo, /lm-bg|lm-face|lm-eye/);
});

test('sidebar uses compact 14px navigation typography', () => {
  assert.match(portal, /\.nav-home \{[\s\S]*?font-size: 14px;/);
  assert.match(portal, /\.nav-group summary \{[\s\S]*?font-size: 14px;/);
  assert.match(portal, /\.nav-item \{[^}]*font-size: 14px;/);
});

test('overview documents the current Figma and specification versions', () => {
  assert.match(portal, /Figma Product Design 5\.6/);
  assert.match(portal, /Design Specification v6/);
  assert.match(portal, /Figma 5\.6[\s\S]*?Current/);
  assert.match(portal, /Earlier Figma versions[\s\S]*?Planned/);
});

test('overview contains the complete documentation sections', () => {
  for (const id of ['product-overview', 'sources', 'content', 'visual', 'interaction', 'assets', 'components-overview', 'versions']) {
    assert.match(portal, new RegExp(`id="${id}"`));
  }
  assert.match(portal, /Homepage \/ Brand[\s\S]*?Karla \+ Gotu/);
  assert.match(portal, /dApp \/ App \/ Webapp[\s\S]*?Karla only/);
  assert.match(portal, /Never redraw the eye or wordmark with CSS/);
});

test('brand fonts are local and application typography remains Karla-only', async () => {
  const displayType = await readFile(new URL('../preview/type-display.html', import.meta.url), 'utf8');
  const logoPreview = await readFile(new URL('../preview/brand-logo.html', import.meta.url), 'utf8');
  for (const html of [displayType, logoPreview]) {
    assert.match(html, /fonts\/Gotu-Regular\.ttf/);
    assert.doesNotMatch(html, /fonts\.googleapis\.com/);
  }
  await access(new URL('../fonts/Gotu-Regular.ttf', import.meta.url));
  await access(new URL('../fonts/DigitalNumbers-Regular.ttf', import.meta.url));

  const foundations = await readFile(new URL('../preview/dapp-v6-foundations.html', import.meta.url), 'utf8');
  const components = await readFile(new URL('../preview/dapp-v6-components.html', import.meta.url), 'utf8');
  assert.doesNotMatch(`${foundations}\n${components}`, /DigitalNumbers-Regular|font-family:\s*(?:'|")?Digital Numbers/i);
});
