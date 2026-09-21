# 2026-09-20 第三方接入与依赖交付

## 目标与完成
用户反馈未安装库时 Copy for AI 生成的 import 无法解析，要求团队及所有第三方的用法、前置准备、问题处理清楚可执行。

- 全部 28 个 Copy for AI 入口增加同一套接入规则：先检查项目和已安装导出，缺包时交付并安装 tgz 或完整源码；保留所选变量，禁止臆造可用 npm 包。
- 新增第三方指南，覆盖 React 环境、CSS / 类型、资源、源码递归依赖、非 React / SSR、常见错误、版本 / CI 和交付清单；根 README、门户 README、AI_HANDOFF、COMPONENT_CONFIGURATION 同步。
- 新增本地打包与独立消费项目检查命令。tgz 附来源 commit、dirty 状态和 SHA-256；包不入 Git，不发布 npm。
- 打包遇到本机 npm 缓存权限问题，改用独立临时缓存，未修改系统缓存权限。修正带空格目录的 URL 路径转换。独立试装发现 CSS 类型声明需求，已写入指南。

## 验证
- npm test：113 / 113。
- npm run audit:copy-ai：28 入口、192 案例，0 失败。
- 包构建和静态站点构建通过；浏览器看到门户 README 的接入指南入口。
- 实际本地 tgz 安装到独立临时 React 项目，公开类型检查、Vite 生产构建、CSS 与字体内嵌资源检查通过。离线使用已有 React/tooling，不代表所有 React 版本、SSR、非 React 或外部 AI 已验收。

## 文件
核心为 docs/GETTING_STARTED.md、scripts/pack-local.mjs、scripts/verify-local-package.mjs、package.json、aisee-design-system-preview.html；相关 README、CHANGELOG、AI 交付 / 配置 / 验收文档和测试同步。此前 Tooltip 改动和无关本地资产完整保留。

## Git 与后续
分支 ai/desktop/design-system-current；HEAD d6d166b，本地领先远端 1 个此前文档提交。本轮未 commit / push / publish，main 未修改。包为 1.0.0 + dirty 工作区快照，正式分发需要独立可追踪版本和授权范围。第三方仍需取得包或源码；不把预览权限等同分发授权。
