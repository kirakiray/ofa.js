# クイックスタート

このセクションでは、ofa.js を使い始めるための早わかり方法を紹介します。以降のチュートリアルでは、index.html エントリーファイルの作成手順を省略し、ページモジュールファイルのコードのみを示します。テンプレートをベースに直接開発を進めることができます。

## 基本ファイルの準備

ofa.js を素早く使い始めるには、**ページモジュール**を作成し、エントリー HTML と組み合わせるだけで、必要なコアファイルは以下の通りです：

- `index.html`: アプリケーションのエントリーファイルで、ofa.jsフレームワークのロードとページモジュールのインポートを担当します
- `demo-page.html`: ページモジュールファイルで、ページの具体的な内容、スタイル、データロジックを定義します

### index.html（アプリケーションエントリ）

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js サンプル</title>
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

当該ファイルの主な役割は：- ofa.jsフレームワークの導入
- `<o-page>`コンポーネントを使用してページモジュールを読み込み、レンダリングする

### demo-page.html（ページモジュール）

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
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

このファイルは、以下を含むシンプルなページコンポーネントを定義しています：- `<template page>` タグ、ページモジュールを定義
- CSSスタイル（Shadow DOMの `:host` セレクタを使用）
- データバインディング式 `{{val}}`
- JavaScriptロジック、初期データを含むオブジェクトを返す


## オンラインデモ

以下はオンラインエディタでのリアルタイムサンプルです。コードを直接修正して効果を確認できます：

<o-playground name="オンラインデモ" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
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

コンポーネント内部の `<style>` タグを通じてスタイルを定義します。これらの内部スタイルはコンポーネント内部にのみ作用し、優れたカプセル化を実現し、ページ内の他の要素に影響を与えません。

`:host` セレクターはコンポーネントのホスト要素のスタイルを定義するために使われ、ここではコンポーネントをブロックレベル要素に設定し、赤い枠線と 10px のパディングを追加します。

`{{key}}` 式を使用すると、コンポーネントデータ内の対応する値をページにレンダリングできます。

これで最初の ofa.js アプリケーションを正常に作成できました！次に、ofa.js のテンプレートレンダリング構文とその高度な機能について詳しく見ていきましょう。