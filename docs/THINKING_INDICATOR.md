# Thinking Indicator

用于回复到达前的轻量等待状态。[Fluid Functionalism 参考](https://www.fluidfunctionalism.com/docs/thinking-indicator)提供圆形与无限符号变形、扫光和文字轮换的动效基础；本实现适配 AISEE 的字体、语义颜色和独立生产交付。

## 用法

通过组件页 Copy for AI 获取最新已发布源码，从交付目录导入。示例路径按实际目录调整。

```tsx
import { ThinkingIndicator } from './components/aisee/thinking-indicator';

// isThinking 必须来自真实请求状态；返回结果后卸载组件。
{isThinking && <ThinkingIndicator />}

// 纯文字、紧凑尺寸
<ThinkingIndicator showIcon={false} size="compact" />

// 本地化，读屏使用稳定文案。
<ThinkingIndicator labels={['思考中', '整理思路', '完善回答']} aria-label="正在思考，请稍候" />
```

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `showIcon` | `true` | 显示圆形 / ∞ 变形图标 |
| `size` | `default` | `default`：14/22、20px 图标；`compact`：12/18、18px 图标 |
| `labels` | Thinking / Planning / Refining | 装饰性等待文案，每 4 秒轮换；空数组回退到默认文案，单文案不轮换 |
| `aria-label` | Thinking… | 给辅助技术的稳定状态，建议与文案语言一致 |
| `className` / `style` / `ref` | — | 宿主布局、样式和 DOM 引用 |

文字只表示持续等待，不说明真实任务阶段、百分比或模型思维。需要实际阶段时使用 Steps。组件不请求接口、不虚构进度，也不自行判断任务完成。

## 动效及无障碍

- 图形 6 秒一轮，圆形 → ∞ → 反向圆形 → ∞；文字扫光 1.5 秒一轮。
- 文字按全部候选项预留宽度，轮换不让相邻内容跳动。
- 普通父级 rerender 不重启文字计时；卸载清理计时器和偏好监听。
- 遵循动态 `prefers-reduced-motion`：静态 ∞ 与首条文案，不轮换、不扫光。
- `role=status` 仅播报稳定文案，动态文字与图标 aria-hidden；强制颜色模式保留可读文字。
- SSR 初始静态，客户端读取动态偏好后开始播放；SSR 框架中使用客户端交互边界。

## 生产交付

组件清单声明 React >=18；Node >=18 仅用于执行源码安装器。使用支持 CSS 和 SVG SMIL 动画的现代浏览器。无需安装整套 AISEE、Tailwind、shadcn、Inter、SizeProvider 或 Framer Motion。

生产文件仅组件 TSX、局部 CSS、入口和 CSS 类型声明。CSS 完整保留语义变量默认值、keyframes、supports、reduced-motion 和 forced-colors；继承宿主字体，不包含 Demo、字体、模拟业务或外部资源。

Copy for AI 复制预览当前的 `showIcon` / `size`。页面下方的其它展示形式不代表要同时添加到业务项目。
