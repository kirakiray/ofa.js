# ofa.js 使用教程

ofa.js 是一个渐进式web微前端框架，它不依赖nodejs webpack 和 npm 的环境。

## 如何使用 ofa.js

只需要在html内直接引入ofa.js的js文件，即可开始使用ofa.js

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 页面模块参考

- [page.html](./references/01-start/page.html): 页面模块的定义文件，负责页面模块的逻辑和渲染。
- [demo.html](./references/01-start/demo.html): 引用页面模块的入口文件，负责加载 ofa.js 框架和页面模块。

### 案例说明

1. 页面模块使用 `<template page>` 标签定义，要渲染的元素都写在 `template` 内，文件后缀为 `.html` 。
2. 模块逻辑写在 `template` 内的 `<script>` 内，通过 `export default` 函数返回对象，定义页面模块的数据和方法。有且只能存在一个 script 标签。
3. 可以在 `export default` 函数中，接收 `{ query }` 参数，用于获取 URL 查询参数。
4. 数据和方法在 `data` 和 `proto` 中定义，分别对应页面模块的属性和方法。
5. 通过在节点使用 `{{key}}` 来直接渲染 `data` 数据到为文本到节点上。
6. 通过在 `proto` 上设置模块的方法，然后在模板节点上，使用 `on:xxx` 方法进行绑定，可用的事件参考 dom 事件。
7. 简单的函数计算，可以直接在模板上进行计算，例如 `num++`；上面案例的 `doubleNum` 也可以可改用 `{{num * 2}}`。
8. 可以在 `proto` 上定义计算属性，用 `get xxx` 关键字定义；和Vue不同，不是使用 `computed` 定义计算属性。
9. 模块内的样式写在 `template` 内的 `<style>` 内。若要定义模块元素自身样式，则使用 `:host` 选择器。可以参考更多关于 Web Component 的样式选择器。

## 组件模块参考

- [switch.html](./references/02-switch/switch.html) : 组件模块的定义文件，负责组件模块的逻辑和渲染。
- [page.html](./references/02-switch/page.html) : 使用这个组件的页面模块。
- [demo.html](./references/02-switch/demo.html) : 引用页面模块的入口文件。

### 案例说明

1. 组件模块使用 `<template component>` 标签定义，要渲染的元素都写在 `template` 内。
2. 基础逻辑和页面模块保持一致，只是返回的对象中，带有 `tag` 字段，用于定义组件的标签名。还有不能使用 `query` 参数。
3. 使用组件前需要使用 `<l-m>` 标签引入组件模块，`src` 属性为组件模块的路径。引用后，组件模块的标签名即可在模板中使用。
4. 组件模块可以使用 `attrs` 定义属性默认值，定义的值会实际渲染到组件的 `attributes` 上；通过 attrs 传递的属性，会默认转为字符串；`attrs` 和 `data` 的key不能重复。
5. 通过 `:tokey="fromkey"` 语法将当前页面/组件模块的`fromkey`属性，单向传递给组件模块的`tokey`属性，上层模块改动后会同步更新组件模块的属性值。
6. 使用 `sync:fromKey="toKey"` 语法将当前页面/组件模块的`fromKey`属性 和组件模块的`toKey`属性同步起来，两边谁改动了，另一边也会被设置同样的值。
7. `class:xxx` 语法将当前页面/组件模块的`xxx`属性，如果为`true`，则添加到组件的类名中；反之移除组件的类名。
8. `attr:fromKey="toKey"` 语法将当前页面/组件模块的`fromKey`属性，传递给组件的`toKey` (attributes property)。
9. `<slot></slot>` 标签用于定义组件的插槽，其他组件可以将内容插入到插槽中；也可以给 slot 添加name属性，和 web component 插槽的 name 属性一致。
10. 组件或页面模块可以使用 `this.emit("eventName", options)` 方法触发自定义事件，`eventName` 事件名，其中`options` 为参数对象，可使用: 
   - `options.data` 事件数据。
   - `options.bubbles` 事件是否冒泡，默认为 `true`。
   - `options.composed` 事件是否穿透 Shadow DOM 边界，默认为 `false`。
   - 还有其他事件参数参考原生Event参数，例如 `cancelable` 等。
