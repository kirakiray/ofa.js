# before



Die `before`-Methode wird verwendet, um Elemente vor dem Zielelement einzufügen. Vor der Ausführung der `before`-Operation wird automatisch die Initialisierungsoperation der [$-Methode](../instance/dollar.md) ausgeführt, sodass direkt konkrete Elementzeichenketten oder Objekte eingegeben werden können.

**Bitte beachten Sie, dass Sie nicht innerhalb von Vorlagenkomponenten wie o-fill oder o-if arbeiten sollten.**

<o-playground name="before - voranstellen" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li id="target">Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">neues li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

