# html



Die `html`-Methode wird verwendet, um den HTML-Code innerhalb des Zielelements abzurufen oder festzulegen.

<o-playground name="html - Direkte Verwendung" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">Ziel 1</span>
      </div>
      <div id="target2">Originaltext</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">neuer Text</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

`html` ist eine relativ gefährliche Methode; wird `script` hineingeschoben, wird auch der darin enthaltene JavaScript-Code automatisch ausgeführt. Achten Sie beim Gebrauch auf XSS-Prävention.

## Verwendung auf Template-Syntax-Weise

Du kannst auch das `:html`-Attribut verwenden, um dem Ziel-Element den entsprechenden HTML-Wert zuzuweisen. Dies ist besonders bei der Darstellung von Komponenten nützlich.

<o-playground name="html - Vorlagensyntax" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>change txt from outside</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>Rendered html:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>change txt</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

