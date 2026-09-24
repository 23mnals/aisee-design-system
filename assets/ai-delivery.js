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
  const modes = Object.freeze({
    design: Object.freeze({label:'Apply AISEE design', goal:'Update the existing target component’s visual design and motion to the AISEE reference. Apply changes only inside the component, preserve its placement and surrounding page layout, and keep existing business behavior.'}),
    motion: Object.freeze({label:'Add motion only', goal:'Add only the target component’s missing AISEE motion. Preserve its existing static appearance, including size, color, typography, spacing, icons and layout, and keep existing business behavior.'})
  });
  function modeInfo(mode = 'design') {
    if (!Object.prototype.hasOwnProperty.call(modes, mode)) throw Error('Choose a supported Copy for AI mode.');
    return modes[mode];
  }
  function variants(delivery, snapshot) {
    // Preview scope names describe galleries, not a product target.
    return configuration(delivery, snapshot).map(({scope, ...variant}) => variant);
  }
  function format(delivery, snapshot, {mode = 'design', variantIndex = null} = {}) {
    const selectedMode = modeInfo(mode);
    let target = '';
    if (variantIndex !== null) {
      const choices = variants(delivery, snapshot);
      if (!Number.isInteger(variantIndex) || variantIndex < 0 || !choices[variantIndex]) throw Error('Select the current variant again before copying.');
      target = `\nSelected variant target (explicitly chosen by the user; applies only to attributes permitted by the goal): ${JSON.stringify(choices[variantIndex])}`;
    }
    return `Integrate AISEE ${delivery.name} into this React project.

Goal — ${selectedMode.label}: ${selectedMode.goal}

Shared component scope and behavior protection:
1. Inspect the existing target, UI library, styles and callers first (shadcn: components.json, aliases and components/ui). Before editing, list the exact allowed paths: only the requested component implementation and its directly owned local styles. A components/ or _components/ directory is not a blanket allowlist. Reading a file does not authorize editing it. Reuse the existing component and UI library; do not create a parallel primitive or import full delivery CSS. If the target is ambiguous or absent, propose the target/new component paths and wait for my confirmation.
2. Preserve the component API, state ownership, checked/defaultChecked, disabled, callbacks, keyboard/focus behavior and existing business flow. Use component-internal animation effects/refs with cleanup and reduced-motion support. Do not add pending/optimistic state, change state timing, bypass confirmation or simulate success. Press feedback may animate immediately; the actual state must still follow the original business logic and API results.
3. Do not modify business pages/callers, page layout or copy, business logic, hook files (shared/custom/business), APIs, data fetching/request layers, timeouts, error handling, routing, global styles/themes/providers, project/build/cache configuration, package manifests or lockfiles. Do not install dependencies. Internal animation effects do not authorize edits to hook files or business state.
4. If integration or validation requires any file outside this scope, STOP before editing it. List each exact file, why it is needed, the smallest proposed diff and its impact; wait for my explicit confirmation, then change only the approved hunks. This includes caller imports, event wrappers, Tooltip structure and node-remount fixes. Network/cache/test failures and later requests to continue/fix/verify do not expand this scope by themselves.
5. Preserve existing staged, unstaged and untracked work; never use whole-file rollback over prior changes. Inspect downloaded reference source only in a temporary directory outside the host project. The selected goal and this scope override broader reference installation/default/preservation instructions: visual changes are authorized only by the goal, never by preview defaults. If no variant target is attached, do not infer one from the playground. A selected variant never authorizes business-state or scope changes. Use existing permitted checks, review every changed file against the allowlist, and report unresolved limitations without fixing unrelated code.

Reference: ${guideUrl(delivery)}${target}`;
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
  global.AiseeAiDelivery = Object.freeze({format, installer, checkPublished, guideUrl, configuration, variants, modes, modeInfo, resolveDelivery});
})(typeof window === 'undefined' ? globalThis : window);
