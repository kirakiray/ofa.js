# 版本

You can get the version number of the currently imported ofa.js through the `ofa.version` property.

> **ofa.js version ≥ 4.3.40 required**

<o-playground name="version - Get Version">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>This way, you can display the currently used version of ofa.js on the page.