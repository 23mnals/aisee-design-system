import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {productionFiles} from './production-delivery.mjs';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(root,'assets/ai-deliveries');
const registry=JSON.parse(await readFile(resolve(root,'delivery/components.json'),'utf8'));
const ctx=vm.createContext({URL});
vm.runInContext(await readFile(resolve(root,'assets/ai-delivery.js'),'utf8'),ctx);
const hash=content=>createHash('sha256').update(content).digest('hex');
const generatorVersion=hash((await Promise.all([new URL(import.meta.url),new URL('./production-delivery.mjs',import.meta.url),new URL('./css-delivery.mjs',import.meta.url)].map(p=>readFile(p,'utf8')))).join('\n') + ctx.AiseeAiDelivery.installer.toString());
const catalog={};
const built=[];
for(const manifest of registry.components) {
  const buffers=await productionFiles(manifest,root);
  const files=Object.fromEntries(Object.entries(buffers).map(([p,b])=>[p,b.toString('base64')]));
  const payload=gzipSync(JSON.stringify(files),{level:9}).toString('base64');
  const sha256=hash(Buffer.from(payload,'base64'));
  const version=hash(JSON.stringify({manifest,sha256,generatorVersion})).slice(0,16);
  const base=new URL(manifest.slug+'/',registry.publicBaseUrl).href;
  const release=`${manifest.slug}/releases/${version}`;
  const delivery={schemaVersion:3,name:manifest.name,page:manifest.page,version,configuration:manifest.configuration,dependencies:manifest.dependencies,compatibility:manifest.compatibility,files:Object.keys(files),fileCount:Object.keys(files).length,sha256,payload};
  const installer=ctx.AiseeAiDelivery.installer(delivery);
  const installerSha256=hash(installer);
  const latest={schemaVersion:3,name:manifest.name,page:manifest.page,version,delivery:`./releases/${version}/ready.md`,installer:`./releases/${version}/install.cjs`,installerSha256,configuration:manifest.configuration,dependencies:manifest.dependencies,compatibility:manifest.compatibility,files:Object.keys(files)};
  const installUrl=new URL(latest.installer,base).href;
  const guide=`# Integrate AISEE ${manifest.name}\n\nProduction delivery version: ${version}. Installer SHA-256: ${installerSha256}\n\n## Production implementation\n\nInstall only the following files (the manifest, not directory membership, defines this list):\n${Object.keys(files).map(p=>'- '+p).join('\n')}\n\nRead the delivered source and exported types for the exact API. Use the local index.ts exports; entry modules import styles.css. Never look for the original repository HTML, private docs or an installed AISEE library. Do not recreate the component from screenshots.\n\n## Preserve behavior\n${manifest.preserve.map(s=>'- '+s).join('\n')}\n\n## Integration boundary\n\nDo not create a Demo/Playground/showcase page, mock data, scenario switchers, Reset demo, Simulate incoming notification, Mark all read demo buttons or state galleries. Do not copy demo controls (Show icons/status/actions/error detail), sample content, fonts, global resets or the whole Design System token/styles/assets directories. Required production assets are already explicitly included above. Supply content, state, counts and callbacks from the real product. Missing product data should remain a typed integration prop, not invented fixtures.\n\nSelected options in the request override API defaults only for their named component/example scope. Scopes are alternative examples, not instructions to create multiple pages. Slot booleans describe host content composition, not component props. A module theme is an existing host wrapper data-aisee-theme value (analysis, post-agent, engage); the design label post maps to post-agent. Do not invent a theme prop. Do not convert preview state into business state. File membership never depends on selected options. Without selected options, retain the existing product configuration and then the documented source defaults.\n\nReuse compatible host React, fonts, Design Tokens and foundational dependencies. Scoped styles keep token override hooks with standalone fallbacks; typography inherits from the host. No font installation, global Design System provider, Tailwind, shadcn or entire AISEE library is required. Do not overwrite host styling globally.\n\n## Install automatically\n\nUse a compatible React/TypeScript project and a bundler supporting CSS${manifest.assets.length?' and SVG/image asset imports':''}. Component compatibility (from this manifest): ${Object.entries(manifest.compatibility).map(([name,range])=>name+' '+range).join(', ')}. Node applies to running the source installer, not the browser component. Copy for AI imposes no additional global version requirement. Runtime dependencies: ${manifest.dependencies.map(d=>d.name+' '+d.range+' (reuse host)').join(', ')}. If the host is not React, explain the stack mismatch; do not convert the whole application. For SSR use a client boundary around interactive components.\n\n1. Download ${installUrl} as .aisee-install.cjs inside the host project; verify SHA-256 ${installerSha256} before execution. Do not print archive data into chat.\n2. Run \`node .aisee-install.cjs src/components/aisee/${manifest.slug}\` (adapt the path). It unpacks exactly the production list; it installs no npm packages and refuses different existing files. Inspect conflicts or choose a new directory; never erase previous integrations automatically.\n3. Import the required exports from the local directory index, inspect the source/types, and wire them into the existing product. Install only missing compatible runtime dependencies with the host's package manager.\n4. Remove the temporary installer. Run the host typecheck/build and verify interactions, animations, keyboard behavior, responsive layout and reduced motion. Report exact download/build errors if any; do not ask for unrelated private repository files.\n\n${manifest.usage?'## Usage\n\n```tsx\n'+manifest.usage+'\n```\n\n':''}## Entry modules\n${manifest.entries.map(p=>'- '+p.split('/').pop()).join('\n')}\n\n## Latest version\n\nResolve ${base}latest.json for future integrations. Follow its delivery path relative to that URL. A copied stable latest.json URL resolves to the newest published production version at execution time, even when copied earlier. Already installed source does not update automatically. After resolving latest once for this installation, use that immutable release consistently; do not substitute an older ready-xx.md.\n`;
  built.push({manifest,release,delivery:{...delivery,latestUrl:base+'latest.json',installerSha256,installerUrl:installUrl},latest,guide,installer});
  catalog[manifest.page]={name:manifest.name,page:manifest.page,version,latestUrl:base+'latest.json',url:`assets/ai-deliveries/${manifest.name}.json`,fileCount:delivery.fileCount};
}
// Validate every component before advancing any latest pointer.
await mkdir(output,{recursive:true});
for(const item of built) {
  await mkdir(resolve(output,item.release),{recursive:true});
  await writeFile(resolve(output,item.release,'ready.md'),item.guide);
  await writeFile(resolve(output,item.release,'install.cjs'),item.installer);
  await writeFile(resolve(output,item.manifest.name+'.json'),JSON.stringify(item.delivery));
  await writeFile(resolve(output,item.manifest.slug,'latest.json'),JSON.stringify(item.latest,null,2)+'\n');
}
await writeFile(resolve(output,'manifest.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Generated ${built.length} production deliveries and stable latest pointers; demo files and fonts excluded.`);
