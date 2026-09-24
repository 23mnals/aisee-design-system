# NEW 三天期限 · 2026-09-21

用户要求 NEW 暂时改为 3 天，没有新内容后消失，有内容更新再显示。

共用 assets/update-badges.js 将保留窗口由 7 改为 3 个台北日历日，沿用更新当天第 1 天、第 4 天零点隐藏。每个内容按自身最新更新日期重新显示，不刷新所有组件日期，不因页面访问或构建延长期限。侧栏、README、组件详情、独立页及 Brand 继续共用规则。

README 当前规则/最近更新、CHANGELOG 和 TEAM_DECISIONS 同步。已有日期测试更新至三天边界，覆盖跨年、闰日、失效日期和更新后重新显示。

验收：node --test tests/update-badges.test.mjs 通过（5 项）；git diff --check 通过。未执行 commit/push。原分支 ai/desktop/design-system-current，HEAD d6d166b，远端跟踪 c34e5fc，原有未提交工作保留。

下一步：和当前尚未发布的 Thinking Indicator、Confirmation Dialog 一起等待用户明确发布授权后安全整合发布。
