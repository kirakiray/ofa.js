# ofa.js 使用教程

ofa.js 是一个渐进式 Web 微前端框架，无需依赖 Node.js、Webpack 和 NPM 环境即可运行。

## 快速上手

在 HTML 中直接引入 ofa.js 的 JS 文件，即可开始使用：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 页面模块参考

- [page.html](./examples/01-start/page.html): 页面模块的定义文件，负责页面模块的逻辑和渲染。
- [demo.html](./examples/01-start/demo.html): 引用页面模块的入口文件，负责加载 ofa.js 框架和页面模块。

### 案例说明

1. 页面模块使用 `<template page>` 标签定义，需要渲染的元素都写在 `template` 内，文件后缀为 `.html`。
2. 模块逻辑写在 `template` 内的 `<script>` 中，通过 `export default` 函数返回对象，以此定义页面模块的数据和方法。**有且只能存在一个 script 标签。**
3. 可以在 `export default` 函数中接收 `{ query }` 参数，用于获取 URL 查询参数。
4. 数据和方法在 `data` 和 `proto` 中定义，分别对应页面模块的属性和方法。
5. 通过在节点上使用 `{{key}}` 语法，直接将 `data` 中的数据渲染为文本。
6. 在 `proto` 上定义模块的方法后，可在模板节点上使用 `on:xxx` 进行事件绑定，可用事件参考 DOM 事件。
7. 简单的函数计算可以直接在模板上进行，例如 `num++`；上面案例中的 `doubleNum` 也可以改用 `{{num * 2}}`。
8. 在 `proto` 上可以使用 `get xxx` 关键字定义计算属性（与 Vue 的 `computed` 不同）。
9. 模块内的样式写在 `template` 内的 `<style>` 中。若要定义模块元素自身的样式，需使用 `:host` 选择器，可参考 Web Component 样式选择器。

## 组件模块参考

- [switch.html](./examples/02-switch/switch.html): 组件模块的定义文件，负责组件模块的逻辑和渲染。
- [page.html](./examples/02-switch/page.html): 使用该组件的页面模块。
- [demo.html](./examples/02-switch/demo.html): 引用页面模块的入口文件。

### 案例说明

1. 组件模块使用 `<template component>` 标签定义，需要渲染的元素都写在 `template` 内。
2. 基础逻辑与页面模块保持一致，区别在于返回的对象中需要带有 `tag` 字段用于定义组件的标签名，且**不能使用 `query` 参数**。
3. 使用组件前需使用 `<l-m>` 标签引入组件模块，`src` 属性为组件模块的路径。引入后，即可在模板中使用该组件的标签名。
4. 组件模块可以使用 `attrs` 定义属性的默认值，这些值会实际渲染到组件的 `attributes` 上。通过 attrs 传递的属性会默认转为字符串。**注意：`attrs` 和 `data` 的 key 不能重复。**
5. 使用 `:tokey="fromkey"` 语法可以将当前页面/组件模块的 `fromkey` 属性单向传递给目标组件模块的 `tokey` 属性，上层模块改动后会同步更新组件模块的属性值。
6. 使用 `sync:toKey="fromKey"` 语法可以将当前页面/组件模块的 `fromKey` 属性与目标组件模块的 `toKey` 属性双向同步，任一方改动都会同步到另一方。
7. 使用 `class:className="fromKey"` 语法，当当前页面/组件模块的 `fromKey` 属性为 `true` 时，会将该类名添加到目标组件模块上；反之则移除。
8. 使用 `attr:toKey="fromKey"` 语法可以将当前页面/组件模块的 `fromKey` 属性传递给目标组件模块的 `toKey` 属性（attributes property）；如果为 null，则移除该属性。
9. `<slot></slot>` 标签用于定义组件的插槽，其他组件可以将内容插入到插槽中；也可以给 slot 添加 name 属性，与 Web Component 的命名插槽一致。
10. 组件或页面模块可以使用 `this.emit("eventName", options)` 方法触发自定义事件，其中 `options` 为参数对象，可使用：
    - `options.data`：添加自定义事件数据。
    - `options.bubbles`：事件是否冒泡，默认为 `true`。
    - `options.composed`：事件是否穿透 Shadow DOM 边界，默认为 `false`。
    - 其他参数参考原生 Event 参数，如 `cancelable` 等。
11. 上层的模块可以通过 `on:eventName="handler"` 语法，监听目标组件模块的自定义事件。