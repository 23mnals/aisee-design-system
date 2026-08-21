import { copyFile, cp, mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputRoot = join(projectRoot, 'site');
const portalFile = join(projectRoot, 'aisee-design-system-preview.html');
const publishedRootEntries = [
  'aisee-agent-test',
  'aisee-design-system-preview.html',
  'aisee-tracking-eye.png',
  'aisee-tracking-eye.svg',
  'animated',
  'assets',
  'brand',
  'components',
  'docs',
  'engage',
  'engage-v3',
  'fonts',
  'legacy',
  'preview',
  'public',
  'screenshots',
  'ui_kits',
  'uploads'
];

await run('npm', ['run', 'tokens']);
await rm(outputRoot, { recursive: true, force: true });
await run('npx', ['vite', 'build', '--mode', 'docs']);
await rename(join(outputRoot, 'index.html'), join(outputRoot, 'docs-preview.html'));

// Keep the generated docs assets, then add the preserved standalone previews.
await mkdir(outputRoot, { recursive: true });

for (const name of publishedRootEntries) {
  await cp(join(projectRoot, name), join(outputRoot, name), {
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

const artifactCleanup = await cleanArtifactTree(outputRoot);
if (artifactCleanup.danglingSymlinks.length) {
  console.log(`Removed ${artifactCleanup.danglingSymlinks.length} dangling symlink(s) from the Pages artifact:`);
  artifactCleanup.danglingSymlinks.forEach(name => console.log(`- ${name}`));
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

async function cleanArtifactTree(root) {
  const danglingSymlinks = [];
  const metadataFiles = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(directory, entry.name);
      if (entry.name === '.DS_Store') {
        await rm(entryPath, { force: true });
        metadataFiles.push(entryPath.slice(root.length + 1));
      } else if (entry.isSymbolicLink()) {
        try {
          await stat(entryPath);
        } catch (error) {
          if (error?.code !== 'ENOENT') throw error;
          await rm(entryPath, { force: true });
          danglingSymlinks.push(entryPath.slice(root.length + 1));
        }
      } else if (entry.isDirectory()) {
        await visit(entryPath);
      }
    }
  }

  await visit(root);
  return { danglingSymlinks, metadataFiles };
}
