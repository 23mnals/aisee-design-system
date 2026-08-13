# Animated icons

所有 hover 触发的 SVG 图标动画都放在这里。每个图标有两个文件：

- `Animated <Name> Icon.html` — 演示文档（多尺寸 + 真实场景 + 源码说明）
- `<Name>Icon.tsx` — React 组件，可以直接交给前端

## 现有图标

| 图标 | 触发 | 动画概念 |
|---|---|---|
| Bubble | hover | 消息气泡晃动 + 文字行动效 |
| Social | hover | 头像轻弹 + 三条内容线左→右"打字" |
| Trash | hover | 桶盖右端轴上掀 ~28°，碎屑从盖外飞入桶内与左竖线融合，桶身回弹 |
| Feed | hover | 5 根竖线正弦呼吸，相位从外向内传递 |
| Process List | hover | 逐条完成清单：每行先打勾再左→右划线，一行接一行，三行走完整体清空循环（参考拍屏视频）|
| Process List (Scroll) | hover | 传送带版：完成一行后整列上移、完成行从顶部淡出，底部补入新空行继续，无限循环（参考拍屏视频）|
| Bookmark | hover | 标签/收藏：线框书签以顶部中点为支点，下方 V 形缺口像钟摆左右摆动、幅度递减后归位，俏皮余韵（参考拍屏视频）|
| Bookmark 2 | hover | 标签/收藏（弹性扭动版）：按 Lottie 精确复刻，单条描边路径形变——顶部两角固定，底部边缘像橡皮左右弹性甩动（左→右→左→回位的阻尼摆动）|
| Bell | hover | 通知铃铛：按 Lottie 精确复刻（43f@30fps），铃身以顶部悬挂点为支点做衰减式左右摇晃 + 轻微上下弹跳，内部铃锤以错开、幅度更大的节奏甩动 |

## 约定

- 文件命名：演示用 `Animated <Name> Icon.html`，组件用 `<Name>Icon.tsx`
- 触发：默认 hover；hover 离开自动停止
- 引用根级样式：`href="../styles.css"`（注意是上一层）
- 尊重 `prefers-reduced-motion: reduce`
- 后续新增的所有 icon 动画都放进这个文件夹
