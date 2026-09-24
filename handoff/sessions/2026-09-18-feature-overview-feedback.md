# FeatureOverview 图标与展示模式 · 2026-09-18

- 用户截图指出 compact 信息条频率 / 手动发布图标过大、小叹号位置偏上，并说明信息值支持纯文字或纯图标。
- 共享 compact StatCard 图标从 20px 改为 16px；label 内 Tooltip trigger 使用 vertical-align:middle，保留 12px 帮助图标与 hover / focus。
- FeatureOverview 独立 compact 示例增加标题右侧 Text only / Icon only 下拉；调用既有 value 插槽，无须新增冗余 API。标签继续保留。
- 修改 src/styles/feature-overview.css、FeatureOverview.demo.tsx；定向重建 FeatureOverview / Card / StatCardCurrent 三个引用该样式的 Demo。同步 README、Copy for AI、FEATURE_OVERVIEW 文档与当前交接。
- 验证：typecheck 与三份定向构建通过；浏览器 4 个总览信息图标均 16×16、小叹号 12px / middle；纯图标显示 3 个图标且无值文本、纯文字恢复 30 / 20 / 24h；390px 页面宽度 390，无横向溢出。
- 分支 ai/desktop/design-system-current，HEAD 25c8f9f；保留其余工作区修改。未提交 / 未推送，视觉待用户确认。
