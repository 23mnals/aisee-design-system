import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await mkdir(resolve(root, 'dist'), { recursive: true });
await mkdir(resolve(root, 'dist/assets'), { recursive: true });
await copyFile(resolve(root, 'src/tokens/tokens.json'), resolve(root, 'dist/tokens.json'));
await copyFile(resolve(root, 'src/tokens/color-architecture.json'), resolve(root, 'dist/color-architecture.json'));
await copyFile(resolve(root, 'assets/dialog-close.svg'), resolve(root, 'dist/assets/dialog-close.svg'));
console.log('Copied package token and component assets.');
