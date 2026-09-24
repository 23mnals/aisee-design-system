# Toggle Copy for AI：两种模式

组件详情页只有一个主复制按钮，旁边的箭头打开统一选项菜单。Apply AISEE design 为默认值，更新现有组件视觉与动效；Add motion only 保留静态外观，只增加缺失动效。两者只在 Goal 段落不同，共用同一组件可写范围和业务保护规则；此机制适用于全部已登记的组件复制入口。

## 变体与 UI

- 默认 No specific variant，不把页面初始值或 Variant playground 写入提示词。
- 菜单的 Target variant 区列出当前预览可交付的配置；用户明确选择一项后，才附加该项 Selected variant target。不会同时复制多个示例，也不会写入 gallery 的 scope 名称。
- 只操作页面里的预览控件，不等于指定接入变体；修改预览会清除此前变体选择，需要重新选择。切换组件会恢复默认模式和无变体状态。
- 主按钮内以 Apply design / Motion only 持续显示当前模式，菜单内显示完整名称与简短说明；复制成功用 Copied 与包含完整模式的提示反馈，状态也通过 aria-live 播报。异步过程中切换页面或选择会取消旧复制。
- 显式变体只约束当前目标允许的属性：motion 模式不会因此换颜色、尺寸或主题，两种模式都不得改变业务状态。

## Apply AISEE design：完整默认文本

```text
Integrate AISEE Toggle into this React project.

Goal — Apply AISEE design: Update the existing target component’s visual design and motion to the AISEE reference. Apply changes only inside the component, preserve its placement and surrounding page layout, and keep existing business behavior.

Shared component scope and behavior protection:
1. Inspect the existing target, UI library, styles and callers first (shadcn: components.json, aliases and components/ui). Before editing, list the exact allowed paths: only the requested component implementation and its directly owned local styles. A components/ or _components/ directory is not a blanket allowlist. Reading a file does not authorize editing it. Reuse the existing component and UI library; do not create a parallel primitive or import full delivery CSS. If the target is ambiguous or absent, propose the target/new component paths and wait for my confirmation.
2. Preserve the component API, state ownership, checked/defaultChecked, disabled, callbacks, keyboard/focus behavior and existing business flow. Use component-internal animation effects/refs with cleanup and reduced-motion support. Do not add pending/optimistic state, change state timing, bypass confirmation or simulate success. Press feedback may animate immediately; the actual state must still follow the original business logic and API results.
3. Do not modify business pages/callers, page layout or copy, business logic, hook files (shared/custom/business), APIs, data fetching/request layers, timeouts, error handling, routing, global styles/themes/providers, project/build/cache configuration, package manifests or lockfiles. Do not install dependencies. Internal animation effects do not authorize edits to hook files or business state.
4. If integration or validation requires any file outside this scope, STOP before editing it. List each exact file, why it is needed, the smallest proposed diff and its impact; wait for my explicit confirmation, then change only the approved hunks. This includes caller imports, event wrappers, Tooltip structure and node-remount fixes. Network/cache/test failures and later requests to continue/fix/verify do not expand this scope by themselves.
5. Preserve existing staged, unstaged and untracked work; never use whole-file rollback over prior changes. Inspect downloaded reference source only in a temporary directory outside the host project. The selected goal and this scope override broader reference installation/default/preservation instructions: visual changes are authorized only by the goal, never by preview defaults. If no variant target is attached, do not infer one from the playground. A selected variant never authorizes business-state or scope changes. Use existing permitted checks, review every changed file against the allowlist, and report unresolved limitations without fixing unrelated code.

Reference: https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/toggle/latest.json
```

## Add motion only：完整默认文本

```text
Integrate AISEE Toggle into this React project.

Goal — Add motion only: Add only the target component’s missing AISEE motion. Preserve its existing static appearance, including size, color, typography, spacing, icons and layout, and keep existing business behavior.

Shared component scope and behavior protection:
1. Inspect the existing target, UI library, styles and callers first (shadcn: components.json, aliases and components/ui). Before editing, list the exact allowed paths: only the requested component implementation and its directly owned local styles. A components/ or _components/ directory is not a blanket allowlist. Reading a file does not authorize editing it. Reuse the existing component and UI library; do not create a parallel primitive or import full delivery CSS. If the target is ambiguous or absent, propose the target/new component paths and wait for my confirmation.
2. Preserve the component API, state ownership, checked/defaultChecked, disabled, callbacks, keyboard/focus behavior and existing business flow. Use component-internal animation effects/refs with cleanup and reduced-motion support. Do not add pending/optimistic state, change state timing, bypass confirmation or simulate success. Press feedback may animate immediately; the actual state must still follow the original business logic and API results.
3. Do not modify business pages/callers, page layout or copy, business logic, hook files (shared/custom/business), APIs, data fetching/request layers, timeouts, error handling, routing, global styles/themes/providers, project/build/cache configuration, package manifests or lockfiles. Do not install dependencies. Internal animation effects do not authorize edits to hook files or business state.
4. If integration or validation requires any file outside this scope, STOP before editing it. List each exact file, why it is needed, the smallest proposed diff and its impact; wait for my explicit confirmation, then change only the approved hunks. This includes caller imports, event wrappers, Tooltip structure and node-remount fixes. Network/cache/test failures and later requests to continue/fix/verify do not expand this scope by themselves.
5. Preserve existing staged, unstaged and untracked work; never use whole-file rollback over prior changes. Inspect downloaded reference source only in a temporary directory outside the host project. The selected goal and this scope override broader reference installation/default/preservation instructions: visual changes are authorized only by the goal, never by preview defaults. If no variant target is attached, do not infer one from the playground. A selected variant never authorizes business-state or scope changes. Use existing permitted checks, review every changed file against the allowlist, and report unresolved limitations without fixing unrelated code.

Reference: https://23mnals.github.io/aisee-design-system/assets/ai-deliveries/toggle/latest.json
```

## 使用与验收

本地组件详情页可直接选择模式后复制。尚未发布时，线上门户仍是旧规则；以上完整文本可以直接交给另一项目的 AI，公开 Reference 提供源码参考，选定 Goal 和组件范围优先于其中的通用保留/安装步骤。

检查本次任务新增 diff：只允许目标组件及其专属局部样式。设计模式可改变组件视觉，但不能重排页面、改文案或业务；动效模式连静态外观也必须保持。页面、hook、API、请求、依赖和配置始终在默认范围外，必须先列文件、原因、最小 diff 与影响，等待确认。接收方应保留原有 staged/unstaged/untracked 工作。

本仓库检查模式目标差异、共享保护文本、默认无参数、显式单一变体及异步复制状态；真实外部 AI 的实际遵循仍需跨项目验证。之前测试项目中的业务改动不会由本次提示词修改自动撤销。
