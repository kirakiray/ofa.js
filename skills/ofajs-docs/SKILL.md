---
name: "ofajs-docs"
description: "ofa.js 框架教程。当用户询问 ofa.js 的使用方法、组件开发、页面模块，或想要构建无需 Node.js/Webpack 的 Web 应用时使用。"
---

# ofa.js 使用教程

ofa.js 是一个渐进式 Web 微前端框架，无需依赖 Node.js、Webpack 和 NPM 环境即可运行。

## 快速上手

在 HTML 中直接引入 ofa.js 的 JS 文件，即可开始使用：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 页面模块的使用案例

本案例展示一个简单的计数器页面，涵盖数据绑定、事件处理、计算属性和样式定义等基础用法。

### 资源地址

- [page.html](templates/01-start/page.html): 页面模块的定义文件，负责页面模块的逻辑和渲染。
- [demo.html](templates/01-start/demo.html): 引用页面模块的入口文件，负责加载 ofa.js 框架和页面模块。

### 案例说明

1. 页面模块使用 `<template page>` 标签定义，需要渲染的元素都写在 `template` 内，文件后缀为 `.html`。
2. 模块逻辑写在 `template` 内的 `<script>` 中，通过 `export default` 函数返回对象，以此定义页面模块的数据和方法。**有且只能存在一个 script 标签。**
3. 可以在 `export default` 函数中接收 `{ query }` 参数，用于获取 URL 查询参数。
4. 数据和方法在 `data` 和 `proto` 中定义，分别对应页面模块的属性和方法。
5. 通过在节点上使用 `{{key}}` 语法，直接将 `data` 中的数据渲染为文本。
6. 在 `proto` 上定义模块的方法后，可在模板节点上使用 `on:xxx` 进行事件绑定，可用事件参考 DOM 事件。
7. 简单的函数计算可以直接在模板上进行，例如 `num++`；上面案例中的 `doubleNum` 也可以改用 `{{num * 2}}`。
8. 在 `proto` 上可以使用 `get xxx` 关键字定义计算属性（与 Vue 不同，请不要使用 `computed`）。
9. 模块内的样式写在 `template` 内的 `<style>` 中。若要定义模块元素自身的样式，需使用 `:host` 选择器，可参考 Web Component 样式选择器。

## 组件模块的使用案例

本案例展示一个开关组件的实现，涵盖组件定义、属性传递、事件通信和插槽等核心功能。

### 资源地址

- [switch.html](templates/02-switch/switch.html): 组件模块的定义文件，负责组件模块的逻辑和渲染。
- [page.html](templates/02-switch/page.html): 使用该组件的页面模块。
- [demo.html](templates/02-switch/demo.html): 引用页面模块的入口文件。

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
11. 上层的模块可以通过 `on:eventName="handler"` 语法，监听目标组件模块的自定义事件；这个写法等同于 `on:eventName="handler($event)"`，会传递Event对象给handler函数。

## 列表渲染的使用案例

本案例展示一个 Todo List 的实现，涵盖列表渲染、条件渲染和响应式状态数据等用法。

### 资源地址

- [page.html](templates/03-todolist/page.html): Todo List 页面模块，包含列表渲染和条件渲染。
- [demo.html](templates/03-todolist/demo.html): 引用页面模块的入口文件。

### 案例说明

1. 使用 `o-fill` 组件进行列表渲染，`$data` 代表当前项的数据，`$index` 代表当前项的索引，`$host` 代表当前页面/组件模块的实例。
2. 使用 `o-if` / `o-else-if` / `o-else` 组件进行条件渲染，`:value="bool"` 为布尔值，用于判断是否渲染组件节点。
3. 通过 `$.stanz` 可以创建响应式状态数据，例如 `todos`。状态数据支持以下监听方式：
   - 使用 `watchTick` 监听数据变化，返回监听ID `wid`。
   - 使用 `watch` 同步监听数据变化（实时触发），返回监听ID `wid`。
   - 使用 `unwatch(wid)` 可以取消监听。
