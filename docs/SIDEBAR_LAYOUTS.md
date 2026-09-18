# Sidebar 布局变量

2026-09-18，本地待视觉验收。参考 Fluid Functionalism 的布局分类，沿用 AISEE 现有 SidebarNavigation / TreeNav、Karla、白色表面、浅描边与图标；没有安装或覆盖第三方组件。

## 布局与按钮位置

| 变量 | 值 | 表现 |
|---|---|---|
| variant | sidebar（默认） | 通栏白底侧栏，与正文共用分隔边 |
| variant | muted | 通栏灰底侧栏，正文白底 |
| variant | floating | 独立白色卡片，四周 16px 间距、16px 圆角、浅描边 |
| variant | inset | 侧栏融入页面底色，正文使用独立白色卡片 |
| variant | topbar | 全宽顶部导航，按钮始终在左上角；收起后不保留图标窄栏 |
| reveal | hover / click | 仅 topbar：悬停临时浮出 / 点击恢复展开 |
| togglePosition | inside（默认） | 收起 / 展开按钮在侧栏头部 |
| togglePosition | outside | 按钮在右侧内容区标题栏左上角，标题前，无独立悬浮框 |

收起 / 展开图标默认保持半透明；hover / focus-visible 使用 `--aisee-color-semantic-button-usual`，不再保留半透明效果。内部和外部按钮一致。

悬浮卡片模式的内容标题栏不填充白色；外壳提供 16px 栏间距和右边距，正文不要再叠加横向内距。Inset 的标题栏无独立圆角，只保留底部 1px 分隔线；外层内容卡片继续保留圆角。

前四种布局与按钮位置独立组合，共八种；topbar 固定顶部按钮，另选 hover / click 两种交互。导航项、已展开的分组、当前选中及收起状态不随布局切换重置。展开宽度 224px，收起宽度使用已有 sidebar-collapsed token；继续提供子项浮层与键盘 focus。

## React

```tsx
<SidebarLayout
  variant="floating"
  togglePosition="outside"
  header={pageHeader}
  sidebar={<SidebarNavigation
    groups={groups}
    value={page}
    onValueChange={setPage}
    collapsed={collapsed}
    onCollapsedChange={setCollapsed}
    header={project}
    footer={account}
  />}
>
  {pageContent}
</SidebarLayout>
```

SidebarLayout 只管侧栏和内容的布局，不接管路由、导航选中或收起状态。外置按钮与内容标题栏通过 SidebarLayout 组合，header 插槽放标题与右侧操作。按钮仍由 SidebarNavigation 维护原有受控或非受控状态，通过 portal 放入标题栏，不增加第二份收起状态。内部按钮默认调用保持兼容。

默认值兼容现有 Webapp；本轮未改变 Webapp 的产品层级。outside 指内容区标题左侧，不能用侧栏负偏移或额外占位列模拟。未引入第三方的 cookie、快捷键、拖动调宽或移动端抽屉。

组件页使用共享 React 实现，两个靠右对齐的正式 Dropdown 控制布局。窄屏时预览舞台局部横向滚动；产品移动端适配由应用外壳负责。

参考：https://www.fluidfunctionalism.com/docs/sidebar

## 顶部导航

```tsx
<SidebarLayout variant="topbar" reveal="hover" header={pageHeader}
  sidebar={<SidebarNavigation groups={groups} header={project} footer={account} />}>
  {pageContent}
</SidebarLayout>
```

展开时为正常双栏；点击顶部按钮收起后侧栏完全隐藏、不可聚焦，正文使用全部宽度。`reveal="hover"` 时鼠标进入顶部按钮会临时浮出完整导航，正文宽度不变；按钮到浮层之间有 160ms 离开缓冲。离开按钮和侧栏、点击外部、选择目的页或按 Escape 关闭临时面板。点击按钮则保持展开。`reveal="click"` 只通过点击或键盘 Enter / Space 恢复展开，不响应悬停。减少动效偏好继续沿用共享 Sidebar 规则。

保持现有 AISEE 样式，不复制参考截图的系统窗口按钮、通知蓝点等应用专属内容。组件预览只有选择 Top navigation 时，第二个变量改为 Reveal on hover / Reveal on click。

顶部导航的临时侧栏使用轻量阴影：`2px 4px 12px rgba(17,17,17,.06)`，避免遮挡正文的厚重暗边。
