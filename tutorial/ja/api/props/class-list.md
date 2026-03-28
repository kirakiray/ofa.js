# classList



`classList` 属性はネイティブと一致しています。クラス名の追加、削除、切り替えには [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) を使用できます。

以下は、`classList`の使い方を示す例です：

<o-playground name="classList - 使用例" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">元のテキスト</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

`classList` プロパティを使用すると、クラスの追加、削除、切り替えを簡単に行えるため、要素のスタイルを動的に変更できます。