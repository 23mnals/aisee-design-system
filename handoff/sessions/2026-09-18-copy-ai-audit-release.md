# Copy for AI 批量检查与开发版本提交

日期：2026-09-18

## 用户目标与授权

用户担心 Copy for AI 生成结果不符合预期，询问批量验证方式，并明确授权提交一个版本到远端。保存当前设计系统到开发分支，不同步 main。

## 完成

- 增加 `npm run audit:copy-ai`，使用门户实际 prompt builder、统一配置读取器及 React Demo 当前配置表达式，运行受控状态案例。
- 28 个入口、190 个配置案例；检查入口覆盖、对应文件、公开 TypeScript props、复制处理函数与旧 iframe / 缺失配置防护。
- 输出 HTML / JSON 报告及 CSV 验收表；浏览器交互与实际 AI 产出保持 NOT RUN，不误报通过。
- CI 执行批量检查并上传 `copy-ai-audit` artifact；生成报告不入 Git。
- README 增加命令、入口与检查边界；`docs/COPY_AI_VALIDATION.md` 说明配置、浏览器、AI 产出三层验证和固定模型 / 视口的复测流程。
- 本轮一并保存之前用户迭代的组件变量、Sidebar / PlanCard / FeatureOverview / Card / Segmented Choice / Select / Button 等更新及文档、资源、生成文件。

## 验证

- `npm run audit:copy-ai`：28 组件、190 案例、0 失败。
- `npm run check`：类型检查、104 项测试、完整组件与包构建通过。
- `npm run site`：静态站点构建通过；构建器按既有规则移除 Pages 产物中的 3 个 dangling symlink，不删除源文件。
- 浏览器成功打开审查报告；不声称已经跑完 190 个真实浏览器交互或其他 AI 实际生成任务。
- `git diff --check`、暂存 diff 检查通过。

## Git / 文件范围

- 分支：`ai/desktop/design-system-current`。
- 功能提交：`2a9d63a feat: publish component variants and Copy for AI configuration audit`，195 个文件；已成功 push 到同名 origin 分支。父提交 `25c8f9f`。
- 新增主要文件：`scripts/audit-copy-ai.mjs`、`docs/COPY_AI_VALIDATION.md`；修改 package 脚本、CI、README 与忽略规则；本次交接单独文档提交。功能版本成功 push 后，文档提交的普通 / HTTP/1.1 push 连续网络超时，文档提交暂留本地，等待网络恢复重试；功能、README、审查工具均已在远端。
- 未引用的 Notification 备用 SVG / PNG、`prototypes/assets/`、dialog / notification 动效实验 HTML 保留本地未提交。用户在提交前已获说明。
- 未修改 main，未创建 PR，未执行 merge。
- 网络沙箱最初无法解析 github.com；在用户已授权发布的前提下申请联网执行 git push，成功。远端 CI / Pages 状态独立核实：功能提交的 run `35333320666` 中 verify 与 pages 均成功，审查报告 artifact 已上传。

## 未完成 / 后续

- 真实 AI 生成、截图对比与人工视觉 / 交互验收尚未执行。每个 AI 模型的结果不能仅凭复制配置正确就保证一致。
- CSV 每次生成会覆盖，已填写的验收结果另存。
- 后续新增变量时同步配置协议和 audit 案例；当前 coverage 是代表性组合，不声称穷尽所有参数笛卡尔积。
- 产品统一布局、Sidebar 层级方向和其他组件视觉验收按当前交接继续处理。
