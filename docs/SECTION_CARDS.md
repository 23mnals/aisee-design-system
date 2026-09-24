# 通用分区卡片

## Figma 来源与补齐范围

文件 `LLvI9vd66VLNuAltAWJFJw`，2026-09-17 读取。

| 来源 | 组合 | 对应实现 |
|---|---|---|
| [38:84429](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw?node-id=38-84429) | Basic Information：输入、双列、下拉、选项 | Card section + CardGrid + 既有 Input / Dropdown |
| [38:84482](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw?node-id=38-84482) | Brand Descriptions：两个长文本 | Textarea + CardGrid |
| [38:65908](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw?node-id=38-65908) | Overview：指标集合 | Card section + 既有 StatCard |
| [77:16891](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw?node-id=77-16891) | Create Post：账号选择、填写、设置、预览 | 既有 Dialog 中组合 Card |

Create Post 已继续读取子节点 77:16893（账号区）、77:16984（设置、可选区域、开关）、77:17205（预览）。通用组件提取容器和插槽，Demo 只验证组合交互，不复制整套业务弹窗或实现 AI 生成 / 发布服务。

内容分类包括：标题 + 单输入、标题 + 输入组（2 个以上）、标题 + 选项、标题 + 长文本（含长文本组）、混合表单、指标总览、账号多选列表、可折叠设置 / 可选开关区、内容预览。还补充标题说明、标题右侧操作及底部提示 / 操作。

## API 与视觉

- `Card variant="default" | "section" | "divided"`，默认保留原白色卡片与可选 shadow。
- section：16px 圆角、16px 内距、5px 白色内边框、语义浅色背景、共享轻描边；标题 16px / 500。
- divided：24px 白色外框，配合 `CardGrid divided columns={1|2|3|4}` 形成连续分区、共享单层分隔线；直接放入的 Card 只贡献内容，不增加内层边框。容器宽度 ≤900px 时 3/4 列降为 2 列，≤600px 时改为 1 列。适合功能总览与说明集合，详见 FEATURE_OVERVIEW。
- `title` / `description` / `headerAction` / `footer` 是插槽。字段仍由 Input、Textarea、Dropdown、Checkbox、Toggle 管理。
- `CardGrid columns={1|2|3|4}`：列间距 8px、行间距 16px。按 section 容器宽度降为两列 / 单列，适配页内与弹窗列宽。
- `collapsible` 默认展开，`defaultExpanded` 支持非受控；`expanded` + `onExpandedChange` 支持受控。非文字标题提供 `collapseLabel`。
- 收起时清除内容区预留间距，标题 / 右侧操作 / 箭头垂直居中。Brand Mention 使用 TagInput 接受多个品牌或话题，不用普通 Input 替代。
- 折叠按钮独立于 headerAction，具有 aria-expanded / aria-controls。内容保持挂载，关闭不丢字段值，也不等于清空 / 禁用字段。
- 卡片不裁切 Dropdown 浮层。不对静态整卡添加 hover 色环。焦点、禁用、错误由内部控件决定。
- `Textarea` 从 Input 模块导出：支持 label / hint / error / ref 及原生 required、disabled、readOnly、value、onChange、name 等属性；最小高度 120px，可垂直拉伸。

## 嵌套层级（2026-09-18 用户确认）

复杂描边 / 白色内框只出现在最外层，适用于任何页面、弹窗与组合。section 内再放 Card 时使用白底浅描边或浅灰填充，不重复白色内框和阴影。共享样式自动将嵌套 section 简化为白底、浅描边、8px 圆角、12px 内距；保留内容、折叠与字段状态。独立 section 仍保留原规格。参考 Figma 77:16889 / 77:16984。

## 示例

```tsx
import { Card, CardGrid, Input, Textarea } from '@aisee/design-system';
import '@aisee/design-system/styles.css';

<Card variant="section" title="Basic Information">
  <CardGrid columns={2}>
    <Input label="Company Name" required />
    <Textarea label="Description" hint="One or two sentences." />
  </CardGrid>
</Card>
```

## 边界

- Card 不内置保存接口、表单校验规则、账号权限、指标计算、生成或发布操作。
- 指标复用 StatCard；完整指标集合仍可使用已有 StatCardGroup。Card 用于更通用的分区组合。
- Card Demo 保留原有 Default / Elevated 示例，新增 9 种内容组合及 Create Post 弹窗验证入口。
- 示例账号、字段值、可选项属于 Demo；业务接入时替换为真实数据。
