# 属性バインディングの理解

前の内容では、[属性バインディング](./property-binding.md)の基本的な使い方についてすでに初步的に紹介しました。前のケースでは、ブラウザのネイティブ要素（例： `textarea`）の `value` 属性をバインドするものでしたが、本節では属性バインディングの本質を深く探ります——それは実際にはコンポーネントインスタンス化後の JavaScript プロパティにバインドされるものであり、HTML 属性ではありません。

## コンポーネントプロパティバインディングメカニズム

ofa.jsにおいて、親コンポーネントで`:toProp="fromProp"`構文を使用する場合、私たちは子コンポーネントインスタンスのJavaScriptプロパティを設定しており、HTML属性を設定しているわけではありません。これは、HTML属性（例：`attr:toKey="fromKey"`）を直接設定するのとは重要な違いがあります。

以下の例は、属性バインディングを通じてカスタムコンポーネントにデータを渡す方法を示しています：

<o-playground name="属性バインディングを理解する" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>フルネーム: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

この例では：- 親コンポーネントの `val` データが子コンポーネント `<demo-comp>` の `fullName` プロパティにバインドされる
- `:full-name="val"` という構文を使って親コンポーネントの `val` 値を子コンポーネントの `fullName` プロパティに渡す
- 子コンポーネントはその値を受け取った後、テンプレート内で `{{fullName}}` によって表示する

## 属性バインディング vs 特徴プロパティ継承

需要注意的是，属性绑定（`:`）与特征属性继承（`attr:`）有以下关键差异：

### 属性バインディング (`:`)

- コンポーネントインスタンスにバインドされる JavaScript プロパティ
- 渡されるデータは元の型（文字列、数値、ブール値など）を保持する
- コンポーネント内部で直接アクセスおよび変更可能で、コンポーネント内部で事前に `data` を定義する必要さえない

### 特徴属性の継承 (`attr:`)

- HTML属性を設定する
- すべての値は文字列に変換される
- 主に下層のDOM要素へ属性を渡すために使う
- 複雑なデータを解釈するには特別な処理が必要
- 属性値を受け取るには、あらかじめコンポーネント内部で `attrs` を定義しておく必要がある

文法対比：```html
<!-- 属性バインディング：JavaScriptの値を渡し、データ型を保持 -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- 属性継承：HTML属性を設定し、すべての値を文字列に変換 -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- 実際には文字列 "42" が渡される -->
```

## 事例対比差異

<o-playground name="ケース比較差分" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

ここで、`vone` はコンポーネントインスタンスのプロパティであり、`vtwo` は HTML の attribute プロパティです。attribute プロパティの値は `[vtwo]` セレクタによって選択され、スタイルが適用されます。一方、`vone` はコンポーネントインスタンスのプロパティであり、`[vone]` セレクタによって選択されることはありません。

## 双方向データバインディング

インスタンス化されたコンポーネントも、双方向データバインディングをサポートしており、`sync:toProp="fromProp"` という構文を使用します。双方向バインディングは、親コンポーネントと子コンポーネント間でデータを同期させ、いずれかの側のデータが変更されると、もう一方もそれに応じて更新されます。

AngularやVueとは異なり、ofa.jsはコンポーネントに特別な設定や追加の操作を加えることなく、ネイティブで双方向データバインディング構文をサポートします。

### 双方向バインディングの例

以下の例は、親コンポーネントと子コンポーネントの間で双方向データバインディングを確立する方法を示しています：

<o-playground name="双方向バインディング例" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">親コンポーネントの値: {{val}}</h3>
      <p>入力欄から親コンポーネントの値を変更：</p>
      <input type="text" sync:value="val" placeholder="入力欄にテキストを入力...">
      <p>子コンポーネントから親コンポーネントの値を変更：</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>子コンポーネントに表示される値: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="子コンポーネントの入力欄に入力...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

この例では：- 親コンポーネントの `val` と子コンポーネントの `fullName` は `sync:full-name="val"` によって双方向バインディングが実現されています
- 親コンポーネントの入力ボックスに内容を入力すると、子コンポーネントは即座に新しい値を表示します
- 子コンポーネントの入力ボックスに内容を入力すると、親コンポーネントも即座に表示を更新します

### 双方向バインディングと通常のプロパティバインディングの違い

| 特性 | 普通属性绑定 (`:`) | 双向绑定 (`sync:`) |
|------|-------------------|-------------------|
| データの流れ | 一方向：親 → 子 | 双方向：親 ↔ 子 |
| 構文 | `:prop="value"` | `sync:prop="value"` |
| 子コンポーネントでの変更 | 親コンポーネントに影響しない | 親コンポーネントに影響する |
| 適用シナリオ | 親コンポーネントから子コンポーネントへの設定の受け渡し | 親子コンポーネント間でのデータ同期が必要な場合 |### 注意事項

1. **パフォーマンスの考慮**：双方向バインディングはデータが変化した際に再レンダリングを引き起こすため、複雑なシナリオでは慎重に使用すべきである
2. **データフローの制御**：双方向バインディングが多すぎるとデータフローの追跡が困難になるため、コンポーネント間の通信方法を合理的に設計することを推奨する
3. **コンポーネントの互換性**：すべてのコンポーネントが双方向バインディングに適しているわけではなく、コンポーネントの設計目的を考慮する必要がある