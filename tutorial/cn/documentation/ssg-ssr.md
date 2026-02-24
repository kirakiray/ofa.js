# SSG/SSR 与 同构渲染

## 网页渲染方式概述

现代网页应用主要有四种渲染方式：传统服务端模板引擎渲染、CSR（Client Side Rendering，客户端渲染）、SSG（Static Site Generation，静态站点生成）和 SSR（Server Side Rendering，服务器端渲染）。每种方式都有其优势和适用场景。

> 如果你不清楚什么是SSR，说明你目前还用不到它，可以跳过这章内容，等到将来有需要时再回过头来学习。

### 传统服务端模板引擎渲染

在早期的 Web 开发中，服务端模板引擎是最主要的页面渲染方式。Go、PHP 等后端语言通过内置或第三方模板引擎（如 Go 的 `html/template`、PHP 的 Smarty/Twig/Blade 等），将动态数据注入到 HTML 模板中，直接生成完整的 HTML 页面返回给客户端。

**优点：**
- SEO 友好，首屏加载快
- 开发简单，逻辑清晰
- 服务器端控制，安全性较高

**缺点：**
- 用户体验较差，每次交互都需要页面刷新
- 服务端压力大
- 前后端耦合度高，不利于分工协作

### CSR（客户端渲染）

在 CSR 模式下，页面内容完全由浏览器端 JavaScript 渲染，ofa.js 的[全局路由化](./routes.md)就是典型的 CSR 实现。这种方式提供了流畅的用户体验，无需页面跳转即可完成所有交互。使用 React 或 Vue 配合其对应的路由库（如 React Router 或 Vue Router）开发的单页应用（SPA），都是典型的 CSR 实现。

**优点：**
- 用户体验流畅，页面切换无刷新
- 客户端处理能力强，响应迅速

**缺点：**
- 不利于 SEO，搜索引擎难以索引内容

### SSG（静态站点生成）

在构建阶段将所有页面预先渲染为静态 HTML 文件，部署后可直接由服务器返回给用户。

**优点：**
- 首次加载速度快，SEO 友好
- 服务器负载低，性能稳定
- 安全性高

**缺点：**
- 动态内容更新困难
- 构建时间随页面数量增加而增长

### SSR（服务器端渲染）

用户请求页面时，服务器动态渲染页面内容并返回给用户。

**优点：**
- SEO 友好，首屏加载快
- 支持动态内容

**缺点：**
- 服务器压力大
- 仍需后续客户端激活才能实现完整交互

## 同构渲染

为了结合 CSR 的良好用户体验和 SSR/SSG 的 SEO 优势，ofa.js 提供了独特的同构渲染（Symphony Client-Server Rendering）模式。

同构渲染的核心理念是：
- 在服务端渲染初始页面内容，确保 SEO 和首屏加载速度
- 在客户端接管路由处理，保持 CSR 的流畅用户体验
- 适用于任何服务端环境，实现真正的同构渲染

### 同构渲染实现原理

ofa.js 的 同构渲染模式基于以下机制：

1. 服务端生成带有通用运行结构的完整 HTML 页面
2. 客户端加载 CSR 运行引擎
3. 自动识别当前运行环境，决定渲染策略

### 同构渲染代码结构

**原始 CSR 页面模块：**

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

**同构渲染封装后的完整页面：**

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
    <!-- 页面模块内容插入位置 ⬇️ -->
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

所以，你可以使用任意的开发语言（Go、Java、PHP、Python 等），任意的后端模板渲染引擎（如 Go 的 `html/template`、PHP 的 Smarty/Twig/Blade 等），将 ofa.js 的同构渲染代码结构嵌入到模板中，就能实现 SSR。

### 同构渲染模板结构

要实现 同构渲染模式，只需在服务端使用以下通用模板结构：

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
    <!-- 动态插入对应的页面模块内容 -->
  </o-app>
</body>

</html>
```

**注意：** 服务端返回的 HTML 必须设置正确的 HTTP 头部：`Content-Type: text/html; charset=UTF-8`

`scsr.mjs` 是 ofa.js 提供的 同构渲染运行引擎，它会根据当前页面的运行状态自动判断渲染策略，确保在任何环境下都能提供最佳的用户体验。

同样的，SSG 也可以套用这个结构实现静态站点生成。

## ofa.js 和 SSR 和其他前端框架的差异

ofa.js 的 Symphony Client-Server Rendering 本质上也是 SSR 模式，它和现有 Vue 和 React Angular 可实现SSR对比，有个最大优势，是不需要强制绑定 Node.js。任意的后端模板渲染引擎，都能使用 ofa.js 实现 SSR。