# Card 交互反馈 · 2026-09-18

## 用户要求与完成

- Brand Mention 应使用 TagInput：Card Settings 替换普通 Input，页面与创建 Post 弹窗同时生效。浏览器验证 Enter / Add 添加两项，收起 / 展开保留，删除可用。
- 折叠卡片标题偏上：header 原有 margin-bottom 在隐藏内容后仍占空间；共享规则仅在收起时清零并 align-items:center，验证上下各 13px。
- 分段选项 hover：使用 --aisee-color-semantic-bg-hover，取消未选项灰色描边，已选项保留语义色 / 深边并叠加相同 token。
- 弹窗长内容无法滚动：原 dialog overflow:hidden，而 main 未限制高度且 content 不滚动。通用 Dialog 改为视口高度约束 + flex 容器，content min-height:0 / overflow:auto；固定头尾。split 布局同步设置可收缩网格，移动端保留侧栏后的内容空间。

## 验证

Card、SegmentedChoice、Dialog 定向构建；浏览器滚轮实测桌面内容 scrollTop 到 167，390px 窄屏约 905，无横向溢出且底部按钮可见。TagInput 行为、折叠居中通过。相关 README、Copy for AI、组件规范、TEAM_DECISIONS、AI_HANDOFF 已同步。

## Git

ai/desktop/design-system-current / 25c8f9f。没有提交、推送或发布；不改动其他未确认内容。当前仍待用户对本批视觉 / 交互验收。

- 输入文字追加反馈：root input 的 font:inherit 覆盖 TagInput 12px；增强 TagInput 输入规则作用域后定向重建 Card，浏览器实测输入及 placeholder 均为 12px。
