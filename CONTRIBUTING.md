# Contributing

## 原则

1. [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md) 是视觉与交互唯一规范源。
2. 业务、权限、数据和产品文案不由本仓库决定。
3. 不在组件内部硬编码模块主色；使用 `--aisee-module-primary*`。
4. dApp 不引入 Gotu，不添加装饰性循环动画，不使用 emoji 作为图标。
5. 新组件必须包含键盘、focus-visible、disabled 和 reduced-motion 行为。

## v6 规范一致性检查

每次更新设计系统前后，都必须对照 [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md) 检查颜色、字体、间距、组件状态和交互规则。

- 如果实现与 v6 文档一致，按常规提交，并在 PR 中注明对应章节。
- 如果实现与 v6 文档不一致，必须在 PR 和变更记录中单独列出差异，标明“设计系统已更新，v6 文档未同步”或相反。
- 不得擅自修改 v6 文档来掩盖差异，也不得擅自回退设计系统；先由产品/设计负责人判断应更新文档还是更新系统。
- 差异未确认前，保留现有实现和文档，避免把未决内容当成新规范扩散。

## 本地流程

```bash
npm ci
npm run dev
npm run check
```

令牌改动：编辑 `src/tokens/tokens.json` 后执行 `npm run tokens`，并提交 JSON、CSS 和 TS 三个文件。

## Pull Request 检查单

- [ ] 链接相关规范章节或设计节点
- [ ] 说明影响的模块和状态
- [ ] 提供组件文档站截图
- [ ] `npm run check` 通过
- [ ] 未在同屏混用 lime/yellow 主操作
- [ ] 正文、控件、页面和弹窗标题均使用 Karla
- [ ] 颜色、间距和动效来自令牌
- [ ] 如有破坏性变化，写清迁移方法并更新 major version

## 组件 API

- 受控状态优先：`value` + `onValueChange`、`open` + `onClose`
- 透传原生 HTML props 和 ref
- 组件 class 使用 `aisee-` 前缀
- 样式变体用联合类型，不接受任意字符串
- 不把业务接口、路由、权限或产品数据放进基础组件

## 提交信息

建议使用 Conventional Commits：

```text
feat(button): add compact size
fix(dialog): restore escape close behavior
docs(tokens): document engage banner color
```
