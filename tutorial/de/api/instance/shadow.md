# shadow



Mit dem `shadow`-Attribut können Sie die Instanz des Schattenwurzelknotens eines Elements abrufen.

<o-playground name="shadow - Schattenknoten" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

Es ist zu beachten, dass innerhalb von Elementen mit Vorlagensyntax direkte Änderungen an Elementen innerhalb des Schattenknotens vermieden werden sollten, um Konsistenz und Wartbarkeit der Operationen sicherzustellen.

## Abrufen von Elementinstanzen innerhalb des Schatten-DOM einer Komponente von außen

Sie können auch eine benutzerdefinierte Elementinstanz von extern beziehen und dann über die Eigenschaft `shadow` auf die Elemente innerhalb des Schattenknotens zugreifen, wie folgt:

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="Schatten - Externer Zugriff" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = 'Ziel von außen ändern - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>Element 1</li>
        <li id="target">Element 2</li>
        <li>Element 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'Ziel ändern';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

