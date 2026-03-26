# after

The `after` method is used to insert elements after the target element. Before performing the `after` operation, the initialization of the [$ method](../instance/dollar.md) is automatically executed, so you can directly provide a specific element string or object.

**Please note: do not operate within template components like o-fill or o-if.**

<o-playground name="after - add after" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>