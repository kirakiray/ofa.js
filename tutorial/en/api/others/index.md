# index

The `index` attribute is used to retrieve the position of an element within its parent element. This position is zero-based, meaning the first element is at position 0, the second at position 1, and so on.

In the following example, we demonstrate how to use the `index` property to get an element's position within its parent element:

<o-playground name="index - Get Position" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first select an `<li>` element with the `id` "target". Then, we use the `index` property to get its position under its parent element `<ul>`, which is the second element, so the value of `index` is 1. We then display this value in the `<div>` element with the `id` "logger".