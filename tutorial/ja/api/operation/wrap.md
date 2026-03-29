# wrap



`wrap` メソッドは、対象要素の外側に要素を1つラップするために使用されます。`wrap` 操作を実行する前に、自動的に [$ メソッド](../instance/dollar.md) の初期化処理が行われるため、具体的な要素の文字列やオブジェクトを直接記述できます。

<o-playground name="wrap - 要素のラップ" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>I am 1</div>
        <div id="target">I am 2</div>
        <div>I am 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

ターゲット要素**は必ず親ノードを持つ必要があります**。そうしなければ、ラップ操作は失敗します。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // エラー、親要素がないため、ラップできません
$el.$('#target').wrap("<div>new div</div>"); // 正しい、親要素があります
```

**o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**