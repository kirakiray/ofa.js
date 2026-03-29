# マイクロアプリケーション

`o-app` を使用してアプリ化を行います。このタグはマイクロアプリを表しており、`app-config.js` 設定ファイルをロードします。このファイルは、アプリのトップページのアドレスとページ遷移アニメーションの設定を定義しています。

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
      <a href="./about.html?id=10010" olink>Aboutへ (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Aboutへ (10030)</a>
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

## home - ホームページアドレス

アプリケーション起動時に読み込まれるホームページモジュールのパスを指定し、相対パスと絶対パスの両方に対応します。

```javascript
export const home = "./pages/home.html";
```

## pageAnime - ページ切り替えアニメーション

ページ切り替え時のトランジションアニメーション効果を制御し、3つの状態を含む：

| 状態 | 説明 |
|------|------|
| `current` | 現在のページのアニメーション終了後のスタイル |
| `next` | 新しいページが入場する際の開始スタイル |
| `previous` | 古いページが退場する際の目標スタイル |```javascript
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

## 引数の渡し方

`o-app` では、ページ遷移時に URL クエリを介してパラメータを渡すことがサポートされており、対象ページはモジュール関数の `query` パラメータで受け取ります。

## ページナビゲーション

o-app内では、各ページモジュールは`olink`属性を持つ`<a>`タグを使ってページ遷移を行う。このタグはアプリのルーティング遷移をトリガーし、トランジションアニメーションを伴い、ページ全体をリフレッシュしない。

```html
<a href="./about.html" olink>アバウトページへ移動</a>
```

ページコンポーネントでは、`back()` メソッドを使用して前のページに戻ることができます：

```html
<template page>
  <button on:click="back()">戻る</button>
</template>
```