# AISEE Design System AI 工作纪律

本文件只保存长期、稳定、跨会话都必须遵守的工作规则。项目当前状态看 [`handoff-context.md`](handoff-context.md)，长期产品与设计决策看 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md)，历史过程按需查阅 [`handoff/sessions/`](handoff/sessions/)。

## 1. 新会话读取与检查

新 Codex 对话不是新项目。默认只需先读取：

1. `AGENTS.md`
2. `handoff-context.md`

随后必须检查：

```bash
git branch --show-current
git status --short --branch
git log -5 --oneline --decorate
```

开始修改前，再打开与当前任务直接相关的已有文件，确认仓库中的当前实现。

只有遇到“为什么以前这样设计”“之前某次任务具体做过什么”等历史问题时，才去 `handoff/sessions/` 查对应 session；不要在每次新会话开始时读取全部历史 session。

## 2. 项目连续性与已有实现保护

- 新对话只代表聊天上下文重新开始，不代表项目重新开始。
- 不重新设计、重建或平行实现已经存在的 UI、组件、交互和视觉。
- 不用 `main`、Legacy 或历史文件中的旧版本覆盖当前新版实现。
- 能增量修改时不无理由整页重写，不因实现复杂而删除已有交互、状态、动画或视觉细节。
- 未经用户明确要求，不新增页面、状态、模块、字段、交互或视觉元素，不自行改变已确认的产品方向。
- 不执行会丢失现有工作的 `reset`、`restore`、`clean` 或 force push；先保护 staged、unstaged、untracked 以及其他协作者的修改。
- 不删除尚未获得用户明确确认的 Legacy 文件或资产。
- 不修改或把 AISEE Design System 内容推入 `stemui` 仓库；这里只消费已经确认的图标或资源。
- 文件多、范围大、上下文长或历史复杂都不是停止任务的理由；应拆成安全步骤、逐步验证并继续完成。

如果不清楚现有方案的原因，按以下顺序查证：当前代码 → `handoff-context.md` → Git commit/diff → `docs/TEAM_DECISIONS.md` 与相关设计文档/Figma → 对应 session → 询问用户。不得凭聊天记忆猜测。

## 3. Git 与协作分支

- `main` 是正式、稳定、已经确认并供团队查看的版本，不直接在 `main` 做普通开发。
- 当前统一开发分支为 `ai/desktop/design-system-current`。
- Web ChatGPT 与 Desktop Codex 共用 `ai/desktop/design-system-current`，不要长期维护两套 Design System 状态。
- 开始工作及 commit/push 前都要重新检查 branch、`git status`、diff、最近 commits，以及能运行的测试、构建和实际预览。
- 一个独立任务尽量对应一个明确 commit，不把无关或未确认的修改混入同一提交。
- 一般情况下不自动执行 commit、push、merge、PR、删除分支或其他 Git 发布动作；但“Web ChatGPT 设计产物同步到 AISEE Design System”以及用户明确要求同步到 `main` 时，适用本文件规定的授权例外。
- Web 产物成功 push 后，必须提醒用户在本地检查工作区并 pull 最新开发分支。
- `main` 不允许自动发布，也不直接 push；正式同步统一通过 `ai/desktop/design-system-current → main` PR。
- 当用户明确说“发布正式版”“同步到 main”“这版可以进 main”或同等明确意思时，视为授权创建上述 PR，无需再次确认。
- PR 不自动 merge；只有用户同时明确要求合并时，才视为授权执行 merge。
- 以下操作无论如何都禁止自动执行：删除分支、force push，以及删除用户未明确要求删除的已有产物。

## 4. Web 设计产物契约

- Web 产物默认 `source: "ChatGPT"`、`surface: "Web"`、`designStatus: "Draft"`。
- `designStatus` 只允许 `Draft` 或 `Selected`。
- 用户未明确确认前，AI 不得自行把 `Draft` 改为 `Selected`。
- 每个 Web 产物必须包含 HTML 和 `meta.json`；PNG 预览可选。
- 已有 Figma、设计文档、截图、token 或用户确认规则时，按现有依据实现，不用默认方案补齐缺失设计。

### Web ChatGPT 设计产物自动同步

当用户明确要求将 Web ChatGPT 设计产物“同步到 Design System”“加入 Design System”“保存到 Brand”“提交这个产物”，或表达同等明确的同步/入库意图时，视为已经授权本次产物执行以下动作，无需在 commit 或 push 前再次询问确认：

