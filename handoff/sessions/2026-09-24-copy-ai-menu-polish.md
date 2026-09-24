# Copy for AI 单行工具栏与选项菜单

## 目标与完成

用户反馈上一版 Copy for AI 原生下拉、变体长参数和重复状态堆成三行，视觉粗糙。本轮在已有两模式功能上增量修正展示。

- 工具栏改为与 Open HTML 对齐的单行浅绿分体按钮；主复制按钮内持续显示 Apply design / Motion only，箭头打开统一白色选项菜单。
- 菜单分别显示 Copy mode 与 Target variant；模式附简短说明，Toggle 变体以 Lime · Light · 16 px 等可读摘要展示。
- 默认无变体，只有明确选择 Use current preview 才附加；预览变化、组件切换的清除规则保留。
- 成功显示 Copied、当前模式与 toast；读屏状态保留。支持方向键、Esc 返回焦点、点击外部关闭。
- Toggle 的长接入说明精简成一句与 Integration guide 链接。
- 提示词生成器、两份完整复制文本、业务保护范围、组件生产源码与交付 payload 均未在本轮改动。

## 修改文件

- `aisee-design-system-preview.html`：工具栏结构与局部菜单样式。
- `assets/copy-ai-controls.js`：菜单状态、显式选择和键盘交互。
- `components/Toggle/Toggle.html`：精简说明。
- `tests/copy-ai-controls.test.mjs`：菜单操作与显式变体回归检查。
- `docs/TOGGLE_COPY_AI.md`、`docs/COMPONENT_CONFIGURATION.md`：更新入口描述，完整复制文本不变。
- `README.md`、`CHANGELOG.md`：最近更新与历史归档。
- `handoff-context.md` 与本 session：当前交接。

## 验证

- 75 项配置/门户/复制控制器测试通过。
- 静态站点构建与 git diff --check 通过。
- 真实浏览器检查收起/展开视觉、动效模式切换与复制成功、显式变体选择、方向键打开、Esc 关闭并返回焦点。桌面 1280px 视口菜单未截断，工具栏保持单行。
- 本轮不声称已验证外部 AI 实际接入效果；提示词范围检查沿用此前两模式测试。

## Git、未完成与下一步

分支 `ai/desktop/design-system-current`，HEAD/origin `9d022e3`。保留本轮开始时全部未提交工作；本轮未 commit、push 或修改 main。线上仍为此前发布版本，本地 4173 可预览。后续按用户反馈继续验收视觉，并在另一个项目使用本地生成的新提示词验证组件范围。真实测试项目的业务改动收敛仍未执行，参见当前交接。
