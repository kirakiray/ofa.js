# ele



`ele` 属性を通じて、インスタンスの実際の [Element 要素](https://developer.mozilla.org/ja/docs/Web/API/Element) を取得でき、ネイティブのプロパティやメソッドを使用できます。

<o-playground name="ele - 要素を取得" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">I am target</li>
      </ul>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=>{
          var ele = $("#target").ele;
          ele.innerHTML = '<b>change target</b>';
          \$("#logger").text = ele.clientWidth;
        },500);
      </script>
    </template>
  </code>
</o-playground>

