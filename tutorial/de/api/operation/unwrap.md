# unwrap



Die `unwrap`-Methode wird verwendet, um das äußere umschließende Element des Zielelements zu entfernen.

<o-playground name="unwrap - Wrapper entfernen" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">Ich bin das Ziel</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

Das Zielelement **muss einen übergeordneten Knoten haben**, andernfalls kann die Unwrap-Operation nicht ausgeführt werden.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // Fehler, kein Elternelement, unwrap nicht möglich
$el.$('#target').unwrap(); // Korrekt, umschließendes Element entfernen
```

Wenn das Zielelement andere Geschwisterelemente hat, kann ebenfalls kein Unwrap ausgeführt werden.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // Fehler, da andere benachbarte Knoten vorhanden sind
```

**Bitte beachten Sie, dass Sie nicht innerhalb von Template-Komponenten wie o-fill oder o-if operieren sollten.**