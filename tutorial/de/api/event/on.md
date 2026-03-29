# on



Mit der Methode `on` können Sie Ereignis-Handler für Zielelemente registrieren. Dadurch können Sie Benutzerinteraktionen einfach erfassen und darauf reagieren.

Hier ist ein Beispiel, das zeigt, wie man die `on`-Methode verwendet, um einen Klick-Event-Handler für ein Schaltflächenelement zu registrieren:

<o-playground name="on - click Event" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel verwenden wir die `on`-Methode, um einen Klick-Event-Handler für das Schaltflächenelement hinzuzufügen. Wenn der Benutzer auf die Schaltfläche klickt, wird der Event-Handler ausgelöst, der Zähler wird erhöht und das Ergebnis wird auf der Seite angezeigt.

## Verwendung auf Template-Syntax-Weise

Sie können auch Template-Syntax verwenden, um Methoden an Zielelemente zu binden.

<o-playground name="on - 模板语法" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
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

In diesem Beispiel binden wir mit `on:click` auf dem Button-Element eine Methode namens `addCount`. Wenn der Benutzer auf den Button klickt, wird diese Methode aufgerufen, der Zählerwert erhöht sich und wird auf der Seite angezeigt. Auf diese Weise kannst du Event-Handler mit Methoden der Komponente verknüpfen und komplexere Interaktionen realisieren.

## event



Nach der Registrierung eines Ereignisses wird die ausgelöste Funktion mit dem Event-Parameter versehen, um mit dem nativen Verhalten übereinzustimmen:

<o-playground name="on - event 参数" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">Zähler erhöhen</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

