# ホストスタイルの注入

Web Components では、`slot` スロットの制限により、スロット内の多階層要素のスタイルを直接設定することができません。この問題を解決するために、ofa.js は `<inject-host>` コンポーネントを提供しており、コンポーネント内部からホスト要素にスタイルを注入することができ、これによりスロット内容内の多階層要素のスタイル制御を実現します。

> 注意、優先的に [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) セレクタを使用してスロットコンテンツのスタイルを設定することを推奨します。ニーズを満たせない場合にのみ、`<inject-host>` コンポーネントを使用してください。

## 基本的な使い方

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 直接の子要素（第一階層）のスタイルを設定 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 多階層ネストのスタイルも設定可能 */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## ケーススタディ

以下の例では、`<inject-host>` を使ってスロット内のネストされた要素のスタイルを設定する方法を示します。ここでは 2 つのコンポーネントを作成します：`user-list` コンポーネントをリストコンテナとして、`user-list-item` コンポーネントをリスト項目として。`<inject-host>` によって、`user-list` コンポーネント内で `user-list-item` およびその内部要素のスタイルを設定できます。

<o-playground name="ホストスタイルの注入" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>張三</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">李四</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        年齢: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

実行結果から以下のことが確認できます：- `user-list-item` コンポーネントの背景色は aqua（`user-list` コンポーネントの `<inject-host>` による設定）
- 名前の文字色は赤（`user-list` コンポーネントの `<inject-host>` による `user-list-item .item-name` スタイルの設定）

## 動作原理

`<inject-host>` コンポーネントは、内部に含まれる `<style>` タグの内容をコンポーネントのホスト要素に注入します。これにより、注入されたスタイルルールはコンポーネントの境界を貫通し、slot スロット内の要素に作用します。

この方法で、あなたは：- スロットの内容内の任意の深さにある要素のスタイルを設定する
- 完全なセレクタパスを使用して、スタイルが対象の要素にのみ作用することを確実にする
- コンポーネントのスタイルのカプセル化を維持しながら、柔軟なスタイルの浸透を実現する

## 注意事項

⚠️ **スタイル汚染リスク**：注入されたスタイルはホスト要素のスコープに作用するため、他のコンポーネント内の要素に影響を与える可能性があります。使用時は以下の原則に必ず従ってください：

1. **具体的なセレクタを使用する**：可能な限り完全なコンポーネントタグパスを使用し、過度に広範なセレクタの使用を避ける
2. **名前空間プレフィックスを追加する**：スタイルクラスにユニークなプレフィックスを追加し、他のコンポーネントとの衝突の可能性を減らす
3. **汎用タグセレクタの使用を避ける**：可能な限りクラス名または属性セレクタをタグセレクタの代わりに使用する
4. **コンポーネント設計を再考する**：`<inject-host>`の使用を避けるためにコンポーネント設計を最適化できるかどうかを検討する。例えば、子コンポーネントで[::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted)セレクタを組み合わせて使用する方が、多くの場合よりエレガントである。

```html
<!-- 推奨 ✅：具体的なセレクタを使用 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 推奨されません ❌：あまりに汎用的なセレクタを使用 -->
<inject-host>
    <style>
        .content {  /* 他のコンポーネントと衝突しやすい */
            color: red;
        }
    </style>
</inject-host>
```

### パフォーマンスのヒント

`<inject-host>` はホストスタイルの再注入を引き起こし、結果としてコンポーネントのリフローやリペイントを引き起こす可能性があるため、頻繁に更新されるシーンでは慎重に使用してください。  
スロット内の第1レベル要素にのみスタイルを設定する場合は、[::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 擬似クラスセレクタを優先的に使用すると、透過的な注入による追加のレンダリングオーバーヘッドを回避でき、より良いパフォーマンスを得られます。