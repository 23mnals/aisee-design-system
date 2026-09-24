/* Portable source delivery. No private package, remote installer or repository access required. */
(function(global) {
  'use strict';
  function installer(delivery) {
    return `// Save as install-aisee.cjs; run from your product root, not the design-system repo.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const bundle = ${JSON.stringify({payload:delivery.payload,sha256:delivery.sha256})};
const root = path.resolve(process.argv[2] || 'src/components/aisee/${delivery.name.toLowerCase()}');
const cwd = process.cwd();
if (!root.startsWith(cwd + path.sep)) throw Error('Choose a directory inside this project');
const bytes = Buffer.from(bundle.payload, 'base64');
if (crypto.createHash('sha256').update(bytes).digest('hex') !== bundle.sha256) throw Error('Incomplete delivery: checksum mismatch');
const files = JSON.parse(zlib.gunzipSync(bytes));
const writes = Object.entries(files).map(([name, data]) => {
  const dest = path.resolve(root, name);
  if (!dest.startsWith(root + path.sep)) throw Error('Invalid delivery path');
  for (let current = dest; current !== cwd; current = path.dirname(current)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw Error('Refusing symlink: ' + current);
  }
  const content = Buffer.from(data, 'base64');
  if (fs.existsSync(dest) && !fs.readFileSync(dest).equals(content)) throw Error('Existing file differs: ' + dest + '. Choose another directory or review manually.');
  return [dest, content];
});
for (const [dest, content] of writes) {
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  if (!fs.existsSync(dest)) fs.writeFileSync(dest, content, {flag:'wx'});
}
console.log('Installed ' + writes.length + ' source/style/asset files into ' + root);
`;
  }
  function configuration(delivery, snapshot) {
    const allowed=delivery.configuration || {};
    return (snapshot?.sections || []).flatMap(section=> {
      const props={};
      for(const key of allowed.props?.[section.component] || []) {
        const value=section.props?.[key];
        if(['string','boolean','number'].includes(typeof value) && String(value).length<=120) props[key]=value;
      }
      const slots={};
      for(const key of allowed.slots?.[section.component] || []) if(typeof section.slots?.[key]==='boolean')slots[key]=section.slots[key];
      const theme=allowed.themes?.includes(section.theme) ? section.theme : undefined;
      if(!Object.keys(props).length && !Object.keys(slots).length && !theme)return [];
      return [{component:section.component,...(section.scope?{scope:section.scope}:{}),...(Object.keys(props).length?{props}:{}),...(Object.keys(slots).length?{slots}:{}),...(theme?{theme}:{})}];
    });
  }
  function publicUrl(value, base) {
    const url=new URL(value,base);
    if(url.protocol!=='https:' || url.username || url.password)throw Error('Production delivery needs a public HTTPS URL.');
    if(base && url.origin!==new URL(base).origin)throw Error('Delivery references must stay on the published origin.');
    return url.href;
  }
  function guideUrl(delivery) {return publicUrl(delivery.latestUrl);}
  function format(delivery, snapshot) {
    const options=configuration(delivery,snapshot);
    return `Integrate AISEE ${delivery.name} into this React project. Inspect the existing target, styles, UI library and interactions first (shadcn: components.json/components/ui). Preserve them; add only requested missing capabilities. For animation requests, add only missing motion; do not restyle or change interactions. Reuse existing components; do not create parallel AISEE primitives or import full delivery CSS. Only create a component when the target is absent; incompatibility is not permission to replace it. Host preservation overrides delivery defaults/preserve rules and preview options. Reference: ${guideUrl(delivery)}${options.length ? ` Reference options (only for requested missing capabilities, never overwrite existing settings): ${JSON.stringify(options)}` : ''}`;
  }
  async function checkPublished(expected) {
    const latestUrl=guideUrl(expected);
    const response=await fetch(latestUrl,{cache:'no-store'});
    if(!response.ok)throw Error(`${expected.name} 最新生产交付尚未发布或不可访问（HTTP ${response.status}）。`);
    const latest=await response.json();
    if(latest.schemaVersion!==3 || latest.name!==expected.name || latest.page!==expected.page || latest.version!==expected.version)throw Error(`${expected.name} 线上版本与当前预览不匹配，请先发布当前版本或刷新页面。`);
    const guide=await fetch(publicUrl(latest.delivery,latestUrl),{cache:'no-store'});
    if(!guide.ok || !(await guide.text()).includes(latest.installerSha256))throw Error(`${expected.name} 接入说明未发布或校验不匹配。`);
    const source=await fetch(publicUrl(latest.installer,latestUrl),{cache:'no-store'});
    if(!source.ok)throw Error(`${expected.name} 生产源码不可访问（HTTP ${source.status}）。`);
    const digest=await crypto.subtle.digest('SHA-256',await source.arrayBuffer());
    const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    if(hash!==latest.installerSha256)throw Error(`${expected.name} 生产源码校验失败。`);
    return {...latest,latestUrl};
  }
  async function resolveDelivery(page, base) {
    const response=await fetch(new URL('assets/ai-deliveries/manifest.json',base).href,{cache:'no-store'});
    if(!response.ok)throw Error('Production delivery manifest is unavailable.');
    const manifest=await response.json();
    const entry=manifest[page];
    if(!entry || entry.page!==page)throw Error('This component has no published production manifest.');
    return checkPublished(entry);
  }
  global.AiseeAiDelivery = Object.freeze({format, installer, checkPublished, guideUrl, configuration, resolveDelivery});
})(typeof window === 'undefined' ? globalThis : window);
