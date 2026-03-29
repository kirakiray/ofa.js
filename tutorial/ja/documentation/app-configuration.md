# アプリケーション設定

`app-config.js` 設定ファイルは、ホームページのアドレスとページ切り替えアニメーション以外にも、アプリケーションのロード状態、エラー処理、初期化ロジック、およびナビゲーション機能を制御するためのより多くの設定オプションをサポートしています。

```javascript
// app-config.js
// ロード中に表示する内容
export const loading = () => "<div>Loading...</div>";

// ページのロードに失敗した場合に表示するコンポーネント
export const fail = (src, error) => `<div>Failed to load: ${src}</div>`;

// アプリケーションの初期化完了後のコールバック
export const ready() {
  console.log("App is ready!");
}

// アプリケーションプロトタイプに追加するメソッドとプロパティ
export const proto = {
  customMethod() {
    console.log("Custom method called");
  },
};
```

<o-playground name="アプリ設定の例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // アプリのホームアドレス
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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
</o-playground>

## loading - 読み込み状態

ページ読み込み中に表示されるコンポーネント、文字列テンプレートまたはテンプレートを返す関数にすることができます。

```javascript
// シンプルな文字列テンプレート
export const loading = "<div class='loading'>Loading...</div>";

// 関数を使って動的に生成
export const loading = () => {
  return `<div class='loading'>
    <span>読み込み中...</span>
  </div>`;
};
```

以下は、美しくプロジェクトに直接コピーして使用できるローディング実装です：

```javascript
export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });

  setTimeout(() => (loadingEl[0].style.width = "98%"));

  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      $.fn.remove.call(loadingEl);
    }, 200);
  };

  return loadingEl;
};
```

## fail - エラー処理

ページの読み込みに失敗したときに表示されるコンポーネントで、関数は `src`（失敗したページのアドレス）と `error`（エラーメッセージ）を含むオブジェクトパラメータを受け取ります。

```javascript
export const fail = ({src, error}) => {
  return `<div class='error'>
    <p>ページの読み込みに失敗しました</p>
    <p>アドレス: ${src}</p>
    <button on:click="back()">戻る</button>
  </div>`;
};
```

## proto - プロトタイプ拡張

アプリケーションインスタンスにカスタムメソッドや計算プロパティを追加し、これらのメソッドはページコンポーネント内で `this.app` を通じてアクセスできます。

```javascript
export const proto = {
  // カスタムメソッド
  navigateToHome() {
    this.goto("home.html");
  },
  // 算出プロパティ
  get isAtHome() {
    return this.current?.src.includes("home.html");
  },
};
```

ページ内で呼び出す：

```html
<template page>
  <button on:click="app.navigateToHome()">ホームページに戻る</button>
  <p>ホームページにいるか: {{app.isAtHome}}</p>
</template>
```

## ready - 初期化コールバック

アプリケーション設定の読み込み完了後に実行されるコールバック関数。ここで初期化操作を行うことができます。`this` を通じてアプリケーションインスタンスのメソッドとプロパティにアクセスできます。

```javascript
export const ready() {
  console.log("アプリケーションが初期化されました");
  // this にアクセス可能（o-app 要素インスタンス）
  console.log(this.current); // 現在のページ o-page 要素インスタンスを取得
  // this.someMethod();
}
```

## allowForward - 前進機能

ブラウザの前進機能を有効にするかどうかを制御します。`true` に設定すると、ブラウザの戻るボタンと進むボタンを使用してナビゲーションできます。

```javascript
export const allowForward = true;
```

有効にすると、ユーザーはブラウザの前進/後退ボタンを使用してナビゲーションでき、アプリケーションのナビゲーションメソッド `forward()` も有効になります。

## プログラミングによるナビゲーション

`olink` を使用する以外に、JavaScript でナビゲーションメソッドを呼び出すこともできます：

```javascript
// 指定ページへジャンプ（履歴に追加）
this.goto("./about.html");

// 現在のページを置換（履歴に追加しない）
this.replace("./about.html");

// 前のページに戻る
this.back();

// 次のページに進む（allowForward: trueの設定が必要）
this.forward();
```

## ルーティング履歴

`routers` プロパティを使用すると、閲覧履歴を取得できます：

```javascript
// すべてのルーティング履歴を取得
const history = app.routers;
// 返却形式: [{ src: "./page1.html" }, { src: "./page2.html" }, ...]

// 現在のページを取得
const currentPage = app.current;
```

## ルートの変更を監視する

`router-change` イベントを監視することで、ルート変更に応答できます：

```javascript
app.on("router-change", (e) => {
  const { data } = e;
  console.log("ルート変更:", data.name); // goto, replace, forward, back
  console.log("ページアドレス:", data.src);
});
```