# parents



Mit der `parents`-Eigenschaft können Sie ganz einfach alle Elternelement-Instanzen des aktuellen Elements abrufen, die als Array zurückgegeben werden.

<o-playground name="parents - Elternelemente" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div>
        <ul>
          <li>Ich bin 1</li>
          <li id="target">Ich bin das Ziel</li>
          <li>Ich bin 3</li>
        </ul>
      </div>
      <div>
        Protokoll: <span id="logger"></span>
      </div>
      <script>
        setTimeout(()=>{
          $("#logger").text = $("#target").parents.map(e => e.tag);
        },500);
      </script>
    </template>
  </code>
</o-playground>

