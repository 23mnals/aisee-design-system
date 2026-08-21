# Brand 页面产出

网页端或其他 AI 工具生成的品牌页面，统一按“一个功能一个文件夹”归档：

```text
brand/pages/<feature-slug>/
├── preview.png
└── preview.html
```

`<feature-slug>` 使用英文小写短横线，例如 `automation`、`improve-score`、`build-brand-influence`。HTML 是系统门户使用的可交互预览；PNG 为可选的设计稿参考，不要求每个页面都提供，也不会作为门户中的独立并排 Demo 卡片显示。

添加文件后，在本目录的 `index.json` 登记页面：

```json
{
  "version": 1,
  "pages": [
    {
      "name": "Automation",
      "html": "brand/pages/automation/preview.html",
      "subtitle": "Hosted automatic publishing workflow preview."
    }
  ]
}
```

`name` 必须是侧边栏显示的英文功能名，`html` 是必填的仓库相对路径，`subtitle` 用于说明页面用途；`image` 如果存在，仅作为资源登记和后续扩展使用。门户会把这些条目归到 Brand 分组，在详情页使用单个 HTML 预览，并可通过右上角 `Open HTML` 单独打开。

文件路径必须使用仓库相对路径，不要引用聊天临时目录、`/var/folders/...` 或本机绝对路径。放入仓库并登记后，下一次打开门户即可读取；GitHub Pages 构建会同时发布这些文件。
