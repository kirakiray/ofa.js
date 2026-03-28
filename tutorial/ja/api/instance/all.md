# all



`all` メソッドを使用すると、ページ上のCSSセレクターに一致するすべての要素を取得し、これらの要素のインスタンスを含む配列を返します。

<o-playground name="all - すべての要素を取得" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

## 子要素を取得する

インスタンスも `all` メソッドを持っており、インスタンス上の `all` メソッドを通じて子要素を選択・取得できる。

<o-playground name="all - 子要素の取得" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <ul>
          <li>I am 1</li>
          <li>I am 2</li>
          <li>I am 3</li>
        </ul>
      </div>
      <script>
        const tar = $("#target1");
        setTimeout(()=>{
          tar.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

