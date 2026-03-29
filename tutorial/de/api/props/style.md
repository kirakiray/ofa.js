# style



Das `style`-Attribut bleibt mit dem nativen Stil konsistent.

Bitte beachten Sie, dass das `style`-Attribut nicht die tatsächlichen Werte des Stils abrufen kann, sondern nur die Werte, die im `style`-Attribut gesetzt wurden. Obwohl die `style`-Methode ähnlich wie die [css-Methode](./css.md) ist, kann sie keine vollständige Stilüberschreibung durchführen. Im Vergleich zu `css` ist die interne Ausführungseffizienz der `style`-Methode höher.

Nachfolgend ein Beispiel, das zeigt, wie man `style` verwendet:

<o-playground name="style - direkte Verwendung" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">ursprünglicher Text</div>
      <br>
      <h4>Logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

Bitte beachte, dass die `style`-Methode nur Werte abruft und auf dem `style`-Attribut setzt, nicht jedoch die tatsächliche berechnete Darstellung.

## Verwendung auf Template-Syntax-Weise

Sie können auch über die Template-Syntax den Stil des Zielelements festlegen.

<o-playground name="style - Template-Syntax" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">Ich bin das Ziel</div>
      <script>
        export default {
          tag: "style-demo",
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

