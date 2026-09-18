# Notification 独立发布 · 2026-09-17

## 授权与范围

- 用户确认 Notification 无问题，并明确要求单独发布推送到远端。
- 从 HEAD ae7b45e 构造独立发布快照，仅包含 Notification React 组件、Demo、引用的 SVG 资源、铃铛快照、共享样式、组件导出、门户入口 / Copy for AI、Overview、对应测试和文档。
- 共享 CSS 的生成文件均来自独立快照构建；不包含 Tree Nav 行操作等未确认源码。
- Sidebar / Select / Webapp 数据、NEW 七天逻辑、Toggle 正式 Dropdown 等其余内容继续保留本地。Notification HTML 暂不引用尚未发布的 NEW 脚本。

## 验证

- 独立快照 npm run check：tokens、TypeScript、75 项测试及全部构建通过。
- 修正 Notification 空状态 SVG 为标准资源导入，消除 CommonJS import.meta 警告；CJS 包可加载并导出三个 Notification 组件。
- 静态站点构建通过；浏览器验证已读清零、Reset demo 恢复 4 条未读并播放铃铛 ring / 徽章 badge-in，图片无缺失。

## 发布方式

- 目标 ai/desktop/design-system-current；不操作 main、不创建或合并 PR。
- 本提交创建后推送到开发分支，由 CI 检查通过后部署 GitHub Pages。推送与部署最终结果记录于本地当前交接。
- 当前 GitHub Pages 地址：https://23mnals.github.io/aisee-design-system/

## 最终结果

- 提交：25c8f9f4cb00dc8d12a39603d8df718a8af00203，已推送至 origin/ai/desktop/design-system-current，本地与远端跟踪引用一致。
- 初次推送网络慢速超时，第二次 github.com:443 连接超时；系统 DNS 解析 20.205.243.166 无法连接。独立 DNS 查询返回 140.82.112.4，单次 git http.curloptResolve 覆盖解析后成功，未修改系统 / 仓库配置，未关闭 TLS 校验。
- CI 与 Pages 部署成功：https://github.com/23mnals/aisee-design-system/actions/runs/35199372927 。另一 pull-request CI run 35199377173 也通过；没有本轮创建或合并 PR。
- 9 个生成 CSS 经对比确认仅新增 Notification 样式；提交过程未覆盖其他原有工作区文件。唯一必要源码调整是 Notification 空状态资源导入的 CommonJS 兼容修正。
- 本地发布快照浏览器验收通过；线上页面浏览器访问超时，部署成功依据为 GitHub Actions 的 Pages 成功状态。
- Notification HTML 当前残余差异只有未发布 NEW 脚本引用；未使用备用资产继续留本地。最终结果与当前交接更新保留本地，未为此额外触发一次发布。
