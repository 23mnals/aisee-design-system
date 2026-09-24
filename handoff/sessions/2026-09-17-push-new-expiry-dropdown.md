# 推送重试、待办梳理、NEW 有效期与 Dropdown 替换

## 用户要求与结果

1. 继续推送：成功将 `549782a`（Toggle 变量、下拉触发框间距、Engage 图标）及 `ae7b45e`（交接）推送至 `origin/ai/desktop/design-system-current`。本地 HEAD 与远端跟踪引用同为 `ae7b45e1dedcd9ce1d422dadba6d916220d4423d`。
2. 梳理待办：Sidebar 初始 Summary 选中与 Signal Feed 内容标题不一致、组件页与 Webapp Growth / Engage 层级不一致；Notification、Select / Dropdown 仍待验收，相关 Tree Nav 行操作等原有本地内容未发布。
3. NEW 原先仅判断 `updated: true`，不存在日期过期。本轮已补齐，保留本地待验收。
4. Toggle 原先仍使用原生 select，仅替换箭头。本轮已改为复用真实 React Dropdown，菜单与触发框完整同源，保留本地待验收。

## NEW 规则与实现

- `assets/update-badges.js` 统一维护真实内容更新日期（YYYY-MM-DD），首批日期按 Git / 当前交接对应内容记录迁移；不会随构建或浏览重置。
- Asia/Taipei 日历日期，更新当天是第 1 天，保留到第 7 天结束，第 8 天零点隐藏。示例：9/17 更新，9/24 零点隐藏。
- 缺失、非法、未来日期不显示。Brand registry 的 updatedAt 透传至日期判断。
- 导航、README、所有 Current 组件详情以及 Open HTML 独立页共用逻辑；动态 React 文档标题、午夜、后台恢复与 pageshow 自动同步。
- 仅处理文档 `.aisee-content-new` / `.nav-new-label`，不改变 Campaign 等业务示例自己的 NEW 徽章。
- 修改其他 Current HTML 仅为加入统一脚本；不重写其组件内容和待确认行为。

## Dropdown

- 新增 `components/Toggle/Toggle.demo.tsx`，直接使用 `src/components/Dropdown.tsx` 和正式 Toggle。
- Color / Surface / Size / State 全部为组件库浮层菜单，支持鼠标选择、键盘 Home / End / Enter、Esc 及外部点击关闭，原有变量联动保持。
- 加入组件 Demo 构建和 TypeScript 检查，输出 `toggle-demo.js` / `toggle-demo.css`。
- Toggle HTML 改引用可发布的 bundle，移除开发目录 src 的 CSS 依赖；已验证静态站点产物引用完整。

## 验证

- TypeScript、80 项测试、git diff --check 通过。
- 日期测试覆盖第 7 / 8 天台北午夜、跨月、跨年、闰日、未来 / 缺失 / 错误日期、过期隐藏及重新更新、各 Current 独立页的脚本覆盖。
- Toggle 定向构建和静态站点构建通过。
- 浏览器检查完整菜单视觉、Dark 切换、键盘选择 Disabled off、Esc、零原生 select。
- 菜单开闭前后舞台 top=243、变体列表 top=436，浮层不会移动外围布局。
- README / TEAM_DECISIONS / 当前交接已同步。

## Git 与下一步

本轮第一项只推送上轮已有两个提交。NEW、正式 Dropdown 替换及相关日期/交接文档均未新增 commit 或 push，等待视觉验收。

按顺序继续 Sidebar 剩余问题、Notification、Select / Dropdown；不要将其他待确认内容混入新发布。
