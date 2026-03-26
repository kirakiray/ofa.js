# he

Through the `ele` attribute, you can obtain the actual [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) of the instance, allowing you to use native properties or methods.

<o-playground name="ele - Get Element" style="--editor-height: 320px">
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