# スロット

スロットは、コンポーネント内で外部コンテンツを受け取るためのプレースホルダーです。スロットを使用することで、再利用可能なコンポーネントを作成しながら、コンポーネントの利用者がコンポーネント内部のコンテンツをカスタマイズできるようになります。

## デフォルトスロット

<o-playground name="デフォルトスロット例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>スロット内容：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### スロットのデフォルトコンテンツ

親コンポーネントがスロットのコンテンツを提供していない場合、`<slot></slot>` 内部の要素はデフォルトのコンテンツとして表示されます。

<o-playground name="スロットデフォルト内容の例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>スロット内容あり：</h3>
      <demo-comp>
        <div>これはカスタム内容です</div>
      </demo-comp>
      <h3>スロット内容なし（デフォルト内容を表示）：</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>スロット内容：
      <span style="color: red;">
        <slot>
          <div>これはデフォルト内容です</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 名前付きスロット

コンポーネントで複数のスロットが必要な場合、名前付きスロットを使用してスロットを区別することができます。`<slot name="xxx">` で名前付きスロットを定義し、使用時には `slot="xxx"` 属性でコンテンツをどのスロットに入れるかを指定します。

<o-playground name="名前付きスロットサンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>Hello, OFAJS!</div>
        <div slot="footer">Footer Content</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>スロット内容：
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 多階層スロットの受け渡し

スロットの内容は複数のコンポーネント層をまたいで渡すことができます。親コンポーネントが子コンポーネントにスロットの内容を渡した後、子コンポーネントはそのスロットの内容をさらに自分の子コンポーネントに渡し続けることができ、スロットの多層的な透過的な受け渡しを実現します。

<o-playground name="多階層スロット伝達例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">最外層からのタイトル</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>外層コンポーネント</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>内層コンポーネント</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

上記の例では：- 最上位の親コンポーネントが `slot="header"` の内容を定義しています
- 外側のコンポーネント（outer-comp）はこのスロット内容を受け取り、それを内側のコンポーネント（inner-comp）に引き継ぎます
- 内側のコンポーネントが最終的に最上位からのスロット内容をレンダリングします