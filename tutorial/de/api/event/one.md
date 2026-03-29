# one



Mit der `one`-Methode können Sie einen einmaligen Ereignishandler für das Zielelement registrieren, was bedeutet, dass der Ereignishandler nach dem ersten Auslösen automatisch aufgehoben wird und nicht erneut ausgelöst wird.

Hier ist ein Beispiel, das zeigt, wie die `one`-Methode verwendet wird, um einen Klick-Event-Handler für ein Button-Element zu registrieren:

<o-playground name="one - click 一次性事件" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">Zähler erhöhen</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die Methode `one`, um einem Button-Element einen Klick-Event-Handler hinzuzufügen. Wenn der Benutzer auf den Button klickt, wird der Event-Handler ausgelöst, danach jedoch nicht erneut, da er entfernt wurde.

## Verwendung auf Template-Syntax-Weise

Sie können auch Vorlagensyntax verwenden, um ein einmaliges Ereignisbehandlungsprogramm an das Zielelement zu binden.

<o-playground name="one - Template-Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Zähler erhöhen</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel binden wir mit `one:click` auf dem Button-Element eine Methode namens `addCount`. Wenn der Benutzer auf den Button klickt, wird diese Methode aufgerufen, danach aber nicht mehr ausgelöst, da es sich um einen einmaligen Event-Handler handelt.