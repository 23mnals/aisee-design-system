# Brand 导航简化与遗留任务核对 · 2026-09-24

## 目标与完成

- 阅读 AGENTS.md、当前交接并检查分支、工作区与最近提交；初始工作区干净。
- 按用户明确要求，将 Brand 的 Common 更名 Foundations，将 AI Explorations / Inspiration 精简为 Explorations。
- 同步门户分类及中英说明、动态分类默认值、Managed Automation registry / metadata、Brand 说明、README、AGENTS 与长期团队决策。
- README 最近更新保持三批，较早的预览控制区批次移入 CHANGELOG。
- 覆盖刷新当前交接，移除重复历史过程，并保留有效行为和外部验证待办。

## 修改文件

- `aisee-design-system-preview.html`、`tests/preview.test.mjs`
- `brand/pages/index.json`、`brand/pages/managed-automation/meta.json`
- `brand/README.md`、`brand/pages/README.md`
- `README.md`、`CHANGELOG.md`、`AGENTS.md`、`docs/TEAM_DECISIONS.md`
- `handoff-context.md`、本 session。

## Git 与部署

- 分支 `ai/desktop/design-system-current`，HEAD `a866165`，本轮未 commit / push / merge，未操作 main。
- 核对 GitHub run `35846197060`：提交 a866165 的 verify、pages、Deploy to GitHub Pages 均 success（2026-09-23）。上一轮等待部署事项关闭。
- 初次沙箱内 GitHub 查询无法联网，随后只读联网查询成功。

## 验收与构建处理

- 58 项既有门户测试通过，npm run site 成功，git diff --check 通过。
- 本地浏览器确认两个分组均完整单行显示，展开和收起正常，63 pages / Brand 29 数量不变；Managed Automation 仍为 Draft，来源 ChatGPT · Web，保留原路径和灵感说明。
- site 构建附带重写 61 个交付索引文件并生成 30 个 release 目录；抽查 AutomationRunner 仅版本与 installerUrl 改变，任务未修改生产组件。为避免导航改名带入无关发布，构建产物保存在 `/tmp/aisee-build-only-cds7_4p2`，已跟踪交付输出恢复初始干净版本，新生成目录移至备份；旧 release 未删除。

## 决策与未完成

- 新名称固定为 Foundations / Explorations；页面路径、来源和 Draft / Legacy 状态不变，不新增导航层级。
- shadcn/ui 真实接入、外部 React Runner 验收、MUI / Ant / Chakra 宿主复用仍待验证。
- FeatureOverview 第二批平台图标条组件化未实施，连接弹窗暂缓。
- 下一轮按用户具体任务继续；发布本轮改名前重新检查工作区，遵循 Git 授权规则。
