# Notification Copy for AI 单次复制试点

## 目标与范围

用户指出旧提示词要求接收方访问内部组件 HTML / 配置文档，导致第三方无法接入。参考 Fluid Functionalism 的明确安装路径，以及用户提供的 AnimatedTooltip / React Bits 完整源码提示词。用户最终要求只先做 Notification，真实接入验证后再推广。

## 完成

- Notification 的复制入口内嵌实际封装组件、样式、tokens、原始图标、空状态插图、Karla 字体、当前配置、真实 API 与接入示例。
- 用户仅复制、粘贴；取消曾考虑的自动下载 JSON / 另传附件方案。JSON 是站点内部构建资源，不是用户交付操作。
- 接收方编码 AI 按提示词提取内嵌 Node 脚本、解包到产品本地目录并接入；不需要安装整库、公共 npm 包、远程下载或原仓库权限。
- 脚本使用 Node 内置模块、SHA-256 校验、路径 / symlink 约束与冲突保护。相同源码重复执行安全，不覆盖修改过的文件。
- Notification 样式从 Current 共享样式中准确抽取相应完整区段、关键帧及 reduced-motion 覆盖；保留 tokens、基础字体和所有真实资源。
- 示例实现开关面板、切换 All / Unread、单条已读、全部已读、Escape / 外部点击关闭；业务数据接口仍由产品接入。
- 其他 27 个入口未启用源码内嵌；README、接入 / 交付 / 配置 / 验证说明明确试点范围。

## 文件

核心：assets/ai-delivery.js、scripts/build-ai-deliveries.mjs、scripts/ai-delivery-examples.mjs、scripts/verify-ai-deliveries.mjs、assets/ai-deliveries/NotificationBell.json 与 manifest.json、门户复制函数。同步组件 Usage、README、接入文档、配置测试与 CI。

## 验证

- npm run verify:ai-deliveries：从实际格式化提示词抽取脚本，无外部源码附件，在独立临时 React 项目离线解包；逐文件比对 Current TSX；重复执行、冲突保护、损坏校验、类型检查和 Vite 构建通过。
- npm test：113 项通过。npm run audit:copy-ai：28 组件 / 192 受控配置案例通过。报告省略归档数据但保留指纹，实际剪贴板包含完整数据。
- npm run typecheck、npm run site、git diff --check 通过。
- 浏览器 Notification 页面切换 dot，再点击 Copy for AI，出现 Copied 和完整源码复制成功提示。工具虚拟剪贴板读回为空，不能据此证明系统剪贴板字节；实际处理函数由测试核验。

## 限制 / 待验收

交付 JSON 约 311 KB，复制提示词也较长，主要是原始字体及空状态插图。尚未在外部编码 AI 验证大体积粘贴、执行脚本和最终视觉一致性。接收平台截断时校验失败；不得猜测补齐或以原仓库缺权限为由回到旧阻塞。
用户实测前不推广到其余组件。不声称适用全部框架；当前离线验证为已有 React + TypeScript/Vite。

## Git

分支 ai/desktop/design-system-current；HEAD d6d166b，已有 1 个未推送文档提交。本轮没有 commit / push / 部署。工作区继续保留此前 Tooltip / 文档 / 打包更新与未引用 Notification 备用素材、prototypes；未覆盖或删除他人工作。

## 下一步

用户在真实产品项目粘贴 Notification 内容并反馈安装、样式、选择、交互结果。验证通过后再推广同样规则到其他组件；若遇到平台长度限制，应优化实际交付通道，不能要求用户多传附件作为默认流程。
