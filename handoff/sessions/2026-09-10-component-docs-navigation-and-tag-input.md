# 2026-09-10 Component docs, navigation and Tag Input

## 本轮目标

- 对齐 Fluid Functionalism 更新标记的实际规则，并将 AISEE 的红点替换为 Figma Campaigns 风格 `NEW` 标签。
- 在 Input 试点确认后，把 640px 内容宽度与分区内容框同步到全部 Current 组件详情页。
- 补齐 Tabs 的下划线、图标加文字、纯文字与纯图标形态。
- 新增独立的 Tag Input 组件与交互文档。
- 在预览标题旁增加上一项 / 下一项快速导航与名称提示。

## 本轮完成

- 实测 Fluid Functionalism：更新点由静态组件元数据决定，点击不消失、当前页仍显示、刷新后仍保留，不使用本地已读或组件版本状态。
- AISEE 更新标记改为静态 `NEW` 胶囊，使用 Figma Campaigns 导出采样色：文字 `#82006C`、背景 `#FBD1EF`。
- `Input`、`Select / Dropdown`、`Toggle`、`Tag Input`、`Tabs`、`Sidebar Navigation`、`Badge` 标记为更新项。
- `Tag` 保留为 Legacy；`Badge` 成为 Current，并保留 `Badge — Legacy` 历史入口。
- Tabs 新增 segmented API 与 icon-text / text / icon 三种组合，同时保留下划线版本；另加入 Figma 平台 Logo + 文字组合。
- Sidebar Navigation 升级为 Current：文档示例覆盖 hover、selected、单项展开收起和整栏展开收起；新增数据驱动、可复用的 React API，而非一次性静态结构。
- 新增 `TagInput` React 组件：输入时虚线预览，Enter / Add 提交，空输入 Backspace 删除最后一项，标签支持单独删除。
- 17 个 Current 组件详情页接入共享 `components/component-doc-layout.css`：内容区 640px、居中、所有主要内容分区有框、窄屏响应式换行；Legacy 不套用。
- 组件内页 640px 标题区右侧新增左右箭头，按侧边栏完整顺序切换；按钮使用 Fluid 风格 32×32 无描边按钮、16×16 图标，hover/focus 显示相邻页面名称，首尾方向禁用；Portal 将它注入 iframe 的组件标题区，所以会随标题滚动并为描述预留空间。
- Tabs hover 按形态拆分：下划线型只把文字变为 100% `#111111`，segmented 使用 `rgba(17,17,17,.04)` 填充并把文字变为 100%；disabled 不响应。
- 新增隔离的 `components/Tabs/TabsMotionPreview.html`：用共享选中面实现 segmented 宽度形变滑动，用共享指示线实现 underline 连续位移，同时加入轻量内容过渡和 reduced-motion；没有注册进正式 Tabs Demo。
- Sidebar Navigation 示例改为真实应用壳：左侧导航与右侧内容区同时呈现；Overview 是唯一叶子，其他父项均可独立展开。整栏收起后所有区域显示原生 `col-resize` 光标，父级图标可打开带子功能的 flyout；React 组件也同步该交互。
- Tag Input 的 Add 按钮恢复 `+`，并确保 `+` 继承按钮文字颜色；Tabs 的 Substack 资源改为与其余平台一致的圆形彩色 Logo。
- 查明当前 Card 文档的 Default / Elevated 样式来自 `7895565 feat: complete current components and semantic color system` 中的通用示例，不是用户提供的 Figma `10374:435175`。
- 更新 `docs/TEAM_DECISIONS.md`、`docs/aisee-dapp-design.v6.md` 与回归测试。

## 修改文件

- Portal：`aisee-design-system-preview.html`
- 组件源码：`src/components/Tabs.tsx`、`src/components/SidebarNavigation.tsx`、`src/components/TagInput.tsx`、`src/components/Badge.tsx`、`src/components/Toggle.tsx`、`src/styles/components.css`、`src/index.ts`
- 组件文档：`components/TagInput/TagInput.html`、`components/Tabs/Tabs.html`、`components/Badge/Badge.html`、`components/Toggle/Toggle.html`、`components/Input/Input.html` 及其他 Current 详情页
- 共享布局：`components/component-doc-layout.css`
- 资产：`assets/tag-input/`、`assets/tabs/`、`assets/sidebar-v6/`
- Legacy：`components/Tag/Tag.html`、`legacy/pages/Badge Legacy.html`
- 规范与测试：`docs/TEAM_DECISIONS.md`、`docs/aisee-dapp-design.v6.md`、`tests/preview.test.mjs`

## 验收

- `npm run check` 通过：tokens、TypeScript、48 项测试、package build 全部通过。
- `git diff --check` 通过。
- 本地浏览器已验证 Tag Input `+`、Tabs 五种样式与圆形 Substack Logo、32×32 标题箭头位置、侧边栏展开 / 收起和收起后的图标 flyout；Tabs 动效研究页已单独打开。

## Git / 发布状态

- 当前分支：`ai/desktop/design-system-current`。
- 当前 HEAD：`3a97eff docs: record Figma sync and checkpoint audit`，与 `origin/ai/desktop/design-system-current` 一致。
- 本轮修改尚未 commit、尚未 push，未修改 `main`。
- 本地与远端 `ai/desktop/design-system-checkpoint` 已不存在；剩余本地分支为 `main`、`ai/desktop/design-system-current`，剩余远端分支为 `origin/main`、`origin/ai/desktop/design-system-current`。

## 下一步

- 等用户确认 Tabs 隔离动效预览，并决定是否用 Figma `10374:435175` 替换当前无设计依据的通用 Card 示例；按反馈微调后再由用户明确决定是否 commit / push。
- 正式发布仍通过 `ai/desktop/design-system-current → main` PR，除非用户同时明确要求，否则不自动 merge。
