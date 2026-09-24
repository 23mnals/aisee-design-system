# 统一生产交付发布 · 2026-09-21

## 目标与授权

用户要求“发布新版，我要复制给外部开发使用”。本批发布所有已登记组件的统一 Copy for AI 机制到开发分支和现有 GitHub Pages；未授权 main 合并。

## 发布范围

- 显式生产清单、依赖验证、完整 CSS AST 依赖闭包、通用短提示词、稳定 latest 和不可变 release、逐组件 compatibility。
- NotificationBell 精简生产交付，保留真实数据驱动的铃铛/徽章动效，排除通知面板及演示资源。
- 当前清单依赖的 Tooltip 智能定位、弹簧交互及对应 Demo/构建同步，避免交付与页面不一致。
- 安装/使用/验收/长期规则文档、README/Overview/更新标记与 CI 同步。
- 保留旧公开交付历史；不发布本地 prototypes、验收产物、无关未跟踪图片或 node_modules。

## 验证

独立发布目录基于远端 dbaabd1；124 项测试、类型检查、构建、28 份独立 React 生产交付验证、192 个配置案例及静态站点构建通过。当前版本目录与原工作区生成结果一致。CSS 缺失依赖会使构建失败。外部 AI 真实项目最终产出仍需开发验收。

## Git 与部署

原工作区保留，独立目录创建发布提交后非强制快进到 ai/desktop/design-system-current。Git HTTPS 低速超时，必要时使用 GitHub Git Data API 并校验 tree/commit；发布前重新核对远端父提交。推送触发 CI 与 Pages，最终结果记录于原工作区当前交接；main 不变，不创建 PR。

## 公网验收发现并修复跨平台版本差异

首轮发布 a9045c0 的 CI/Pages 成功，但公网清单与 Mac 本地版本不同。解压后源码完全一致，差异仅为 gzip OS header：Linux=3、macOS=19。构建器现在统一为 RFC 1952 的 OS=255，并加入逐组件归档重建一致性回归检查；125 项测试、28 份独立交付验证通过。修复后再次发布并核对公网版本、说明和安装器 SHA-256，避免本地复制因平台差异被误拦截。

## 最终发布与公网验收

- 机制发布提交 a9045c028f8375bc0df890810a3861c80e33796d；跨平台修复提交 c34e5fcb618c728b9f7885d7b5febb7926f0789a。GitHub Git Data API tree/commit 校验一致，force=false 快进开发分支，main 未操作。
- 最终 push CI / Pages run 35568475082 均 success。125 项测试、28 份独立交付、192 配置案例通过。
- 匿名公网验证全部 28 个 latest、ready 与 installer SHA-256 通过，公网目录与本地生成目录完全一致。NotificationBell 从公开安装器安装仅 4 文件（NotificationBell.tsx、styles.css、index.ts、styles.css.d.ts）。
- 真实 AiseeAiDelivery.checkPublished / format 调用公开地址通过；NotificationPanel 演示开关与 Bell 演示 dot 选择不进入生产复制指令，输出一句话与稳定 latest 地址。
- 浏览器工具两次超时，本轮没有完成实际按钮点击复测；没有把解析器测试冒充浏览器点击验收。
- 原工作区 HEAD d6d166b 保留，远端跟踪 c34e5fc，ahead 1 / behind 4；原工作区 staged 为空，既有文件没有 reset/restore/覆盖。发布使用独立工作区。
- 外部开发可从线上新版重新复制并在真实业务项目验收；跨 AI 最终产出仍未测试。
