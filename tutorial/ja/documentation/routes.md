# シングルページアプリケーション

シングルページアプリケーションは、`o-app`コンポーネントをブラウザのアドレスバーにバインディングし、WebページのURLとアプリ内のページパスを同期させます。シングルページアプリケーションを有効にすると：

- ウェブページを更新しても現在のルーティング状態が維持される
- アドレスバーのURLをコピーして別のブラウザやタブで開いても、アプリケーションの状態を復元できる
- ブラウザの進む/戻るボタンが正常に動作する

## 基本的な使い方

公式の `o-router` コンポーネントで `o-app` コンポーネントを囲むだけで、シングルページアプリケーションが実現できます。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ルーター テスト</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body 属性

`fix-body` 属性を追加すると、`o-router` は自動的に `html` と `body` のスタイルをリセットし、デフォルトの margin と padding を削除します。

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

これは以下のシナリオで特に便利です：- `o-app`がビューポートを完全に埋める必要がある
- アプリケーションがページの唯一のコンテンツである場合

## 例

<o-playground name="シングルページアプリケーションの例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // アプリケーションのホームアドレス
    export const home = "./home.html";
    // ページ切り替えアニメーションの設定
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
      <a href="./about.html" olink>Aboutへ移動</a>
      <br>
      <br>
      <button on:click="gotoAbout">Aboutボタンへ移動</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "こんにちは ofa.js アプリデモ",
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
      <div style="padding: 8px;"> <button on:click="back()">戻る</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "こんにちは ofa.js アプリデモ",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 動作原理

シングルページアプリケーションはブラウザのハッシュモードに基づいて実装：

1. アプリ内でページが切り替わると、`o-router` は自動的にアドレスバーのハッシュ値を更新します（例：`#/about.html`）
2. ユーザーがページを更新したり URL でアクセスしたりすると、`o-router` はハッシュ値を読み取り、対応するページを読み込みます
3. ブラウザの進む／戻るボタンはハッシュの変化をトリガーし、アプリのページナビゲーションを制御します

## URL 変化の例

アプリケーションに `home.html` と `about.html` という2つのページがあると仮定します：

| ユーザー操作 | アドレスバーの変化 |
|---------|-----------|
| アプリを開く | `index.html` → `index.html#/home.html` |
| Aboutページに移動 | `index.html#/home.html` → `index.html#/about.html` |
| 戻るをクリック | `index.html#/about.html` → `index.html#/home.html` |
| ページを更新 | 現在のhashを維持 |## 使用制限

- シングルページアプリケーションは、**1つ**の `o-app` コンポーネントとのみ連携して使用できます