# 微应用

使用 `o-app` 进行应用化，这个标签就代表着一个微应用，它会加载 `app-config.js` 配置文件，该文件定义了应用的首页地址和页面切换动画配置。

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// 应用首页地址
export const home = "./home.html";

// 页面切换动画配置
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

<o-playground name="微应用示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    // 页面切换动画配置
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - 首页地址

指定应用启动时加载的首页模块路径，支持相对路径和绝对路径。

```javascript
export const home = "./pages/home.html";
```

## pageAnime - 页面切换动画

控制页面切换时的过渡动画效果，包含三个状态：

| 状态 | 说明 |
|------|------|
| `current` | 当前页面动画结束后的样式 |
| `next` | 新页面进入时的起始样式 |
| `previous` | 旧页面离开时的目标样式 |

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## 传参方式

在 `o-app` 中，页面跳转支持通过 URL Query 传递参数，目标页面通过模块函数的 `query` 参数接收。

## 页面导航

在 o-app 内，每个页面模块可以使用带有 `olink` 属性的 `<a>` 标签进行页面切换。这个标签会触发应用的路由切换，带上过渡动画，且不会刷新整个页面。

```html
<a href="./about.html" olink>跳转到关于页面</a>
```

在页面组件中，可以使用 `back()` 方法返回上一页：

```html
<template page>
  <button on:click="back()">返回</button>
</template>
```