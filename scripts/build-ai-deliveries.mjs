import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { notificationUsage } from './ai-delivery-examples.mjs';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(root, 'assets/ai-deliveries');
await mkdir(output, {recursive:true});
const manifest = {};
const deliveryContext = vm.createContext({URL});
vm.runInContext(await readFile(resolve(root,'assets/ai-delivery.js'),'utf8'),deliveryContext);
for (const page of ['components/NotificationBell/NotificationBell.html']) {
  const name = 'NotificationBell';
  const modules = ['NotificationBell', 'Notification'];
  const files = new Map();
  async function collect(path) {
    const absolute = resolve(root, path);
    if (!absolute.startsWith(root + '/')) throw new Error(`Outside source root: ${path}`);
    path = relative(root, absolute);
    if (files.has(path)) return;
    const bytes = await readFile(absolute);
    files.set(path, bytes.toString('base64'));
    if (/\.(tsx?|css)$/.test(path)) {
      const source = bytes.toString();
      const refs = [];
      if (/\.tsx?$/.test(path)) {
        refs.push(...[...source.matchAll(/^(?:import|export)\s+(?:[^;]*?\s+from\s+)?['"]([^'"]+)['"]/gm)].map(m=>m[1]));
      } else {
        refs.push(...[...source.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map(m=>m[1]));
        refs.push(...[...source.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)].map(m=>m[1]));
      }
      for (const ref of refs) {
        if (ref.startsWith('data:') || ref.startsWith('#')) continue;
        if (!ref.startsWith('.')) {
          if (!['react','react-dom'].includes(ref)) throw new Error(`Unlisted external dependency: ${ref}`);
          continue;
        }
        let target = resolve(dirname(absolute), ref);
        if (!extname(target)) {
          for (const extension of ['.tsx','.ts']) {
            try { await access(target+extension); target += extension; break; } catch {}
          }
        }
        await collect(relative(root, target));
      }
    }
  }
  for (const module of modules) await collect(`src/components/${module}.tsx`);
  // Preserve shared styling exactly. No selector pruning that could lose a state or animation.
  for (const path of ['src/tokens/tokens.css','src/styles/base.css']) await collect(path);
  const sharedCss = await readFile(resolve(root,'src/styles/components.css'),'utf8');
  const notificationCss = sharedCss.slice(sharedCss.indexOf('.aisee-notification-bell {'),sharedCss.indexOf('.aisee-table-wrap {'));
  if (!notificationCss.includes('@keyframes aisee-notification-bell-ring')) throw Error('Missing Notification CSS boundary');
  const reducedMotion = sharedCss.split('\n').filter(line=>line.includes('.aisee-notification-bell,')).join('\n');
  files.set('src/styles/components.css', Buffer.from(notificationCss+'\n@media (prefers-reduced-motion: reduce) {\n'+reducedMotion+'\n}').toString('base64'));
  const entry = '"use client";\n' + modules.map(module=>`export * from './src/components/${module}';`).join('\n') + '\n';
  const styles = "@import './src/tokens/tokens.css';\n@import './src/styles/base.css';\n@import './src/styles/components.css';\n";
  files.set('index.ts', Buffer.from(entry).toString('base64'));
  files.set('styles.css', Buffer.from(styles).toString('base64'));
  files.set('INTEGRATION.md', Buffer.from('# Notification integration\n\nUse React 18+, TSX and CSS/SVG asset imports. Load styles.css once. The following example lives in src/; adapt its import path to the host. Apply the copied configuration over these defaults.\n\n```tsx\n'+notificationUsage+'\n```\n').toString('base64'));
  const payload = gzipSync(JSON.stringify(Object.fromEntries([...files].sort())), {level:9}).toString('base64');
  const sha256 = createHash('sha256').update(Buffer.from(payload,'base64')).digest('hex');
  const api = modules.map(module => {
    const source = Buffer.from(files.get(`src/components/${module}.tsx`),'base64').toString();
    return [...source.matchAll(/^export (?:interface [\s\S]*?^}|type [^;]+;)/gm)].map(m=>m[0]).join('\n');
  }).join('\n');
  const source = modules.map(module => `### src/components/${module}.tsx\n\`\`\`tsx\n${Buffer.from(files.get(`src/components/${module}.tsx`),'base64').toString()}\n\`\`\``).join('\n');
  const usage = notificationUsage;
  const delivery = {usage,schemaVersion:1,page,name,modules,sha256,payload,api,source,fileCount:files.size};
  const installScript = deliveryContext.AiseeAiDelivery.installer(delivery);
  delivery.installerSha256 = createHash('sha256').update(installScript).digest('hex');
  const installerFile = `${name}-${delivery.installerSha256}.cjs`;
  delivery.installerUrl = `https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/${installerFile}`;
  await writeFile(resolve(output,installerFile),installScript);
  await writeFile(resolve(output, name+'.json'), JSON.stringify(delivery));
  manifest[page] = {url:`assets/ai-deliveries/${name}.json`,sha256,fileCount:files.size,bytes:Buffer.byteLength(JSON.stringify(delivery))};
}
await writeFile(resolve(output,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log(`Generated ${Object.keys(manifest).length} self-contained source deliveries (source, styles, tokens, assets and Karla).`);
console.log(`Payload JSON size: ${Math.min(...Object.values(manifest).map(d=>d.bytes))}–${Math.max(...Object.values(manifest).map(d=>d.bytes))} bytes.`);
