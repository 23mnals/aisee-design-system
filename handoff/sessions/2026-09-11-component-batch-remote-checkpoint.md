# 2026-09-11 组件批次远端检查点

## 本轮目标

- 完成并提交组件文档、Tabs 动效与相关通用组件更新。
- 根据用户最新指令，将 Sidebar Navigation 新版完整排除在远端提交之外，等待单独确认。

## 本轮完成

- 将 Current 组件详情页统一到 640px 内容框布局。
- 完成静态 `NEW` 标记规则、内容级 `NEW`、标题上一项 / 下一项导航。
- 完成 Badge、Tag Input、Toggle、Tabs、Dropdown 字号和多项组件文档更新。
- 将确认后的 Tabs segmented 回弹同步到正式 Demo 与 React 组件。
- 为 Sidebar 本地方案新增无中线的方向 cursor、`Open sidebar` / `Close sidebar` tooltip、收起 rail 点击展开与 icon flyout 共存逻辑。
- 实际浏览器验证 Sidebar 本地方案：展开宽度 224px、收起宽度 56px；收起态计算 cursor 指向 `sidebar-cursor-expand.svg`，Analysis 图标可打开三项 flyout，顶部按钮可重新展开。

## Git / Commit / Push

- 分支：`ai/desktop/design-system-current`。
- 功能提交：`d475f36 feat: refresh component docs and tab interactions`。
- 远端：本轮提交与交接记录推送到 `origin/ai/desktop/design-system-current`。
- 未创建 PR，未修改 `main`。
- Sidebar Navigation 新版文件、共享文件中的 Sidebar hunks、测试与资产均未纳入提交。

## 验证

- 对实际工作区（含本地 Sidebar）执行 `npm test`：49/49 通过。
- 对仅包含远端提交内容的独立 index 快照执行 `npm test`：48/48 通过。
- index 快照执行 `npm run build` 成功。
- `git diff --check --cached` 通过。

## 本轮确认的设计决策

- Sidebar 的方向光标不使用带中间竖线的 `col-resize` 造型。
- 关闭方向为左侧高亮、右侧低透明度；打开方向相反。
- 展开态按钮 tooltip 为 `Close sidebar`，收起态为 `Open sidebar`。
- Sidebar 新版必须等待用户确认后再提交，当前远端继续保留 Legacy 状态。

## 未完成 / 下一步

- 等待用户确认 Sidebar 视觉与交互，再单独提交并推送。
- 后续处理 Figma `10374:435175` Card 业务变体与 Legacy Plugin Entry Options 空白问题。
