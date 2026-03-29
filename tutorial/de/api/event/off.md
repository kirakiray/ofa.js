# off



Mit der `off`-Methode können registrierte Ereignisbehandlungsroutinen abgemeldet werden, um die Überwachung eines Ereignisses abzubrechen.

Hier ist ein Beispiel, das zeigt, wie man die `off`-Methode verwendet, um Ereignis-Listener zu entfernen:

<o-playground name="off - Ereignis-Listener entfernen" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel registrieren wir einen Klick-Event-Handler `f`, der bei einem Klick auf den Button die Anzahl der Klicks im `#logger` anzeigt. Mit der Methode `off` entfernen wir die Event-Beobachtung, sobald die Anzahl der Klicks 3 erreicht.