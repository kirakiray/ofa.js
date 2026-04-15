# ofa.js 使用教程

ofa.js 是一个渐进式web微前端框架，它不依赖nodejs webpack 和 npm 的环境。

## 如何使用 ofa.js

只需要在html内直接引入ofa.js的js文件，即可开始使用ofa.js

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 页面模块案例

- [page.html](./references/01-start/page.html): 页面模块的定义文件，负责页面模块的逻辑和渲染。
- [demo.html](./references/01-start/demo.html): 引用页面模块的入口文件，负责加载 ofa.js 框架和页面模块。

### 案例说明

1. 页面模块使用 `<template page>` 标签定义，要渲染的元素都写在 `template` 内。
2. 模块逻辑写在 `template` 内的 `<script>` 内，通过 `export default` 函数返回对象，定义页面模块的数据和方法。有且只能存在一个 script 标签。
3. 数据和方法在 `data` 和 `proto` 中定义，分别对应页面模块的属性和方法。
4. 通过在节点使用 `{{key}}` 来直接渲染 `data` 数据到为文本到节点上。
5. 通过在 `proto` 上设置模块的方法，然后在模板节点上，使用 `on:xxx` 方法进行绑定，可用的事件参考 dom 事件。
6. 简单的函数计算，可以直接在模板上进行计算，例如 `num++`；上面案例的 `doubleNum` 也可以可改用 `{{num * 2}}`。
7. 可以在 `proto` 上定义计算属性，用 `get xxx` 关键字定义；和Vue不同，不是使用 `computed` 定义计算属性。
8. 模块内的样式写在 `template` 内的 `<style>` 内。若要定义模块元素自身样式，则使用 `:host` 选择器。可以参考更多关于 Web Component 的样式选择器。

## 组件模块案例

- [switch.html](./references/02-switch/switch.html) : 组件模块的定义文件，负责组件模块的逻辑和渲染。
- [page.html](./references/02-switch/page.html) : 使用这个组件的页面模块。
- [demo.html](./references/02-switch/demo.html) : 引用页面模块的入口文件。

### 案例说明

1. 组件模块使用 `<template component>` 标签定义，要渲染的元素都写在 `template` 内。
2. 基础逻辑和页面模块保持一致，只是返回的对象中，带有 `tag` 字段，用于定义组件的标签名。
3. 使用组件前需要使用 `<l-m>` 标签引入组件模块，`src` 属性为组件模块的路径。