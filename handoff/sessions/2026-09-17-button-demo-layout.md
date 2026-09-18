# 2026-09-17 · Button 展示布局调整

## 用户要求与完成

- 根据三张截图调整原 Button 页，复用现有组件视觉，没有改为参考网站的整体风格。
- Icon variants 移至 Other current variants 与 States 之间；Show icon 开关和 Left / Right 互斥选项位于标题右侧。按钮卡片删除名称说明，只显示按钮本身。
- States 删除 Small / Default / Large / Disabled 小标题与内层小卡片，按钮直接显示 Small / Default / Large。
- States 后增加 With icon：Create 左图标、Next 右图标、Search 左搜索右箭头；Disabled 独立展示 Analysis、Post、Dark、Secondary、Ghost、Delete。
- React Button 增加 trailingIcon 支持双侧图标；icon 优先于 leadingIcon / trailingIcon，showIcon 隐藏全部图标且不留空位。
- 同步 README 当前批次、Overview、Copy for AI、AI_HANDOFF 与当前交接。

## 验证

- 浏览器点击 Left / Right 切换五个变量示例的真实图标位置；关闭后五个图标节点全部移除，位置选择禁用，重新开启保留选择。
- 原生 radio 支持键盘左右方向键；With icon 三例分别含 1 / 1 / 2 个装饰图标；Disabled 六种按钮均有 disabled 属性。
- 标题与卡片布局截图检查通过；定向构建和 typecheck 通过，现有测试 83 项通过。

## Git 与未完成

分支 ai/desktop/design-system-current，HEAD / origin 25c8f9f。本轮未提交 / 推送，Button 待用户视觉确认。其他未确认的本地改动保持，完整任务列表 / 回复卡片仍待用户明确范围。
