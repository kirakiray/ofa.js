# all

Using the `all` method, you can get all elements on the page that match the CSS selector and return an array containing these element instances.

<o-playground name="all - Get all elements" style="--editor-height: 360px">
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
            item.text = `changed item ${index}`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>## Get Child Elements

Instances also have an `all` method, which can be used to select and retrieve child elements via the instance's `all` method.

<o-playground name="all - Get Child Elements" style="--editor-height: 360px">
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