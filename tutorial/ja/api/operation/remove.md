# remove



`remove` メソッドはターゲットノードを削除するために使用されます。

**o-fill や o-if などのテンプレートコンポーネント内で操作しないでください。**

<o-playground name="remove - ノード削除" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>私は1です</li>
        <li id="target">私は2です</li>
        <li>私は3です</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

