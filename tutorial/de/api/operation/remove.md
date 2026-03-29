# remove



Die `remove`-Methode wird verwendet, um den Zielknoten zu löschen.

**Bitte beachten Sie, dass Sie nicht innerhalb von Vorlagenkomponenten wie o-fill oder o-if arbeiten sollten.**

<o-playground name="remove - Knoten entfernen" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

