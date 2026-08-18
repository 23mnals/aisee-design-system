import { copyFile, cp, mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputRoot = join(projectRoot, 'site');
const portalFile = join(projectRoot, 'aisee-design-system-preview.html');
const excludedRootEntries = new Set([
  '.git',
  '.github',
  '.DS_Store',
  'dist',
  'node_modules',
  'site'
]);

await run('npm', ['run', 'tokens']);
await run('npx', ['vite', 'build', '--mode', 'docs']);
await rename(join(outputRoot, 'index.html'), join(outputRoot, 'docs-preview.html'));

// Keep the generated docs assets, then add the preserved standalone previews.
await mkdir(outputRoot, { recursive: true });

const rootEntries = await readdir(projectRoot, { withFileTypes: true });
for (const entry of rootEntries) {
  if (excludedRootEntries.has(entry.name) || entry.name.startsWith('.env')) continue;
  await cp(join(projectRoot, entry.name), join(outputRoot, entry.name), {
    recursive: true,
    force: true
  });
}

// These legacy aliases still point to their former repository-root locations.
// The real files now live in legacy/source, so materialize them in the Pages
// artifact instead of leaving broken symlinks for tar to dereference.
const legacySourceAliases = [
  'aisee-tracking-eye.css',
  'colors_and_type.css',
  'my-account.css',
  'my-account.main.css',
  'my-account.usage.css',
  'styles.css',
  'support.js',
  'upgrade-v2.css',
  'upgrade-v3.css'
];
for (const name of legacySourceAliases) {
  const destination = join(outputRoot, 'legacy/pages', name);
  await rm(destination, { force: true });
  await copyFile(join(projectRoot, 'legacy/source', name), destination);
}

// GitHub Pages opens the system portal at the repository root.
await copyFile(portalFile, join(outputRoot, 'index.html'));
await writeFile(join(outputRoot, '.nojekyll'), '');

console.log('Static design-system portal built in site/');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}
