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
  function preset(configuration) {
    if (!configuration?.sections) throw new Error('Notification configuration is missing.');
    const bell = configuration.sections.find(s => s.component === 'NotificationBell');
    const panel = configuration.sections.find(s => s.component === 'NotificationPanel');
    const props = panel?.props || {};
    const state = props.state || 'ready';
    if (!['ready','empty','loading','error'].includes(state)) throw new Error('Unsupported Notification state.');
    const flags = [bell?.props?.dot ?? false, props.showIcons ?? true, props.showStatus ?? true, props.showActions ?? true, panel?.slots?.errorDetail ?? true];
    if (flags.some(value => typeof value !== 'boolean')) throw new Error('Invalid Notification options.');
    return {state, mask:flags.reduce((mask,value,index) => mask | (Number(value) << index),0)};
  }
  function guideUrl(delivery, configuration) {
    if (!delivery.guideBaseUrl) throw new Error('Notification guide is unavailable.');
    const url = new URL(delivery.guideBaseUrl);
    if (url.origin !== 'https://23mnals.github.io' || !url.pathname.startsWith('/aisee-design-system/assets/ai-deliveries/notification/')) throw new Error('Invalid Notification guide URL.');
    const {state,mask} = preset(configuration);
    return `${url.href}${state}-${mask}.md`;
  }
  function format(delivery, configuration) {
    return `将此配置的 AISEE Notification 组件接入我的 React 项目：${guideUrl(delivery, configuration)}`;
  }
  async function checkPublished(delivery, configuration) {
    const guide = await fetch(guideUrl(delivery, configuration), {cache:'no-store'});
    if (!guide.ok || !(await guide.text()).includes(delivery.installerSha256)) throw new Error('Notification 配置说明尚未发布或版本不匹配。');
    const response = await fetch(delivery.installerUrl, {cache:'no-store'});
    if (!response.ok) throw new Error('Notification 短版交付尚未发布或不可访问；暂不复制不可用链接。');
    const bytes = await response.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = Array.from(new Uint8Array(digest), byte=>byte.toString(16).padStart(2,'0')).join('');
    if (hash !== delivery.installerSha256) throw new Error('Notification 线上交付版本不匹配；请先发布当前版本。');
  }
  global.AiseeAiDelivery = Object.freeze({format, installer, checkPublished, preset, guideUrl});
})(typeof window === 'undefined' ? globalThis : window);