4. 在 `attached` 生命周期中将响应式状态数据赋值给当前模块，在 `detached` 生命周期中清空引用。
5. 使用了响应式状态数据后，需要在 `detached` 生命周期中取消监听，否则内存泄漏。
6. 页面模块和组件模块都可以使用这些特性。

## 路由与多级嵌套页面的使用案例

本案例展示一个完整的单页应用，涵盖 o-router 路由、多级嵌套页面、页面切换动画和路由监听等高级用法。

### 资源地址

- [demo.html](templates/05-routing/demo.html): 入口文件，使用 o-router 和 o-app 构建单页应用。
- [app-config.js](templates/05-routing/app-config.js): 应用配置文件，定义首页地址和页面切换动画。
- [layout.html](templates/05-routing/layout.html): 根布局页面，包含导航栏，通过 `<slot>` 渲染子页面。
- [home.html](templates/05-routing/home.html): 首页，嵌套在 layout.html 中。
- [list.html](templates/05-routing/list.html): 列表页面（一级子页面），包含二级嵌套的 Tab 切换。
- [list-page1.html](templates/05-routing/list-page1.html): 推荐商品列表（二级子页面）。
- [list-page2.html](templates/05-routing/list-page2.html): 热门商品列表（二级子页面）。
- [detail.html](templates/05-routing/detail.html): 详情页面，获取 URL 查询参数。

### 案例说明

1. 使用 `<o-router>` 包裹 `<o-app>` 构建单页应用。
2. `app-config.js` 配置文件通过 `export const home` 定义应用首页，通过 `export const pageAnime` 定义页面切换动画。
3. 父页面使用 `<slot></slot>` 标签预留子页面渲染位置，子页面通过 `export const parent` 指定父页面路径建立嵌套关系。
4. 如果要进行路由跳转，请在 a 标签中添加 olink 属性，例如 `<a href="./about.html" olink>About</a>`，支持浏览器前进/后退和 URL 同步。
5. 子页面可以通过 `{ query }` 参数获取 URL 查询参数，如 `export default async ({ query }) => {...}`。
6. 在页面模块中可通过 `routerChange` 生命周期和 `ready` 生命周期监听路由变化，刷新导航高亮等状态。
7. 多级嵌套：list.html 作为一级子页面，其下的 list-page1.html 和 list-page2.html 作为二级子页面嵌套在其中，形成两级嵌套结构。

## 上下文数据传递的使用案例

本案例展示一个文件管理器的实现，涵盖数据监听、跨层级数据同步、`o-provider`/`o-consumer` 上下文通信和递归列表渲染等高级用法。

### 资源地址

- [demo.html](templates/04-filelist/demo.html): 引用页面模块的入口文件。
- [page.html](templates/04-filelist/page.html): 入口主页面。
- [filelist.html](templates/04-filelist/filelist.html): 文件列表组件。
- [editor.html](templates/04-filelist/editor.html): 文件内容查看组件。
- [data.js](templates/04-filelist/data.js): 模拟数据和模拟获取数据的函数。

### 案例说明

1. 使用 `<o-provider name="providerName" sync:custom-name="selfKey">` 标签包裹子组件，通过 `sync:custom-name` 将当前模块的数据同步到上下文中。上下文的属性变化会自动通知到所有子组件。
2. `o-consumer` 组件会同步相同 name 的上层 `o-provider` 组件的属性变化（穿透 Shadow DOM 边界），再通过 `watch:custom-name` 监听将上下文属性变化同步到当前组件。
3. 相比事件冒泡和属性逐层传递，当涉及多层嵌套的数据同步时，使用 `o-provider` 和 `o-consumer` 可大幅提升开发效率。
4. 子组件中使用 `this.getProvider(providerName)` 获取上下文对象，直接修改 `custom-name` 上下文属性即可同步到其他子组件，无需逐层传递（记得修正驼峰命名）。
5. 在页面或组件模块的参数中添加 `watch` 对象，为需要监听的属性定义对应的监听函数。当属性值发生变化时，监听函数将自动触发。
6. `o-fill` 可通过 `name` 属性渲染指定名称的 `template`，该模板可递归渲染自身或其他 `name` 的模板，实现多级列表的嵌套渲染。
