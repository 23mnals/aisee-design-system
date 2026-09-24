import {validateHostIntegration} from './host-project-compatibility.mjs';
import {readFile} from 'node:fs/promises';
import {resolve,dirname,basename,posix} from 'node:path';
import postcss from 'postcss';
import {parseSync} from 'rolldown/utils';
import valueParser from 'postcss-value-parser';
import {cssDependencyClosure,withVariableFallbacks} from './css-delivery.mjs';

const forbidden = /(?:^|[/_.-])(?:demo|playground|showcase|mock|mocks|stories|story|examples|fonts)(?:[/_.-]|$)|\.(?:woff2?|ttf|otf)$/i;
export const sourcePath = file => typeof file === 'string' ? file : file.path;
export function validateManifest(manifest) {
  validateHostIntegration(manifest);
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(manifest.name) || !/^[a-z0-9-]+$/.test(manifest.slug)) throw Error('Invalid component identity');
  if(!manifest.compatibility || Array.isArray(manifest.compatibility) || typeof manifest.compatibility!=='object' || !Object.entries(manifest.compatibility).every(([key,value])=>key && typeof value==='string' && value.trim())) throw Error(`${manifest.name}: declare compatibility explicitly`);
  for(const d of manifest.dependencies) if(manifest.compatibility[d.name] && manifest.compatibility[d.name]!==d.range) throw Error(`${manifest.name}: compatibility and dependency disagree for ${d.name}`);
  for(const d of manifest.styleDependencies||[]) if(d.mode!=='custom-properties' || d.path.startsWith('/') || d.path.split('/').includes('..') || forbidden.test(d.path)) throw Error(`${manifest.name}: invalid style dependency`);
  const production = manifest.productionFiles.map(sourcePath);
  const all = [...production, ...manifest.assets];
  if (!manifest.entries.length || new Set(all).size !== all.length) throw Error(`${manifest.name}: empty entry or duplicate file`);
  for (const file of all) {
    if (file.startsWith('/') || file.split('/').includes('..') || forbidden.test(file) || manifest.demoFiles.includes(file)) throw Error(`${manifest.name}: non-production file: ${file}`);
    if (/src\/(?:index\.ts|tokens\/)/.test(file)) throw Error(`${manifest.name}: do not deliver global design-system entry/tokens`);
  }
  for (const entry of manifest.entries) if (!production.includes(entry)) throw Error(`${manifest.name}: entry not declared: ${entry}`);
  for (const f of manifest.productionFiles) if (sourcePath(f).endsWith('.css') && (!f.classes?.length || typeof f === 'string')) throw Error(`${manifest.name}: CSS must declare component class ownership`);
}
export function imports(file,source) {
  const result = parseSync(file,source);
  if (result.errors.length) throw Error(`${file}: ${result.errors.map(e=>e.message).join('; ')}`);
  const references=[];
  const walk = node => {
    if (!node || typeof node !== 'object') return;
    if (['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type) && node.source) {
      if (typeof node.source.value !== 'string') throw Error(`${file}: dynamic import paths must be explicit`);
      references.push(node.source);
    }
    if (node.type === 'CallExpression' && node.callee?.name === 'require') {
      if (typeof node.arguments[0]?.value !== 'string') throw Error(`${file}: dynamic require must be explicit`);
      references.push(node.arguments[0]);
    }
    for (const [key,value] of Object.entries(node)) if (key !== 'source' || node.type === 'Program') {
      if (Array.isArray(value)) value.forEach(walk); else if (value && typeof value==='object') walk(value);
    }
  };
  walk(result.program);
  return references;
}
export async function productionFiles(manifest,root) {
  validateManifest(manifest);
  const read=file=>readFile(resolve(root,file),'utf8');
  const propertySources=await Promise.all((manifest.styleDependencies||[]).map(async d=>({...d,css:await read(d.path)})));
  const defaults=new Map();
  for(const source of propertySources)postcss.parse(source.css).walkRules(rule=>{if(rule.selector===':root'&&rule.parent.type==='root')rule.walkDecls(d=>defaults.set(d.prop,d.value));});
  const fallback=text=>text.replace(/var\((--[\w-]+)\)/g,full=>withVariableFallbacks(full,defaults));
  const runtimeProperties=new Set();
  const inlineValues=new Set();
  const map=new Map();
  const code=manifest.productionFiles.filter(f=>typeof f==='string');
  for(const file of code) map.set(file,basename(file));
  for(const file of manifest.assets) map.set(file,'assets/'+file.replace(/^(?:src\/)?assets\//,''));
  if(new Set(map.values()).size!==map.size) throw Error(`${manifest.name}: output name collision; declare unique source names`);
  const resolveImport=(file,spec)=> {
    const path=posix.normalize(posix.join(posix.dirname(file),spec));
    const found=[path,path+'.tsx',path+'.ts',path+'/index.ts',path+'/index.tsx'].find(p=>map.has(p));
    if(!found)throw Error(`${manifest.name}: undeclared production dependency ${file} -> ${spec}`);
    return found;
  };
  const files={}; const usedAssets=new Set(); const graph=new Map();
  for(const file of code) {
    let text=await read(file);
    const ast=parseSync(file,text).program;
    const collectRuntime=node=>{
      if(!node||typeof node!=='object')return;
      if(node.type==='Literal'&&typeof node.value==='string'&&node.value.includes('var(--'))inlineValues.add(node.value);
      const key=node.key?.value;
      if(typeof key==='string'&&key.startsWith('--'))runtimeProperties.add(key);
      if(node.type==='CallExpression'&&node.callee?.property?.name==='setProperty'){
        const value=node.arguments[0]?.value;if(typeof value==='string'&&value.startsWith('--'))runtimeProperties.add(value);
      }
      for(const value of Object.values(node))if(Array.isArray(value))value.forEach(collectRuntime);else if(value&&typeof value==='object')collectRuntime(value);
    };
    collectRuntime(ast);
    const refs=imports(file,text); graph.set(file,[]);
    for(const ref of refs.sort((a,b)=>b.start-a.start)) {
      const spec=ref.value;
      if(!spec.startsWith('.')) {
        const pkg=spec.startsWith('@')?spec.split('/').slice(0,2).join('/'):spec.split('/')[0];
        if(!manifest.dependencies.some(d=>d.name===pkg))throw Error(`${manifest.name}: undeclared npm dependency ${pkg}`);
        continue;
      }
      const target=resolveImport(file,spec); graph.get(file).push(target);
      if(manifest.assets.includes(target))usedAssets.add(target);
      const dest='./'+map.get(target).replace(/\.tsx?$/,'');
      text=text.slice(0,ref.start)+JSON.stringify(dest)+text.slice(ref.end);
    }
    text=fallback(text);
    if(manifest.entries.includes(file)) text='"use client";\nimport "./styles.css";\n'+text.replace(/^["']use client["'];?\s*/, '');
    files[map.get(file)]=Buffer.from(text);
  }
  const reached=new Set();
  const visit=file=>{if(reached.has(file))return;reached.add(file);(graph.get(file)||[]).forEach(visit);};
  manifest.entries.forEach(visit);
  for(const file of code) if(!reached.has(file))throw Error(`${manifest.name}: unused production source: ${file}`);
  const styles=manifest.productionFiles.filter(f=>typeof f==='object');
  const sources=await Promise.all(styles.map(async style=>{
    const tree=postcss.parse(await read(style.path),{from:style.path});
    tree.walkDecls(d=>{
      if(d.prop==='font-family')d.value='inherit';
      if(d.prop==='font'&&d.value!=='inherit'){
        d.value=d.value.replace(/(?:var\(--aisee-font-family[^)]*\)|Karla,\s*(?:Arial,\s*)?sans-serif)/g,'sans-serif');
        d.cloneAfter({prop:'font-family',value:'inherit'});
      }
    });
    return {...style,css:tree.toString()};
  }));
  // Discover @import dependencies for validation only. An imported file is never
  // silently delivered: any reachable rule/value/frame must be in the manifest.
  const known=new Set([...sources,...propertySources].map(s=>s.path));
  const allClasses=[...new Set(styles.flatMap(s=>s.classes))];
  for(let i=0;i<sources.length;i++){
    const pending=[];
    postcss.parse(sources[i].css).walkAtRules('import',rule=>{
      const nodes=valueParser(rule.params).nodes.filter(n=>n.type!=='space'&&n.type!=='comment');
      const first=nodes[0];const spec=first?.type==='function'&&first.value==='url'?valueParser.stringify(first.nodes).replace(/^['"]|['"]$/g,''):first?.value;
      if(!spec||/^(?:https?:|data:|\/)/.test(spec))throw Error('CSS imports must reference explicit local sources: '+rule.params);
      if(nodes.length>1)throw Error('Conditional CSS imports must be expressed as explicit @media/@supports/@layer source rules: '+rule.params);
      const path=posix.normalize(posix.join(posix.dirname(sources[i].path),spec));
      if(!known.has(path)){known.add(path);pending.push(path);}
    });
    for(const path of pending)sources.push({path,classes:allClasses,css:await read(path),undeclared:true});
  }
  const {tree:css}=cssDependencyClosure(sources,propertySources,[...runtimeProperties],[...inlineValues]);
  // Rewrite assets only after closure: keyframes and conditional providers can
  // introduce real asset dependencies too. Source locations survive cloning.
  css.walkDecls(d=>{
    d.value=d.value.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(all,q,url)=>{
      if(url.startsWith('data:')||url.startsWith('#'))return all;
      const origin=posix.relative(root.replaceAll('\\','/'),d.source.input.file.replaceAll('\\','/'));
      const target=resolveImport(origin,url);
      if(!manifest.assets.includes(target))throw Error('CSS asset not declared: '+target);
      usedAssets.add(target);return `url('./${map.get(target)}')`;
    });
  });
  const ownClasses=[...new Set(styles.flatMap(s=>s.classes))];
  const defaultsCss=ownClasses.map(c=>`.${c}, .${c}::before, .${c}::after, .${c} *, .${c} *::before, .${c} *::after { box-sizing: border-box; }\n.${c} { font-family: inherit; }`).join('\n');
  files['styles.css']=Buffer.from(defaultsCss+'\n'+css.toString()+'\n');
  for(const file of manifest.assets) {
    if(!usedAssets.has(file))throw Error(`${manifest.name}: unused asset declared: ${file}`);
    files[map.get(file)]=await readFile(resolve(root,file));
  }
  files['index.ts']=Buffer.from(manifest.entries.map(f=>`export * from './${basename(f).replace(/\.tsx?$/,'')}';`).join('\n')+'\n');
  files['styles.css.d.ts']=Buffer.from('export {};\n');
  // Per-asset declarations avoid conflicting global *.svg declarations when combining deliveries.
  for(const file of manifest.assets) files[map.get(file)+'.d.ts']=Buffer.from('declare const url: string; export default url;\n');
  return files;
}
