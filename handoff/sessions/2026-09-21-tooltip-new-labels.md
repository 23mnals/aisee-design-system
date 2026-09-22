# Tooltip NEW 标签修复 · 2026-09-21

用户指出四方向示例和头像动效昨天新增，却没有 NEW。核对日期清单为 2026-09-20，导航额外要求 updated: true 而 Tooltip 漏配，详情新增区域也没有标签。

导航改为直接按现有显式更新日期判断，缺失/无效/未来日期仍不显示；Tooltip 和 Avatar hover 标题加标准标签，沿用页面日期，不因修复重新计时。原有三天有效期不变，9 月 23 日台北零点隐藏。同步 README，旧一批记录归档 CHANGELOG。

验收：update-badges 6 项测试通过，含 Tooltip 实际日期/到期及标签回归；Tooltip Demo 构建通过；git diff --check 通过。只更新门户和 Demo，未修改生产交付。基于开发分支 674efe6，本轮未提交、未推送；保留上轮滚动条改动及原有未跟踪资源。
