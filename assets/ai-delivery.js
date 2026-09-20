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
  function format(delivery, configuration) {
    if (!delivery.installerUrl || !delivery.installerSha256 || !configuration) throw new Error('Notification delivery metadata is incomplete.');
    const url = new URL(delivery.installerUrl);
    if (url.origin !== 'https://23mnals.github.io' || !url.pathname.startsWith('/aisee-design-system/assets/ai-deliveries/')) throw new Error('Invalid public component source URL.');
    return `将 AISEE Notification 组件接入当前 React 项目，保留下面选定的变量。

这是单组件源码交付，无需安装整个 AISEE 库。请由你（编码 AI）自动完成以下步骤，不要让用户再下载/上传附件，也不要寻找原仓库的组件 HTML 或内部文档：
1. 在目标项目中下载下面文件到临时文件，核对文件 SHA-256 后用 Node 执行；参数为组件目标目录（按项目约定调整）。脚本只解包组件代码、样式、原始资源和字体，不安装 npm 依赖，不覆盖已有不同内容。
2. 阅读解包后的 INTEGRATION.md、index.ts 和源码，使用真实 API 与用法；从本地 index 导入 NotificationBell / NotificationPanel，入口只加载一次 styles.css。不要把下载的归档数据打印进聊天或重新手写组件。
3. 沿用现有 React 18+ / ReactDOM、TypeScript 和 CSS / SVG 资源处理；不需要 Tailwind、shadcn 或额外动效库。SSR 使用客户端边界。接入真实数据及已读/全部已读/操作回调，保留原样式与铃铛动画，并验证弹层位置、关闭和响应式。
4. 下方配置优先于示例默认值；scope 区分独立示例，slots 表示内容组合而非直接 props，previewState 不代替真实业务状态。保留目标页面结构。

下载地址：${delivery.installerUrl}
文件 SHA-256：${delivery.installerSha256}
校验通过后运行：node .aisee-notification-install.cjs src/components/aisee/notificationbell
（下载时使用 .aisee-notification-install.cjs 作为临时文件名；接入完成后删除。）

当前配置：
${JSON.stringify(configuration)}

验收：运行目标项目类型检查和构建，核对已选变量、字体/图标、未读状态、键盘与动效。若源码地址确实无法访问，报告具体下载错误，不索要私有仓库权限、不用猜测版本替代。`;
  }
  async function checkPublished(delivery) {
    const response = await fetch(delivery.installerUrl, {cache:'no-store'});
    if (!response.ok) throw new Error('Notification 短版交付尚未发布或不可访问；暂不复制不可用链接。');
    const bytes = await response.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = Array.from(new Uint8Array(digest), byte=>byte.toString(16).padStart(2,'0')).join('');
    if (hash !== delivery.installerSha256) throw new Error('Notification 线上交付版本不匹配；请先发布当前版本。');
  }
  global.AiseeAiDelivery = Object.freeze({format, installer, checkPublished});
})(typeof window === 'undefined' ? globalThis : window);
