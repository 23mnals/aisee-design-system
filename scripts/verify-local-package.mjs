import { mkdtemp, mkdir, writeFile, readFile, cp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

// Offline smoke test of the delivered tarball in a separate, existing-React-app fixture.
// React and tooling are reused from this checkout; AI output / SSR are not covered.
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const fixture = await mkdtemp(join(tmpdir(), 'aisee-consumer-'));
function run(command, args) {
  const result = spawnSync(command, args, {cwd:fixture, encoding:'utf8'});
  assert.equal(result.status, 0, result.stderr || result.stdout);
}
try {
  await mkdir(join(fixture, 'vendor'));
  const filename = `aisee-design-system-${pkg.version}.tgz`;
  await cp(join(root, 'artifacts/packages', filename), join(fixture, 'vendor', filename));
  await writeFile(join(fixture, 'package.json'), JSON.stringify({name:'aisee-recipient-smoke', private:true, type:'module'}));
  run('npm', ['install', `./vendor/${filename}`, '--offline', '--ignore-scripts', '--legacy-peer-deps', '--no-audit', '--no-fund', '--cache', join(fixture, 'cache')]);
  for (const dependency of ['react', 'react-dom', 'scheduler', '@types/react', '@types/react-dom', 'csstype']) {
    await cp(join(root, 'node_modules', dependency), join(fixture, 'node_modules', dependency), {recursive:true});
  }
  const installed = join(fixture, 'node_modules/@aisee/design-system');
  assert.match(await readFile(join(installed, 'docs/GETTING_STARTED.md'), 'utf8'), /第三方接入/);
  await writeFile(join(fixture, 'index.html'), '<div id="root"></div><script type="module" src="/main.tsx"></script>');
  await writeFile(join(fixture, 'main.tsx'), `import { createRoot } from 'react-dom/client';
import { Tooltip, Button } from '@aisee/design-system';
import '@aisee/design-system/styles.css';
createRoot(document.getElementById('root')!).render(<Tooltip content="成员信息" placement="auto" animation="playful"><Button>查看成员</Button></Tooltip>);`);
  await writeFile(join(fixture, 'assets.d.ts'), "declare module '*.css';\n");
  await writeFile(join(fixture, 'tsconfig.json'), JSON.stringify({compilerOptions:{target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',strict:true,noEmit:true,skipLibCheck:false,lib:['ES2022','DOM']},include:['main.tsx','assets.d.ts']}));
  run(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '--project', 'tsconfig.json']);
  await build({root:fixture, configFile:false, plugins:[react()], logLevel:'warn', build:{outDir:'output'}});
  const assets = await readdir(join(fixture, 'output/assets'));
  const css = await readFile(join(fixture, 'output/assets', assets.find(name=>name.endsWith('.css'))), 'utf8');
  assert.match(css, /@font-face/);
  assert.match(css, /data:font/);
  assert.match(css, /aisee-tooltip/);
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(match=>match[1].replace(/["']/g,''));
  assert.ok(urls.every(url=>url.startsWith('data:')), 'CSS must not depend on sender-only asset paths');
  console.log('PASS: local tarball installation, public API types, React/Vite consumer build, bundled font and CSS assets.');
  console.log('Scope: offline existing-React-app fixture; no public registry, SSR or external AI generation validation.');
} finally {
  await rm(fixture, {recursive:true, force:true});
}
