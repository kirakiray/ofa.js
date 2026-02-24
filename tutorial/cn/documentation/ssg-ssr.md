# SSG/SSR

普通的网页通过页面跳转来实现逻辑交互，这种体验相对割裂。为了解决这个问题，纯前端应用应运而生——它无需跳转页面即可完成所有交互，这就是 CSR（Client Side Rendering，客户端渲染）。ofa.js 提供的[全局路由化](./routes.md)就是典型的 CSR 模式。

然而，CSR 存在一个明显的缺点：无法被搜索引擎索引，这会导致网站在搜索结果中的排名下降。

SSG（Static Site Generation，静态站点生成）是指在构建阶段将所有页面渲染为静态 HTML 文件，这些文件可以直接由服务器返回给用户。

SSR（Server Side Rendering，服务器端渲染）则是指在用户请求页面时，服务器动态渲染页面并返回给用户。

在使用服务端编写页面时，通常会用到服务端模板引擎。路由跳转时会导致页面刷新，用户体验相较于纯前端的 CSR 模式逊色不少。

此外，由于网络机器人和爬虫无法识别纯前端应用的路由，导致搜索引擎无法索引应用内容，从而影响搜索引擎排名。

ofa.js 提供了一种特殊的路由模式——SCSR（Server Client Side Rendering，服务端客户端渲染）。它是指在服务端渲染页面，同时在客户端进行路由处理，从而在任何服务端环境下都能获得与 CSR 相同用户体验。

## SCSR 路由模式

ofa.js 的 SCSR 模式本质与 CSR 相同，区别在于将页面内容外部包裹一层通用运行结构代码，使所有页面都能独立加载 CSR 运行引擎，同时解析对应地址的页面模块内容。

例如，CSR 模式下的页面模块内容如下：

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

公共的包裹后的代码如下：

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/libs/scsr/dist/scsr.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 原本的页面模块内容填充区域⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

其中，`scsr.mjs` 是 ofa.js 提供的 SCSR 路由模式运行引擎。借助这个运行库，它会自动根据当前页面的前端运行状态，判断当前是否已经处于运行环境。

因此，原则上只需使用任意服务端环境、模板引擎，外部包裹一层通用运行结构代码，然后返回 HTML 内容（且 HTTP 头部必须包含 `Content-Type: text/html; charset=UTF-8`），即可实现 SCSR 模式。

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/libs/scsr/dist/scsr.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 这里为填充的代码 -->
  </o-app>
</body>

</html>
```