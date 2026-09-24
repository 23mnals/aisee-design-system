# 组件更新发布 · 2026-09-21

## 授权与范围

用户要求发布到远端，并指出 845 个未提交文件。本轮发布通用 Confirmation Dialog、Thinking Indicator、NEW 三天规则及相关文档/统一生产交付。发布目标仅开发分支 ai/desktop/design-system-current；main 不操作。

## 工作区整合

发布前本地 HEAD d6d166b，远端 c34e5fc，ahead 1 / behind 4。实际文件比较没有丢失远端文件，多数未跟踪文件已经在远端发布。先核对远端已发布文件与本地当前文件，再将本地工作提交并合并远端历史，不使用 reset/restore/clean 或 force push。

416 个从未发布、也非当前 latest 指向的中间构建文件移入本地 artifacts/unpublished-deliveries，保留原始内容并排除出 Git。已有远端历史 release 全部保留。10 个无关原型/备用资源留在原位置，不混入发布；本地测试页面和报告继续忽略。

## 功能

- Confirmation Dialog 的通用影响卡片、内容/图标/按钮配置与真实宿主回调；独立生产交付不含业务示例与字体。
- Thinking Indicator 的圆形/无限符号变形、文字轮换扫光、compact/text-only、本地化与 reduced-motion。
- NEW 按台北日历保留三天，对应内容更新后重新计时。
- 新旧组件 Copy for AI 使用现有统一 manifest/latest 机制，生产样式完整闭包保留。

## 验收与发布跟踪

- npm run check：130 项测试、类型检查与库构建通过。
- verify:ai-deliveries：29 份生产交付独立类型检查/构建、精确文件范围、哈希、重装及冲突检查通过。
- audit:copy-ai：196 个配置案例，0 失败；npm run site 通过。
- 功能提交 665757c；合并提交 120e8e80a794725428467eb9d558ad5f59f7bf12 保留双方历史。解决重叠文件冲突后，合并树与已验收功能快照完全一致。
- 正常 push 到开发分支成功；CI / Pages run https://github.com/23mnals/aisee-design-system/actions/runs/35575034360 成功。
- 公网 Confirmation Dialog f0524f6175a927ef、Thinking Indicator 99ee5a4fe9847cba 的 latest、接入说明与安装器 SHA-256 验证通过；线上导航及 NEW 三天规则通过。
- 发布后浏览器 Copy 点击复测因工具超时未完成，没有将此项记为通过。组件本地交互验证见对应 session；跨 AI 平台业务接入待外部开发验收。
- 最终保留 10 个无关未跟踪文件；后续普通开发不自动发布。
