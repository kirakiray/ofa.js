# 特徴属性の受け渡し

ofa.js では、[特徴属性（Attribute）](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes)は、コンポーネント間でデータを渡す最も一般的な方法の一つです。コンポーネントの `attrs` オブジェクトで必要な属性を宣言するだけで、コンポーネントを使用する際に外部データをコンポーネント内部に渡すことができます。

## 基本的な使い方

### 受信プロパティの定義

コンポーネントを使用する前に、まずコンポーネントの `attrs` オブジェクト内で受け取る属性を宣言する必要があります。属性にはデフォルト値を設定することができます。

<o-playground name="基本的な使い方の例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="OFA コンポーネントの例"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="NoneOS 使用例"></demo-comp>
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
      </style>
      <p>First: {{first}}</p>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 重要なルール

1. **型制限**：渡される attribute の値は文字列でなければならず、他の型は自動的に文字列に変換されます。

2. **命名変換**：HTML属性は大文字と小文字を区別しないため、大文字を含む属性を渡す場合は、`-` で区切った命名（kebab-case 形式）を使用する必要があります。
   - 例：`fullName` → `full-name`

3. **必須定義**：コンポーネントが `attrs` オブジェクトに対応する属性を定義していない場合、その attribute を受け取ることができません。設定された値はデフォルト値であり、デフォルト値が必要ない場合は `null` に設定します。

<o-playground name="重要规则示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="张三" age="25"></demo-comp>
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
      </style>
      <p>User Name: {{userName}}</p>
      <p>Age: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "デフォルト名",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## テンプレート構文による Attribute の受け渡し

コンポーネントのテンプレート内では、`attr:toKey="fromKey"` 構文を使用して、現在のコンポーネントの `fromKey` データを子コンポーネントの `toKey` 属性に渡すことができます。

<o-playground name="属性伝達例" style="--editor-height: 500px">
  <code path="demo.html" preview>
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
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
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
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>
      <p>フルネーム: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## マルチレベル伝達

複数の階層にネストされたコンポーネントを通じて、属性を段階的に渡すことができます。

コンポーネントが他のコンポーネントに依存する場合、コンポーネント内で他のコンポーネントのモジュールをインポートする必要があります。

<o-playground name="多階層受け渡しの例" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="トップレベルデータ"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>外層コンポーネント受信: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
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
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>内層コンポーネント受信: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

