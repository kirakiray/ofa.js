# clone



`clone` メソッドを使用すると、要素インスタンスのコピーを複製して生成できます。

<o-playground name="clone - 要素のクローン" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red;">私はターゲットです</div>
      <div>ロガー：</div>
      <div id="logger"></div>
      <script>
        setTimeout(()=>{
          const tar = $('#target').clone();
          \$('#logger').push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

