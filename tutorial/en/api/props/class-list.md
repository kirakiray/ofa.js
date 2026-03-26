# classList

The `classList` property remains consistent with the native implementation. You can use [classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) to add, remove, and toggle class names.

Here is an example demonstrating how to use `classList`:

<o-playground name="classList - Usage Example" style="--editor-height: 500px">
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
      <div id="target" class="t-red">origin text</div>
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
</o-playground>The `classList` property lets you easily add, remove, and toggle class names to dynamically change an element’s style.