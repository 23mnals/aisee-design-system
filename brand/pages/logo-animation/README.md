# aisee Logo Animation

来源：`/Users/ccbakala/Documents/ui/aisee/logo/logo.svg`（原始绿色 Logo 路径）；眨眼节奏参考 `../../assets/logo-mark.gif`。

## 交互规则

- 绿色 Logo 外轮廓、眼白路径和黑色瞳孔形状保持原始数据不变；眨眼间隔约 3–4.5 秒，并保留更明显的左右查看。
- 页面任意位置发生鼠标移动时，先按视口归一化方向并做轻微非线性增强，再以约 82ms 的帧间隔插值延迟朝鼠标方向移动，不需要鼠标进入 Logo。
- 瞳孔按参考图缩小到能完整容纳在眼白内部的比例；左右最大位移提高到约 44px，并根据真实眼白 Path、瞳孔半径和 4% 安全间距动态约束，左右可接近眼角且不会被裁断。
- clipPath 是最后保护层，正常状态下瞳孔完整位于眼白内部，不使用缩放、模糊或滤镜。

## 文件

- [`../../assets/logo-animated.svg`](../../assets/logo-animated.svg)：可直接作为 SVG 或内联到 HTML 使用的动画资源。
- [`../../../src/components/AiseeLogoAnimation.tsx`](../../../src/components/AiseeLogoAnimation.tsx)：React/TSX 生产组件，推荐开发在 React 项目中使用；它会监听页面级鼠标移动，不能用 `<img>` 替代。
- [`preview.html`](preview.html)：本地交互预览。

## 交付给开发

React 项目直接安装/引用设计系统后使用：

```tsx
import { AiseeLogoAnimation } from '@aisee/design-system';

export function HeaderLogo() {
  return <AiseeLogoAnimation size={40} aria-label="AIsee" />;
}
```

如果不是 React 项目，建议把 `logo-animated.svg` 内联到页面并把页面级鼠标事件接到宿主页面；`<img src="logo-animated.svg">` 只会显示静态图，`<object>` 只能保证资源自身脚本运行，不能保证监听到 Logo 以外的页面鼠标移动。
