import {readFile,writeFile,mkdir,mkdtemp,cp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {build} from 'vite';
import react from '@vitejs/plugin-react';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const manifest=JSON.parse(await readFile(join(root,'assets/ai-deliveries/manifest.json')));
const ctx=vm.createContext({URL});
vm.runInContext(await readFile(join(root,'assets/ai-delivery.js'),'utf8'),ctx);
const temp=await mkdtemp(join(tmpdir(),'aisee-source-recipient-'));
try {
  const entries=[];
  for(const entry of Object.values(manifest)) {
    const bundle=JSON.parse(await readFile(join(root,entry.url),'utf8'));
    const name=bundle.name.toLowerCase();
    const prompt=ctx.AiseeAiDelivery.format(bundle,{sections:[{component:'NotificationBell',props:{dot:true}}]});
    assert.ok(prompt.length < 4000, 'Short prompt must fit chat messages');
    assert.ok(!prompt.includes(bundle.payload), 'Never put the archive in clipboard');
    assert.ok(prompt.includes('"dot":true'));
    const installer=await readFile(join(root,'assets/ai-deliveries',new URL(bundle.installerUrl).pathname.split('/').pop()),'utf8');
    assert.equal(createHash('sha256').update(installer).digest('hex'),bundle.installerSha256);
    assert.ok(prompt.includes(bundle.installerUrl));
    await writeFile(join(temp,'install.cjs'),installer);
    const install=()=>spawnSync(process.execPath,['install.cjs',`src/components/aisee/${name}`],{cwd:temp,encoding:'utf8'});
    const result=install(); assert.equal(result.status,0,result.stderr);
    for (const module of bundle.modules) assert.equal(
      await readFile(join(temp,`src/components/aisee/${name}/src/components/${module}.tsx`),'utf8'),
      await readFile(join(root,`src/components/${module}.tsx`),'utf8'), 'Extracted source must match Current exactly');
    await writeFile(join(temp,'install.cjs'),installer.replace(bundle.sha256,'0'.repeat(64)));
    const corrupted=install();
    assert.notEqual(corrupted.status,0);
    assert.match(corrupted.stderr,/checksum mismatch/);
    await writeFile(join(temp,'install.cjs'),installer);
    assert.equal(install().status,0,'Same-source reinstall must be safe');
    await writeFile(join(temp,`src/${bundle.name}.tsx`),bundle.usage);
    entries.push(`export {default as ${bundle.name}} from './${bundle.name}';`);
    const localIndex=join(temp,`src/components/aisee/${name}/index.ts`);
    const original=await readFile(localIndex);
    await writeFile(localIndex,'// recipient change');
    assert.notEqual(install().status,0,'Must refuse to overwrite recipient changes');
    assert.equal(await readFile(localIndex,'utf8'),'// recipient change');
    await writeFile(localIndex,original);
  }
  for(const dep of ['react','react-dom','scheduler','@types/react','@types/react-dom','csstype']) await cp(join(root,'node_modules',dep),join(temp,'node_modules',dep),{recursive:true});
  await writeFile(join(temp,'package.json'),'{"name":"aisee-source-recipient","type":"module","private":true}');
  await writeFile(join(temp,'src/assets.d.ts'),"declare module '*.svg' { const url: string; export default url; }\ndeclare module '*.png' { const url: string; export default url; }\ndeclare module '*.css';\n");
  await writeFile(join(temp,'src/index.ts'),entries.join('\n'));
  await writeFile(join(temp,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',strict:true,noEmit:true,skipLibCheck:false,lib:['DOM','ES2022']},include:['src']}));
  const types=spawnSync(process.execPath,[join(root,'node_modules/typescript/bin/tsc'),'-p','tsconfig.json'],{cwd:temp,encoding:'utf8'});
  assert.equal(types.status,0,types.stdout+types.stderr);
  await build({root:temp,configFile:false,plugins:[react()],logLevel:'warn',build:{lib:{entry:join(temp,'src/index.ts'),formats:['es']},rollupOptions:{external:['react','react-dom','react/jsx-runtime']}}});
  console.log('PASS: Notification short prompt stays under 4,000 characters; its versioned installer extracts offline, reinstall safely, reject overwrites, typecheck and build with its real usage example.');
} finally {await rm(temp,{recursive:true,force:true});}
