# $

`$` メソッドは ofa.js のコア関数であり、DOM 要素インスタンスを取得および操作するために使用されます。以下では、`$` の主な機能について詳しく説明します：

## 要素インスタンスの取得

`` `$` `` メソッドを使用すると、ページ上の [CSS セレクタ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) に一致する最初の要素のインスタンスを取得し、それを操作することができます。以下に例を示します：

<o-playground name="$ - 要素の取得">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

上の例では、`$` 記号を使用して `id` が "target1" の要素インスタンスを選択し、`text` 属性を設定することでそのテキスト内容を変更しました。

## 子要素検索の例

インスタンスも `$` メソッドを持っており、インスタンス上の `$` メソッドを通じて、要素インスタンスの最初の条件を満たす子要素インスタンスを取得できます。

<o-playground name="$ - 子要素の検索">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

取得した要素インスタンスを直接他の場所に挿入しないでください。このような操作は元の要素に影響を与えます。コピーを作成する必要がある場合は、[clone](./clone.md) メソッドを使用できます。

<o-playground name="$ - インスタンス特性" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## シャドウノード内の子要素を取得する

[shadow](./shadow.md) 属性でインスタンスを取得した後、`$` メソッドを使用して目的の要素を取得できます：

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## 直接インスタンス化要素

以下の方法で、ネイティブ要素を直接 `$` インスタンスオブジェクトとして初期化できます：

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

このように、既存のHTML要素を`$`インスタンスに簡単に変換でき、`$`が提供する機能を使って操作や処理を行うことができます。

## 生成要素インスタンス

`$` は既存の要素インスタンスを取得するだけでなく、新しい要素インスタンスを作成し、ページに追加するためにも使用できます。

### 文字列による生成

文字列を使って新しい要素のインスタンスを `$` 関数で作成することができます。次のようにします：

<o-playground name="$ - 文字列生成" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">target 1 にテキストを追加</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

この例では、`$` 関数を使用して、指定されたスタイルとテキストコンテンツを持つ新しい要素インスタンスを作成し、それを `id` が "target1" の既存の要素インスタンス内に追加しました。

### オブジェクトによる生成

また、`$` 関数を使用してオブジェクト方式で新しい要素インスタンスを生成することもできます。次のように：

<o-playground name="$ - オブジェクト生成" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

この例では、`$` 関数を使用して、タグタイプ、テキスト内容、スタイル属性を含む新しい要素インスタンスをオブジェクトの方法で定義し、それを `id` が "target1" の既存の要素インスタンス内に追加しました。