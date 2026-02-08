# 快速上手

本节将介绍如何快速开始使用 ofa.js。在后续的教程中，我们将省略 index.html 入口文件的创建步骤，仅展示页面模块文件的代码。您可以直接基于模板进行开发。

## 准备基础文件

要开始使用 ofa.js，首先需要创建两个核心文件：一个作为应用程序入口的 HTML 文件和一个包含具体页面逻辑的模块文件。

- `index.html`: 应用程序的入口文件，负责加载 ofa.js 框架并引入页面模块
- `demo-page.html`: 页面模块文件，定义页面的具体内容、样式和数据逻辑

### index.html (应用入口)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 示例</title>
    <script
      src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

该文件的主要作用是：
- 引入 ofa.js 框架
- 使用 `<o-page>` 组件加载并渲染页面模块

### demo-page.html (页面模块)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

该文件定义了一个简单的页面组件，包含：
- CSS 样式（使用 Shadow DOM 的 `:host` 选择器）
- 数据绑定表达式 `{{val}}`
- JavaScript 逻辑，返回包含初始数据的对象


## 在线演示

以下是在线编辑器中的实时示例，您可以直接修改代码并查看效果：

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

现在您已经成功创建了第一个 ofa.js 应用！接下来，让我们深入了解 ofa.js 的模板渲染语法及其高级特性。