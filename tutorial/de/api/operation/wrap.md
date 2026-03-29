# wrap



Die `wrap`-Methode wird verwendet, um ein Zielelement mit einer weiteren Elementebene zu umschließen. Vor der Ausführung der `wrap`-Operation wird automatisch die Initialisierungsoperation der [$-Methode](../instance/dollar.md) durchgeführt, sodass direkt konkrete Elementzeichenfolgen oder Objekte angegeben werden können.

<o-playground name="wrap - Element einwickeln" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>I am 1</div>
        <div id="target">I am 2</div>
        <div>I am 3</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

Das Zielelement **muss einen übergeordneten Knoten haben**, sonst schlägt der Wrapping-Vorgang fehl.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // Fehler, kein Elternelement, kann nicht eingebunden werden
$el.$('#target').wrap("<div>new div</div>"); // Korrekt, Elternelement vorhanden
```

**Bitte beachten Sie, dass Sie nicht innerhalb von Template-Komponenten wie o-fill oder o-if operieren sollten.**