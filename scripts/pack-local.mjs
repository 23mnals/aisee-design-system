import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const output = new URL('../artifacts/packages/', import.meta.url);
await mkdir(output,{recursive:true});
const cache = await mkdtemp(join(tmpdir(), 'aisee-pack-cache-'));
let result;
try {
  result = spawnSync('npm',['pack','--json','--ignore-scripts','--cache',cache,'--pack-destination',fileURLToPath(output)],{encoding:'utf8', cwd:fileURLToPath(new URL('../', import.meta.url))});
} finally {
  await rm(cache, {recursive:true, force:true});
}
if(result.status !== 0) throw new Error(result.stderr || result.stdout);
const [{filename}] = JSON.parse(result.stdout);
const sha256 = createHash('sha256').update(await readFile(new URL(filename,output))).digest('hex');
const commit = spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim();
const dirty = Boolean(spawnSync('git',['status','--porcelain'],{encoding:'utf8'}).stdout.trim());
await writeFile(new URL(filename+'.json',output),JSON.stringify({filename,sha256,commit,dirty,createdAt:new Date().toISOString(),note:'Local distribution only; no registry publication or license change.'},null,2)+'\n');
console.log(`Local package: ${fileURLToPath(new URL(filename,output))}\nSHA-256: ${sha256}\nSource: ${commit}${dirty?' + uncommitted changes':''}`);
