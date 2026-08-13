import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = resolve(root, 'public/legacy');
await mkdir(outputDir, { recursive: true });
await copyFile(
  resolve(root, 'ui_kits/webapp/Components.jsx'),
  resolve(outputDir, 'webapp-components.txt'),
);
console.log('Synced legacy Webapp browser source.');
