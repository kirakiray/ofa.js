# version



`ofa.version` プロパティを使用すると、現在読み込んでいる ofa.js のバージョン番号を取得できます。

> **要求 ofa.js バージョン ≥ 4.3.40**

<o-playground name="version - バージョン取得">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

こうすることで、ページ上に現在使っている ofa.js のバージョンを表示できます。