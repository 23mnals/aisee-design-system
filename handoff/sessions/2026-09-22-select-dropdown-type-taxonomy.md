# Select / Dropdown 类型梳理

## 本轮目标

- Select / Dropdown 页面按可复用组件类型展示，不沿用设计稿中的业务功能名称。
- 核对现有实现能力，补齐遗漏类型，并保留组合示例层级。

## 本轮完成

- 将核心类型统一为 Single-select、Multi-select、Searchable multi-select、Combobox、Action menu、Grouped select。
- 上半区示例改用 Option A/B/C 等中性内容，移除 Reporting period、Publish channels、Platform filter、Website URL 等业务命名。
- 新增可交互的 Action menu 与 Grouped select 核心示例；Combobox 同步维护 `aria-expanded`。
- 每张核心类型卡只保留一个可见类型标题，触发器和输入框保留与标题一致的 `aria-label`，删除重复字段但保留无障碍名称。
- 将 Search + action、Filter panel、Grouped account 等继续定义为组合示例，不与核心类型混排。
- 同步门户简介、长期决策、README 最近更新和静态测试。

## 验收

- 本地浏览器确认六类核心类型正常显示，2 列桌面布局未出现挤压或换行异常。
- `npm test`：139 项通过。
- `npm run typecheck`、`npm run site`、`git diff --check` 通过。

## Git 状态

- 当前分支：`ai/desktop/design-system-current`。
- 本轮修改尚未提交、尚未推送。
- 分支此前已有 2 个本地提交尚未推送；远端仍为 `7cd6dc0`。

## 下一步

- 用户确认后提交本轮 Dropdown 类型调整；网络可用时连同此前 2 个提交推送开发分支。
