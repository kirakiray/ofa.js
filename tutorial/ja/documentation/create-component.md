# コンポーネントの作成

ofa.jsにおいて、コンポーネントはページの再利用とモジュール化を実現するための中核的なメカニズムです。コンポーネントは本質的にはカスタムWeb Componentであり、テンプレート、スタイル、ロジックを定義することで、再利用可能なUI要素を作成できます。

## コンポーネントの基本構造

ページモジュールとは異なり、コンポーネントモジュールの `<template>` 要素は `component` 属性を使用し、`tag` 属性を宣言してコンポーネントのタグ名を指定します。

コンポーネントを使用する必要がある場所では、`l-m` タグを使用してコンポーネントモジュールを非同期にロードします。システムは自動的に登録を完了します。その後、通常のHTMLタグのように直接そのコンポーネントを使用できます。

<o-playground name="コンポーネント基本例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS コンポーネント例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## コンポーネントの核心概念

### tag - コンポーネントタグ名

`tag` はコンポーネントのタグ名であり、**必ずコンポーネントの使用タグ名と一致させる必要がある**。例えば、コンポーネントの `tag` を `"demo-comp"` と定義した場合、HTML で使用する際は必ず `<demo-comp></demo-comp>` と記述しなければならない。

### コンポーネントモジュールの参照

`l-m` タグを使用してコンポーネントモジュールを導入すると、コンポーネントモジュールは自動的にコンポーネントを登録します。これは `script` タグを使用してスクリプトを導入するのと似ていますが、`l-m` は特にコンポーネントモジュールのロードと登録に使用されます。

> 注意：`l-m` 参照タグは**非同期参照**であり、ページ読み込み時に必要に応じてコンポーネントを読み込むのに適しています。

## 同期参照コンポーネント

特定のシナリオでは、コンポーネントを同期的にロードする必要があるかもしれません（例えば、コンポーネントが使用される前に登録が完了していることを保証する場合）。この場合、`load` メソッドと `await` キーワードを組み合わせて、同期的な参照を実現できます。

コンポーネントモジュールとページモジュールでは、開発者が必要なリソースを同期的に読み込むための `load` 関数が自動的に注入されます。

<o-playground name="同期参照コンポーネントの例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS コンポーネントの例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 非同期参照 vs 同期参照

| 引用方式 | 关键词 | 特徴 |
|---------|-------|------|
| 非同期参照 | `l-m` タグ | ノンブロッキングロード、オンデマンドコンポーネントのロードに適している |
| 同期参照 | `load` メソッドと `await` キーワードの組み合わせ | ブロッキングロード、コンポーネントの使用前に登録されていることを保証する |`l-m`タグの参照と`load`メソッドはどちらもコンポーネントモジュールをロードできますが、一般的には`l-m`タグを使った非同期参照を推奨します。これにより、ノンブロッキングロードとオンデマンドロードが実現されます。