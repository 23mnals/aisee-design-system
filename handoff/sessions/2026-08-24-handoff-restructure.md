# 交接机制重构

## 本轮目标

- 解决 `handoff-context.md` 随会话持续追加、越来越臃肿的问题。
- 建立 `AGENTS.md`、`handoff-context.md`、`docs/TEAM_DECISIONS.md`、`handoff/sessions/` 职责严格分离的交接结构。

## 本轮完成

- 将 `AGENTS.md` 重写为长期 AI 工作纪律，补入新会话读取、Git/分支、已有实现保护、Web 产物和交接更新规则。
- 将 `handoff-context.md` 从 426 行的累积日志压缩为当前状态仪表盘，不再保留过期 Git 快照和逐轮大段总结。
- 建立 `handoff/sessions/`，归档 2026-08-21 Components/Event Dialog 与 2026-08-24 Web 同步的过程记录。
- 把仍长期有效的组件、视觉、资产、Figma、Brand 与 Web 产物决策整理到 `docs/TEAM_DECISIONS.md`。
- 全程未修改任何 UI、组件实现或 Design System 代码逻辑。

## 修改文件

- `AGENTS.md`
- `handoff-context.md`
- `docs/TEAM_DECISIONS.md`
- `handoff/sessions/2026-08-21-components-event-dialog.md`
- `handoff/sessions/2026-08-24-web-sync.md`
- `handoff/sessions/2026-08-24-handoff-restructure.md`

## Git / Commit / PR

- 当前分支：`ai/desktop/design-system-current`。
- 本轮文档改动已获用户确认，并作为独立提交纳入当前开发分支。
- 没有修改或推送 `main`，没有创建或合并 PR。

## 本轮确认的设计决策

- `AGENTS.md` = 工作纪律。
- `handoff-context.md` = 当前仪表盘，覆盖更新。
- `docs/TEAM_DECISIONS.md` = 已确认且长期有效的产品与设计决策。
- `handoff/sessions/` = 历史档案，默认不在新会话批量读取。
- Git + 当前交接是项目记忆；聊天上下文不是唯一记忆来源。

## 遇到的问题及处理

- 原文件把长期规则、设计决策、当前状态和三轮历史混在一起，并用后续章节覆盖前文，存在过期状态被误读的风险。
- 迁移时按信息生命周期拆分；现有未提交的 2026-08-24 第 17 节完整归入 Web 同步 session，避免覆盖丢失。

## 未完成

- `c6ace77` 仍未同步到 `main`，属于产品发布后续，不属于本次文档结构重构范围。

## 下一轮建议

- 新会话只读 `AGENTS.md`、`handoff-context.md` 并检查 Git；有历史追溯问题时再打开对应 session。
- 以后用户要求更新交接时，新增本轮 session 并刷新当前仪表盘，不再把历史总结追加到 `handoff-context.md`。
