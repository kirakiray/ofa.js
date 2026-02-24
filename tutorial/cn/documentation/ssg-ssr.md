# SSG/SSR 与 同构渲染

## 网页渲染方式概述

现代网页应用有三种主要的渲染方式：CSR（Client Side Rendering，客户端渲染）、SSG（Static Site Generation，静态站点生成）和 SSR（Server Side Rendering，服务器端渲染）。每种方式都有其优势和适用场景。

> 如果你不清楚什么是SSR，说明你目前还用不到它，可以跳过这章内容，等到将来有需要时再回过头来学习。

### CSR（客户端渲染）

传统的 CSR 模式下，页面内容完全由浏览器端 JavaScript 渲染，ofa.js 的[全局路由化](./routes.md)就是典型的 CSR 实现。这种方式提供了流畅的用户体验，无需页面跳转即可完成所有交互。

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

为了结合 CSR 的良好用户体验和 SSR/SSG 的 SEO 优势，ofa.js 提供了独特的**同构渲染**模式。

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
