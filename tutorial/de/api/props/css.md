# css



Die `css`-Methode dient dazu, die Stile des Ziel-Elements abzurufen oder festzulegen.

## Direkte Verwendung

Du kannst die `css`-Methode direkt verwenden, um die Stile eines Elements abzurufen oder festzulegen.

<o-playground name="css - Direkte Verwendung" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## Vollständige Einstellungen

Über das erhaltene `css`-Objekt kannst du die Style-Werte direkt am Element setzen.

<o-playground name="css - Vollständige Einstellung" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">Ursprungstext</div>
      <br>
      <h4>Logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

Mit den Eigenschaften des `css`-Objekts kannst du die Stile des Ziel-Elements schnell anpassen.

## Verwendung auf Template-Syntax-Weise

Sie können auch über die Template-Syntax den Stil des Zielelements festlegen.

<o-playground name="css - Vorlagen-Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">I am target</div>
      <script>
        export default {
          tag: "css-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Tipps zum Einrichten von CSS

Du kannst die Stileigenschaften eines Elements ändern, ohne andere Stileigenschaften zu beeinflussen, indem du `$ele.css = {...$ele.css, color:'red'}` verwendest. Diese Methode ermöglicht es, nur eine einzelne Eigenschaft zu ändern, ohne den gesamten Stil neu zu schreiben.

### Beispiel

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

Im obigen Beispiel ändern wir mit `{ ...myElement.css, color: 'red' }` nur die Farbe des Elements und lassen alle anderen Stileigenschaften unverändert. Das ist ein praktischer Trick, um die Gestaltung eines Elements flexibel anzupassen.