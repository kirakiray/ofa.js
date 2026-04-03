# ofa.js 使用教程

ofa.js 是一个Web前端框架；它是：

- 可以直接运行在浏览器上，不依赖nodejs webpack 和 npm 的环境
- 一个基于Web Components的前端框架
- 拥有和Vue、React 等框架类似的语法糖
- 一个渐进式微前端框架，从简单使用到复杂的微前端应用，都能使用它来开发
- 更适合AI使用的前端框架

## 如何使用 ofa.js

### 引用

只需要在html内直接引入ofa.js的js文件，即可开始使用ofa.js

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

### 开始使用页面模块

可以创建一个**页面模块**进行简单的使用，它提供和现代框架一个的类似的模板语法糖来开发。

```html
<!-- demo.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Page Module Usage</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./page1.html"></o-page>
  </body>
</html>
```

```html
<!-- page1.html -->
<template page>
  <style>
    :host {
      display: block;
      color: blue;
    }
  </style>
  <h2>Hello World</h2>
</template>
```

当引用 ofa.js 文件成功后，可以在全局使用 `o-page`  组件来加载页面模块；通过 `src` 属性指向页面模块的地址。

通过 `<template page>` 来定义页面模块，放在 `html` 文件内。

其中 `:host` 用于定义当前 page 组件的样式，可以参考 Web Components 的样式选择器 [:host](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/:host)。

所以上面的案例，你可以得到一个蓝色的 Hello World 展示。

## 模板语法

在**页面模块**内，可以使用各种各样的模板语法糖来开发，让你像使用Vue和React一样，降低难度，开发各种需求。

### 文本渲染

```html
<!-- demo.html -->
<!-- 只保留改动代码，其他html的内容省略，参考最上面的案例 -->
<o-page src="./page2.html"></o-page>
```

``html
<!-- page2.html -->
<template page>
  <style>
    :host {
      display: block;
      color: Green;
    }
  </style>
  <h2>{{val}}</h2>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello World",
        },
      };
    };
  </script>
</template>
```

通过在 template 内创建 `script` 标签，内容 `export default` 返回异步函数，并返回一个对象，定义当前**页面模块**的参数。

其中 **data** 用于定义当前页面的数据。

通过在节点使用 `{{key}}` 来直接渲染 `data` 数据到为文本到节点上。

### 绑定事件

通过在 `proto` 上设置模块的方法，然后在模板节点上，使用 `on:xxx` 方法进行绑定。

例如：

```html
<!-- page3.html -->
<template page>
  <style>
    :host {
      display: block;
      color: Green;
    }
  </style>
  <h2>{{val}}</h2>
  <button on:click="handleButtonClick">Click me</button>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello World",
        },
        proto:{
          handleButtonClick(){
            this.val = "Hello ofa.js App Demo";
          }
        }
      };
    };
  </script>
</template>
```
