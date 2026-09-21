# Confirmation Dialog

用于执行有影响的操作前确认。在现有组件上组合普通说明、影响提示卡片或额外内容。参考 [Figma 72:56945](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw/?node-id=72-56945)。

## 接入

通过组件页 Copy for AI 获取当前已发布的生产交付。按交付说明从解包后的本地 `index.ts` 导入 `ConfirmationDialog` 和 `ConfirmationDialogNotice`，只加载一次交付的 `styles.css`。组件继承宿主字体；不需要安装整个 AISEE 库。兼容环境由该组件 manifest 声明。

```tsx
// 以下路径按实际解包目录调整。
import { ConfirmationDialog } from './components/aisee/confirmation-dialog';
import './components/aisee/confirmation-dialog/styles.css';

<ConfirmationDialog
  open={open}
  title={confirmationTitle}
  description={confirmationDescription}
  notices={impactNotices}
  cancelLabel="取消"
  confirmLabel="确认操作"
  confirmVariant="danger"
  confirmDisabled={submitting}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
/>
```

`open`、文案、影响数据、提交状态及 `handleConfirm` 均来自业务项目。确认成功后由业务代码设 `open=false`；失败时保留弹窗并在宿主展示错误。组件不生成模拟数据，也不会额外创建演示页面。

## API

| 属性 | 用途 |
| --- | --- |
| `open` | 必填，由宿主控制是否打开 |
| `title` | 必填，支持 ReactNode |
| `description` | 可选说明，支持 ReactNode |
| `notices` | 可选影响卡片数组；省略后使用简洁确认 |
| `children` | 可选额外业务内容 |
| `cancelLabel` / `confirmLabel` | 按钮文案；建议始终按业务提供。兼容旧版默认值为 Keep Editing / Discard Changes |
| `closeLabel` | 关闭按钮无障碍名称，默认 Close dialog |
| `confirmVariant` | `danger`（默认）或 `primary` |
| `confirmDisabled` | 禁用确认按钮，默认 false；不会禁用取消 |
| `onClose` | 取消、关闭按钮、Escape 等关闭请求回调；宿主更新 open |
| `onConfirm` | 业务确认回调；不自动关闭或创建 Toast |

每条 notice 包含稳定唯一的 `id`、`title`、`tone: 'positive' | 'warning'`，以及可选的 `description`、`icon`。图标由宿主传入 ReactNode。示例中的自动化文案、队列数量和插图不属于通用组件。

原生 dialog 提供模态行为；打开后优先聚焦取消按钮，关闭后返回触发位置。使用支持 `HTMLDialogElement.showModal` 的浏览器。SSR 框架中应在客户端组件中控制交互。

## 生产边界

生产清单包含 ConfirmationDialog、Button、样式完整依赖闭包和关闭 SVG。字体、演示场景、业务插图、Toast、展示布局均不交付。Demo 直接 import 生产组件。

默认宽度 512px，基础内边距 24px，影响卡片间隔 12px；窄屏按钮纵向排列，长内容在可视区域内滚动。标题沿用设计系统已确认的 20px / 500 规则。
