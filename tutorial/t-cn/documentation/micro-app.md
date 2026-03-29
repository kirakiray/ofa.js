# 微應用



使用 `o-app` 進行應用化，這個標籤就代錶著一個微應用，牠會加載 `app-config.js` 配置文件，該文件定義瞭應用的首頁地址和頁面切換動畫配置。

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// 應用首頁地址
export const home = "./home.html";

// 頁面切換動畫配置
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

<o-playground name="微應用示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 應用首頁地址
    export const home = "./home.html";
    // 頁面切換動畫配置
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

## home - 首頁地址



指定應用啓動時加載的首頁模塊路徑，支持相對路徑和絕對路徑。

```javascript
export const home = "./pages/home.html";
```

## pageAnime - 頁面切換動畫



控製頁面切換時的過渡動畫效菓，包含三個狀態：

| 狀態 | 說明 |
|------|------|
| `current` | 當前頁面動畫結束後的樣式 |
| `next` | 新頁面進入時的起始樣式 |
| `previous` | 舊頁面離開時的目標樣式 |

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

## 傳參方式



在 `o-app` 中，頁面跳轉支持通過 URL Query 傳遞參數，目標頁面通過模塊函數的 `query` 參數接收。

## 頁面導航



在 o-app 內，每個頁面模塊可以使用帶有 `olink` 屬性的 `<a>` 標籤進行頁面切換。這個標籤會觸發應用的路由切換，帶上過渡動畫，且不會刷新整個頁面。

```html
<a href="./about.html" olink>跳轉到關於頁面</a>
```

在頁面組件中，可以使用 `back()` 方法返迴上一頁：

```html
<template page>
  <button on:click="back()">返迴</button>
</template>
```