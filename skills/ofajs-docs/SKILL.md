# ofa.js 文档知识库

本知识库包含 ofa.js 框架的完整文档，涵盖从入门到高级应用的各个方面。

## 文档索引

### 介绍

- [介绍](./references/introduction.md)：ofa.js 框架的核心概念、设计初衷和主要优势，包括零门槛使用、AI 友好特性和微前端原生支持。

### 快速参考

- [快速参考表](./references/cheat-sheet.md)：ofa.js 核心 API 和语法的速查表，包括模板语法、生命周期、数据管理等。
- [API 参考手册](./references/api.md)：ofa.js独立使用的 API 文档，包括实例方法、节点操作、属性操作、事件处理等。
- [常见模式与最佳实践](./references/patterns.md)：汇总常用代码模式和最佳实践，包括表单处理、列表操作、组件通信、性能优化等。

### 开始使用

- [脚本引用](./references/script-reference.md)：如何通过 script 标签和 ESM 模块引入 ofa.js，包括调试模式的启用方法。
- [创建第一个应用](./references/create-first-app.md)：使用 OFA Studio 在浏览器中快速创建本地应用项目。

### 快速上手

- [快速上手](./references/quick-start.md)：创建基础文件结构，包括入口文件和页面模块，了解样式封装和数据绑定。

### 模板语法

- [内容渲染](./references/content-rendering.md)：使用 `{{变量名}}` 进行文本渲染，以及使用 `:html` 指令渲染 HTML 内容。
- [事件绑定](./references/event-binding.md)：使用 `on:事件名` 绑定事件处理器，支持参数传递和事件对象访问。
- [属性响应](./references/property-response.md)：响应式数据机制，包括嵌套对象响应和非响应式属性的使用。
- [属性绑定](./references/property-binding.md)：单向绑定 `:toKey="fromKey"` 和双向绑定 `sync:xxx` 的使用方法。
- [类和样式绑定](./references/class-style-binding.md)：动态绑定 CSS 类、样式属性和 HTML 属性，包括 `data()` 函数的使用。
- [条件渲染](./references/conditional-rendering.md)：使用 `o-if`、`o-else-if`、`o-else` 组件实现条件渲染。
- [列表渲染](./references/list-rendering.md)：使用 `o-fill` 组件进行列表渲染，支持直接渲染和模板渲染。
- [计算属性](./references/computed-properties.md)：使用 `get` 和 `set` 定义计算属性，实现派生数据和缓存。
- [侦听器](./references/watchers.md)：使用 `watch` 对象监听数据变化并执行相应逻辑。
- [生命周期](./references/lifecycle.md)：组件的生命周期钩子函数，包括 ready、attached、detached、loaded。

### 组件

- [创建组件](./references/create-component.md)：使用 `<template component>` 定义组件，通过 `l-m` 标签或 `load` 方法引用组件。
- [传递特征属性](./references/inherit-attributes.md)：通过 `attrs` 对象声明组件属性，使用 `attr:` 语法传递数据。
- [插槽](./references/slots.md)：使用 `<slot>` 定义插槽，支持默认插槽和命名插槽。
- [领悟属性绑定](./references/deep-property-binding.md)：属性绑定 `:` 与特征属性继承 `attr:` 的区别，以及双向数据绑定。
- [自定义事件](./references/custom-events.md)：使用 `emit` 方法触发自定义事件，支持冒泡和穿透 Shadow DOM。

### 应用和规模化

- [微应用](./references/micro-app.md)：使用 `o-app` 标签创建微应用，配置首页和页面切换动画。
- [应用配置和相关函数](./references/app-configuration.md)：应用配置选项，包括 loading、fail、proto、ready 等。
- [单页面应用](./references/routes.md)：使用 `o-router` 组件实现单页面应用，基于 Hash 模式。
- [嵌套页面/路由](./references/nested-routes.md)：父子层级页面结构，使用 `parent` 属性和 `<slot>` 插槽。
- [SSR](./references/ssr.md)：同构渲染模式，支持任意后端语言实现 SSR 和 SSG。

### 状态管理

- [什么是状态管理](./references/state-management.md)：使用 `$.stanz()` 创建响应式状态对象，实现跨组件数据共享。
- [上下文状态](./references/context-state.md)：使用 `o-provider` 和 `o-consumer` 实现跨层级组件通信。
- [样式查询](./references/match-var.md)：基于 CSS 变量的样式查询功能，实现条件样式渲染。

### 生产与部署

- [生产与部署](./references/build-app.md)：开发环境搭建、项目导出和压缩混淆的最佳实践。

### 其他组件

- [注入宿主样式](./references/inject-host-style.md)：使用 `<inject-host>` 组件向宿主元素注入样式，解决插槽内多层级元素样式问题。
- [非显式组件](./references/non-explicit-component.md)：`x-if`、`x-fill` 等非显式组件，不会渲染到 DOM 中但能实现条件渲染和列表渲染。
- [replace-temp 组件](./references/replace-template.md)：解决在 select、table 等特殊元素内使用列表渲染时浏览器自动修正的问题。
