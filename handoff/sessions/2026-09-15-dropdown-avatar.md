# 2026-09-15 Dropdown 自定义选择器与 Avatar

## 本轮目标

- 将 Dropdown Variant Playground 的 Composition 原生选择框替换为项目自定义下拉样式，并使用 Sidebar 同款箭头图标。
- 核对 Figma `38:208828` 的复杂 Filter 是否已被现有 Dropdown 覆盖。
- 在 Brand / Common 新增 Figma `98:180630` Avatar 规范页。

## 本轮完成

- Composition 控件已改为自定义 button + listbox，复用 `line_chevron-up.svg`，支持鼠标、Escape、方向键、Home、End、Enter 与 Space。
- 核对复杂 Filter：现有 Variant Playground 仅覆盖简化版 Status / Difficulty 筛选，没有完整覆盖 Keyword match、Accounts、Subreddits、Score、Time、Intents。
- 从 Figma 下载并保存 22 个方形网站账号头像与 24 个圆形社交兜底头像的原始 SVG 集合。
- 新建 Common / Avatar 页面并注册到主导航，明确两套头像的触发场景和不可混用规则；站点变为 56 页、Brand 30 项。
- 将 Dropdown 自定义选择器和 Avatar 使用规则记录到 `docs/TEAM_DECISIONS.md`。

## 修改文件

- `components/Select/Select.html`
- `preview/avatar.html`
- `assets/avatar/dapp-avatar-set.svg`
- `assets/avatar/social-avatar-set.svg`
- `aisee-design-system-preview.html`
- `brand/common-doc-layout.js`
- `docs/TEAM_DECISIONS.md`
- `tests/preview.test.mjs`
- `handoff-context.md`

## 验收

- 本地 Demo 已实际打开 Composition 菜单，确认自定义菜单、线性箭头和展开状态正常。
- 本地 Demo 已打开 Brand / Common / Avatar，确认 22 个方形头像与 24 个圆形头像均正确裁切显示。
- `npm run check` 通过：69/69 测试、TypeScript、token 检查与完整构建。
- `git diff --check` 通过。

## Git / 发布

- 当前分支：`ai/desktop/design-system-current`。
- HEAD：`ce091cc docs: record component prompt sync`。
- 本轮与此前工作区改动仍未 commit、未 push、未创建 PR、未同步 `main`。

## 未完成 / 下一步

- 等待用户确认 Dropdown 自定义 Composition 控件与 Avatar 页面视觉。
- 等待用户决定是否将 Figma `38:208828` 的完整复杂 Filter 补入 Dropdown Variant Playground。
- Card 业务变体 Figma `10374:435175` 尚未实现。
- Plugin Entry Options 三个 Legacy Engage 内嵌页面仍引用不存在的 JSX 路径。
