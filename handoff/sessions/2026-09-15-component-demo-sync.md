# 2026-09-15 Component Demo Sync

## 本轮目标

- 将 Dropdown Fluid Hover 从独立预览同步到正式 Select / Dropdown Demo。
- 补齐 Credit Bar 的双来源同时为 0 状态。
- 将误标为成功状态的 Empty State 改为“暂无报告数据”，并引导用户添加产品 URL 发起分析。
- 修正 Dropdown 行操作加号的出现时机、默认视觉、尺寸和动效卡顿。
- 把 GitHub Pages 地址写入仓库 About / Website，支持直接打开 HTML Demo。

## 本轮完成

- Dropdown React 组件与静态 Demo 使用同一套 Fluid Hover 行为：最近可用项跟随、跨间隙连续移动、键盘同步、disabled 跳过及 gap click。
- 减少重复布局测量：同一行内移动不重复更新，跨间隙计算通过 `requestAnimationFrame` 合并；高亮移动改为 170ms。
- 行操作加号改为 24px；默认隐藏，行 hover / focus-within 时以灰底灰边出现，按钮自身 hover 才变黄。
- Credit Bar 增加 Subscription 与 Top-up 同时为 0 的中性空轨道状态。
- Empty State 插图重命名为 `no-report-data.svg`；标题、说明和主操作改为 `No report data yet`、添加产品 URL 后发起分析。
- Avatar、Sidebar Navigation、组件 A–Z 排序、README / Copy for AI / NEW 标识等同一会话前序改动一并整理并通过检查。
- GitHub 仓库 About / Website 已设置为 `https://23mnals.github.io/aisee-design-system/`。

## 修改范围

- React：`src/components/Avatar.tsx`、`src/components/Dropdown.tsx`、`src/components/CreditBar.tsx`、`src/components/EmptyStateIllustration.tsx`。
- 样式：`src/styles/components.css`、`src/styles/credit-bar.css` 及相关 Demo 样式。
- Demo：`components/Select/Select.html`、`components/CreditBar/`、`components/EmptyState/`、`components/SidebarNavigation/`、`prototypes/dropdown-fluid-hover-preview.html`。
- 资源与文档：Avatar、Dropdown、Empty State、Sidebar 图标资源，README、AI handoff、团队决策、测试与门户索引。

## 验收

- `npm run check`：TypeScript、72/72 测试、完整构建通过。
- `git diff --check` 通过。
- 浏览器实际检查正式 Grouped account Dropdown：行操作按钮默认 `opacity: 0`、`pointer-events: none`、24×24px、灰底灰边；行 hover / 键盘聚焦后出现。
- 浏览器检查 Credit Bar 双 0 状态和 Empty State 暂无报告数据文案；控制台无 warning / error。

## Git / 发布

- 实现提交：`0aa220d feat: refine current component demos`。
- 目标分支：`ai/desktop/design-system-current`。
- 本轮不创建或合并 `main` PR；GitHub Pages 仍展示当前 `main` 正式版本。

## 后续

- 用户在本地拉取开发分支后复查 Dropdown 手感及各组件页面。
- 需要正式发布时，再通过 `ai/desktop/design-system-current → main` PR 同步 GitHub Pages。
