在 skills/scripts/copy-skills-tofull.js 写一个nodejs脚本，esmodule语法。实现将 skills/ofajs-docs/SKILL_cn.md 中的代码复制到 skills/ofajs-docs-full/SKILL_cn.md 中。
然后将引用资源的代码，按规则添加到对应位置的下面，例如：

```
- [page.html](assets/01-start/page.html): 页面模块的定义文件，负责页面模块的逻辑和渲染。
- [demo.html](assets/01-start/demo.html): 引用页面模块的入口文件，负责加载 ofa.js 框架和页面模块。
```

则替换为：
```
- assets/01-start/page.html: 页面模块的定义文件，负责页面模块的逻辑和渲染。
- assets/01-start/demo.html: 引用页面模块的入口文件，负责加载 ofa.js 框架和页面模块。

<!-- 然后在文章最底部添加代码 -->

---

**assets/01-start/page.html**
\`\`\`html
<!-- 对应读取 assets/01-start/page.html的内容 -->
\`\`\`

---

**assets/01-start/demo.html**
\`\`\`html
<!-- 对应读取 assets/01-start/demo.html的内容 -->
\`\`\`\`
```

如果遇到 references/下文件引用，则直接添加到下方，例如：

```
[Provider 与上下文状态](references/provider-context.md)
```

则替换为

```
<!-- 只将链接替换为加粗文本 -->
**Provider 与上下文状态**

---

<!-- 然后在文章的最后面添加 references/provider-context.md 的内容-->

```
