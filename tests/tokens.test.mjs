import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const tokens = JSON.parse(await readFile(new URL('../src/tokens/tokens.json', import.meta.url)));

test('v6 module colors are exact', () => {
  assert.equal(tokens.color.analysis.primary, '#CFFF29');
  assert.equal(tokens.color.postAgent.primary, '#FFE253');
  assert.equal(tokens.color.engage.banner, '#F3E7F4');
  assert.equal(tokens.color.danger, '#EC5212');
  assert.equal(tokens.color.redLight, '#FFD0D0');
});

test('v6 layout and border rules are exact', () => {
  assert.equal(tokens.size.sidebar, '224px');
  assert.equal(tokens.size.header, '70px');
  assert.equal(tokens.size.inputRing, '2px');
  assert.equal(tokens.shadow.confirmation, '0 20px 12px rgba(0,0,0,0.10), 0 8px 4px rgba(0,0,0,0.04)');
  assert.equal(tokens.color.border, 'rgba(17,17,17,0.05)');
});

test('dApp typography excludes Gotu', () => {
  assert.match(tokens.font.family.ui, /^Karla/);
  assert.doesNotMatch(JSON.stringify(tokens), /Gotu/i);
  assert.doesNotMatch(JSON.stringify(tokens), /JetBrains|Digital Numbers/i);
  assert.equal(new Set(Object.values(tokens.font.family)).size, 1);
});
