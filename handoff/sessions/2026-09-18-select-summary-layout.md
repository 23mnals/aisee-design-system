# Select 预览说明与控制位置 · 2026-09-18

- 按用户截图，将五种 composition 的标题与解释移到预览下方，和特性说明组成一个区域；移除上方重复标题 / 描述。
- 说明跟随切换同步更新，保留 aria-live；移动端取消原 44px 高度裁切，特性可换行。
- 组合下拉移至 Variant playground 标题右侧，删除可见 COMPOSITION 标签，以 aria-label 保留名称。Open menu / Show icons 保留在卡片内。
- 追加反馈：Show icons 只在 Icon action menu 下显示，控制 5 个动作图标；Grouped account 不显示开关并保留 8 个头像 / 平台图标。浏览器开关与切换回账号均通过。
- 浏览器验证 Compact / Search / Grouped account / Filter 切换和说明联动，上方重复标题数量为 0，说明位置在舞台下方。88 项测试通过。
- README 最近更新与 CHANGELOG 已同步，HEAD 25c8f9f、ai/desktop/design-system-current；没有提交 / 推送，仍待用户验收。
- 前序 Card 反馈（TagInput、收起居中、bg-hover、Dialog 长内容滚动）已实现，详见同日 card-interaction-feedback session。

- 追加排版反馈：顶部说明去掉 330px max-width，左侧 flex:1，右侧不收缩；两者间距 12px。

- 最新层级反馈：variant-playground 设置独立层叠上下文，标题下拉保持上层；核心示例包含展开菜单时提升整个示例区域，防止下方标题穿透。浏览器检查两种菜单每个选项均可命中。
- Delete 的 fluid hover 高亮由 active danger 行切换为 semantic-tag-02（#FCE7E7），键盘与指针共用，保留滑动动画；Copy for AI 已同步。
