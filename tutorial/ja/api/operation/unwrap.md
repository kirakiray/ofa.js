# unwrap



`unwrap` メソッドは、ターゲット要素の外側のラッピング要素を削除するために使用されます。

<o-playground name="unwrap - ラップを解除" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

対象要素**は親ノードを持っている必要があります**、そうでないと unwrap 操作を実行できません。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // エラー、親要素がないため、unwrapできません
$el.$('#target').unwrap(); // 正しい、ラップ要素を取り除きます
```

ターゲット要素が他の兄弟要素を持っている場合、unwrap を実行することもできません。

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // エラー、他の隣接ノードが存在するため
```

**o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**