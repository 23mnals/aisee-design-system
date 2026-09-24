# Select Demo hover 稳定性修复 · 2026-09-17

## 问题与修复

- 用户反馈 Grouped account 菜单 hover 一闪一闪。
- installFluidHover 缓存了行中心的 viewport 坐标，页面滚动后仍据此处理行间空隙，导致高亮跳错行。改为缓存菜单相对坐标，使用当前菜单位置换算指针位置。
- data-instant 原样式将高亮 opacity 设为 0，重新测量时产生不必要的消隐。改为仅禁用 transition，保持可见。
- pointermove 先取消上一帧待执行的行间判断；进入操作区或离开菜单后，不再执行过时的回调。
- 保留现有数字让位、操作图标淡入、分组折叠、Connect 按钮与 fluid hover 动画。

## 验证

- 新增 tests/select-fluid-hover.test.mjs，执行实际 installFluidHover 函数，覆盖滚动后行间命中、旧帧不能覆盖新行/控件/离开动作，以及重新定位不隐藏高亮。
- 浏览器在滚动后的账户菜单中移至 yinye 上方空隙，active 仍为最近的 yinye，高亮 opacity 1。
- 变更限 Select HTML、回归测试与文档，没有改动其他组件源码或生成包。

## Git

- 分支 ai/desktop/design-system-current，HEAD / origin ae7b45e，未提交或推送。
- 原有混合工作区保持，后续继续用户视觉验收。
