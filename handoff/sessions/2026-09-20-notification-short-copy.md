# Notification 短版 Copy for AI

## 用户反馈

上轮完整源码归档内嵌约 30 万字符，用户明确反馈消息无法发送。该方案已弃用，保留只试点 Notification 的范围。

## 本轮完成

- Copy for AI 改为约 1,550–1,557 字符的短提示词，包含当前配置、版本固定的公开组件交付 URL、文件 SHA-256 及接入步骤。
- 生成以安装脚本内容指纹命名的 .cjs；源码 / 样式 / 原始资源 / 字体存于下载文件，不放聊天消息。Node 执行只写目标组件目录，拒绝不同内容覆盖，保留原校验与路径保护。
- 解包附 INTEGRATION.md 和可用用例，接收 AI 无需寻找私有仓库 HTML / 文档或安装整库；用户不用额外附件操作。
- 复制前从公开 URL 读取并校验实际文件；尚未发布时不复制不可用链接。
- README、接入 / 配置 / 验证 / AI 交付文档与 Notification Usage 同步短版。

## 发布检查与状态

通过 gh api 确认现有 GitHub Pages 为公开站点 https://23mnals.github.io/aisee-design-system/。公开旧 JSON 404，新增指纹脚本浏览器校验也未发布。已准备静态站点，尚未 commit / push / 部署。AGENTS.md 第 3 节规定普通开发不自动 Git 发布，因此完成准备后需要用户授权发布 Notification 试点及必要支持文件。不要将整个脏工作区不加区分提交。

## 验证

114 项测试通过；192 配置案例通过；short prompt 4,000 字符上限检查通过；脚本 SHA-256、Current 源码比对、离线解包、损坏校验、重复安装与冲突保护通过；独立 React 类型检查和 Vite 构建通过；静态站点构建通过。浏览器实际显示“Notification 短版交付尚未发布或不可访问；暂不复制不可用链接。”

这些不等于公开安装已可用。待授权发布后，必须再验证匿名 HTTP 下载 / SHA-256、浏览器复制及真实目标项目接入。

## Git / 下一步

分支 ai/desktop/design-system-current；HEAD d6d166b，已有 1 个未推送文档提交；本轮未新增 commit。此前 Tooltip、其他组件 / 文档及未引用资产保持不动。用户授权发布后谨慎整理 Notification 试点与必要支持修改，按现有开发分支 Pages 流程发布；不触碰 main。之后让用户实测，通过再推广其他组件。
