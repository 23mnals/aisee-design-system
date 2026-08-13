import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await mkdir(resolve(root, 'dist'), { recursive: true });
await copyFile(resolve(root, 'src/tokens/tokens.json'), resolve(root, 'dist/tokens.json'));
console.log('Copied package token assets.');
