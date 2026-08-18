import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const tokens = JSON.parse(await readFile(new URL('../src/tokens/tokens.json', import.meta.url)));
const colorArchitecture = JSON.parse(await readFile(new URL('../src/tokens/color-architecture.json', import.meta.url)));

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
  assert.equal(tokens.shadow.toast, '0 20px 24px -4px rgba(16,24,40,0.10), 0 8px 8px -4px rgba(16,24,40,0.04)');
  assert.equal(tokens.color.border, 'rgba(17,17,17,0.05)');
});

test('dApp typography excludes Gotu', () => {
  assert.match(tokens.font.family.ui, /^Karla/);
  assert.doesNotMatch(JSON.stringify(tokens), /Gotu/i);
  assert.doesNotMatch(JSON.stringify(tokens), /JetBrains|Digital Numbers/i);
  assert.equal(new Set(Object.values(tokens.font.family)).size, 1);
});

test('Figma color architecture keeps primitive and semantic layers separate', () => {
  assert.equal(colorArchitecture.primitive.length, 44);
  assert.equal(colorArchitecture.semantic.length, 46);
  assert.equal(colorArchitecture.meta.source, 'Figma local variable collections: 元数据 and 语义化');
  assert.match(colorArchitecture.meta.rule, /semantic variables only/);

  const primitiveNames = new Set(colorArchitecture.primitive.map(token => token.name));
  const semanticNames = new Set(colorArchitecture.semantic.map(token => token.name));
  assert.equal(primitiveNames.size, 44);
  assert.equal(semanticNames.size, 46);
  assert.deepEqual(
    colorArchitecture.semantic.filter(token => token.published === false).map(token => token.name),
    ['colour/feedback/success', 'colour/feedback/warning']
  );
  const verifiedTag = colorArchitecture.semantic.find(token => token.id === 'tag-base');
  assert.equal(verifiedTag?.verified, true);
  assert.equal(verifiedTag?.review, undefined);
  assert.equal(verifiedTag?.light.value, '#FFFFFF');
  assert.equal(verifiedTag?.dark.value, '#FFFFFF');
  const hoverBackground = colorArchitecture.semantic.find(token => token.id === 'bg-hover');
  assert.equal(hoverBackground?.usageVerified, true);
  assert.equal(hoverBackground?.light.value, '#1111110A');
  assert.equal(hoverBackground?.dark.value, '#FFFFFF');
  assert.match(hoverBackground?.review || '', /Dark 模式/);

  for (const token of colorArchitecture.semantic) {
    for (const mode of ['light', 'dark']) {
      const reference = token[mode].ref;
      if (!reference) continue;
      assert.ok(primitiveNames.has(reference) || semanticNames.has(reference), `${token.name} has an unknown ${mode} alias: ${reference}`);
    }
  }
});