1. 保存产物文件。
2. 更新 `meta.json`。
3. 更新 Brand registry。
4. 创建 commit。
5. push 到 `ai/desktop/design-system-current`。

同步规则：

- Web ChatGPT 新生成的产物在用户提出上述意图后，默认直接进入 `ai/desktop/design-system-current`。
- AI 不判断产物是否“足够好”才允许入库；用户在本地 Demo 中自行筛选。
- 所有新 Web 产物默认使用：`source: "ChatGPT"`、`surface: "Web"`、`designStatus: "Draft"`。
- 只有用户明确表示“这个版本还不错”“这个版本保留”“这个方向可以”或同等明确意思时，才允许将 `Draft` 改为 `Selected`。
- AI 不得自行将 `Draft` 改为 `Selected`。

### Web 产物文件规则

标准目录为：

```text
brand/pages/<feature-slug>/
```

必需文件：

- `preview.html`
- `meta.json`

可选文件：

- `preview.png`

PNG 不是同步、注册或 Demo 展示的必要条件。如果没有与当前 HTML 对应的 PNG：

- 正常同步 HTML。
- 正常注册到 Brand。
- registry 中不写 `image` 字段。
- 不阻止 commit / push。
- 不使用其他版本 PNG 冒充。
- 不自动生成截图，除非用户明确要求。

### Brand 注册规则

- 每个 Web 产物必须注册到 Brand 对应的 AISEE 功能分类。
- 例如 `brand/pages/managed-automation/` 在 UI 中显示为：

  ```text
  Brand
  └── Automation
      └── Managed Automation
  ```

- 文件来源通过 metadata 区分 Web / ChatGPT，但不得增加 Web 或 ChatGPT 一级或二级导航。

### Web 产物 push 提醒

Web 产物成功 push 后，回复中必须明确包含：

> 已推送到 ai/desktop/design-system-current。请在本地 AISEE Design System 工作区先检查 git status；如果工作区干净，再 pull 最新开发分支并刷新本地 Demo 查看。

如果 push 失败，不得声称同步成功。

### Web 产物删除规则

如果用户明确表示某个 Draft 不需要：

1. 删除对应 `brand/pages/<feature-slug>/` 产物。
2. 删除 registry 中对应入口。
3. 单独创建 commit 并 push 到 `ai/desktop/design-system-current`。

Git 历史本身作为历史记录，不需要继续在 Design System 导航中保留被淘汰的 Draft。除上述用户明确删除场景外，不得删除已有 Web 产物。

## 5. 交接文档维护

每轮较完整的 Codex 对话结束，或用户要求“更新交接文档”时，必须同时执行：

1. 新增 `handoff/sessions/YYYY-MM-DD-<topic>.md`，记录本轮完整工作。
2. 刷新 `handoff-context.md`，覆盖为项目此刻仍对下一轮有用的当前状态。

禁止把本轮大段总结继续追加到 `handoff-context.md` 末尾。已经完成或过期的过程内容应从当前状态中移除；长期工作纪律写在本文件，已确认的长期产品与设计决策写入 `docs/TEAM_DECISIONS.md`。

每个 session 按需包含：本轮目标、本轮完成、修改文件、Git / Commit / PR、本轮确认的设计决策、遇到的问题及处理、未完成、下一轮建议。Session 是历史档案，不是新会话的默认必读资料。

更新当前交接时至少同步：当前 branch、最新关键 commit、工作区状态、正在做、最近完成、关键决策、未完成、下一步，以及最近一次 session 链接。

阶段结束、长时间中断或首次出现上下文压缩提示时，也按上述两个动作更新交接。标准指令为：

> 更新本轮交接：新增一个 `handoff/sessions/` session 记录本轮完整工作，并刷新 `handoff-context.md` 的当前状态。不要向 `handoff-context.md` 末尾继续追加历史总结；已经完成或过期的过程内容从当前状态中移除。同步记录当前 branch、最新 commit、未完成事项和下一步。

核心原则：`AGENTS.md` = 工作纪律；`handoff-context.md` = 当前仪表盘；`docs/TEAM_DECISIONS.md` = 长期决策；`handoff/sessions/` = 历史档案。Git + 当前交接才是项目记忆，聊天上下文不是唯一记忆来源。
