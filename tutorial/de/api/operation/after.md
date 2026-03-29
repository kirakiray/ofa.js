# after



Die Methode `after` wird verwendet, um ein Element hinter das Ziel-Element einzufügen. Vor der Ausführung der `after`-Operation wird automatisch die Initialisierung der [$-Methode](../instance/dollar.md) ausgeführt, daher kann direkt ein konkreter Element-String oder ein Objekt angegeben werden.

**Bitte beachten Sie, dass Sie nicht innerhalb von Vorlagenkomponenten wie o-fill oder o-if arbeiten sollten.**

<o-playground name="Danach einfügen" style="--editor-height: 300px">
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

