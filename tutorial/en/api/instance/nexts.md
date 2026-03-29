# nexts

Using the `nexts` property, you can easily retrieve all adjacent element instances following the current element, which will be returned as an array.

<o-playground name="nexts - Subsequent Elements" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
        <li>I am 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'change text');
        },500);
      </script>
    </template>
  </code>
</o-playground>

