# prev



`prev` 属性を使用すると、要素の前の隣接する要素インスタンスを取得できます。

<o-playground name="prev - 前の要素" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">私は1です</li>
        <li id="target">私はターゲットです</li>
        <li>私は3です</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').prev.text = "ターゲットの前の要素を変更";
          \$("#logger1").text = \$('#first') === $('#target').prev
        },500);
      </script>
    </template>
  </code>
</o-playground>

