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

本地 npm run check、独立生产交付验证、Copy for AI 配置审计与站点构建均在发布前重跑；CI/Pages 及公网验收结果在当前交接记录。最终发布结果以远端提交和工作流状态为准。
