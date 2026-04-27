# マイクロアプリ

`o-app` を使用してアプリケーション化します。このタグはマイクロアプリケーションを表し、`app-config.js` 設定ファイルを読み込みます。このファイルはアプリケーションのホームページアドレスとページ切り替えアニメーション設定を定義します。

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// アプリケーションのホームページアドレス
export const home = "./home.html";

// ページ切り替えアニメーション設定
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

<o-playground name="マイクロアプリケーション例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリケーションのホームページアドレス
    export const home = "./home.html";
    // ページ遷移アニメーション設定
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
      <div style="padding: 8px;"> <button on:click="back()">戻る</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a>について</p>
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

## home - トップページアドレス

指定应用启动时加载的首页模块路径，支持相对路径和绝对路径。
アプリケーション起動時に読み込むトップページモジュールのパスを指定します。相対パスと絶対パスをサポートします。

```javascript
export const home = "./pages/home.html";
```

## pageAnime - ページ切り替えアニメーション

ページ切り替え時のトランジションアニメーション効果を制御し、3つの状態を含みます：

| 状態 | 説明 |
|------|------|
| `current` | 現在のページのアニメーション終了後のスタイル |
| `next` | 新しいページが入ってくる際の開始スタイル |
| `previous` | 古いページが離れる際の目標スタイル |```javascript
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

## パラメータの渡し方

在 `o-app` 内では、ページ遷移は URL Query を介してパラメータを渡すことをサポートし、ターゲットページはモジュール関数の `query` パラメータで受け取ります。

## ページナビゲーション

o-app内では、各ページモジュールは `olink` 属性を持つ `<a>` タグを使用してページ切り替えを行うことができます。このタグはアプリのルート切り替えをトリガーし、トランジションアニメーションを伴い、ページ全体をリフレッシュしません。

```html
<a href="./about.html" olink>概要ページにジャンプ</a>
```

ページコンポーネントでは、 `back()` メソッドを使って前のページに戻ることができます：

```html
<template page>
  <button on:click="back()">戻る</button>
</template>
```