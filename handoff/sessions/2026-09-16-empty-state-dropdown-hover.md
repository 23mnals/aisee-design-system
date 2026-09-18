# 2026-09-16 Empty State 长列表 Hover 优化

## 本轮目标

- 修复 Empty State 顶部插图选择下拉框在长列表中移动时仍有停顿的问题。
- 保持键盘操作、选项间隙点击与 reduced-motion 行为不变。

## 本轮完成

- 定位到共享 React `Dropdown` 的指针 hover 每跨一行都会更新组件状态并重绘整列选项；14 项 Empty State 菜单最容易暴露该问题。
- 指针 hover 改为只更新活动索引引用和共享高亮层，不再触发整列选项重绘。
- 键盘方向键、Enter / Space 选择与辅助技术活动项仍同步 React 状态。
- 选项间隙点击改为读取当前高亮引用，保证移除指针重绘后仍选择正确选项。
- 高亮位移与尺寸跟随时间统一缩短为 72ms，透明度为 50ms。
- README 最近更新和组件使用说明同步记录长列表行为。

## 修改文件

- `src/components/Dropdown.tsx`
- `src/styles/components.css`
- `components/README.md`
- `README.md`
- `tests/preview.test.mjs`
- 完整构建同步更新的组件 Demo CSS / JS 产物。

## 验收

- `npm run check` 通过：token 检查、TypeScript、72/72 测试、全部组件 Demo 与库构建。
- 回归规则确认指针命中选项或间隙时不调用 React 状态更新，并确认 72ms 跟随参数进入发布样式。
- `git diff --check` 通过。

## Git

- 分支：`ai/desktop/design-system-current`
- 实现提交：`07d9554 fix: smooth long dropdown hover`
- 已推送至 `origin/ai/desktop/design-system-current`，由 current Pages 工作流发布公开 Demo。

## 下一步

- 用户在公开 Demo 复查 Empty State 长列表从首项连续移动到末项时的手感。
- PR #10 保持开启；仅在用户明确授权时合并到 `main`。
