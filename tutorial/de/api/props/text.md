# text



Die Methode `text` wird verwendet, um den Textinhalt eines Elements abzurufen oder festzulegen.

## Direkte Verwendung

Sie können den Textinhalt eines Elements direkt abrufen oder festlegen.

<o-playground name="text - direkte Verwendung" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target1">Ziel 1</div>
      <div id="target2">Originaltext</div>
      <br>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').text = `<b style="color:blue;">neuer Text</b>`;
          \$("#logger").text = $("#target1").text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Verwendung auf Template-Syntax-Weise

Du kannst auch das `:text`-Attribut verwenden, um dem Ziel-Element den entsprechenden Textwert zuzuweisen. Dies ist besonders beim Rendern von Komponenten nützlich.

<o-playground name="text - Vorlagen-Syntax" style="--editor-height: 450px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./text-demo.html"></l-m>
      <text-demo></text-demo>
      <script>
        setTimeout(()=>{
          \$("text-demo").txt = "change txt from outside";
        },1000);
      </script>
    </template>
  </code>
  <code path="text-demo.html" active>
    <template component>
      <div>Rendered text:
        <span :text="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "text-demo",
          data: {
            txt: "I am txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "change txt";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

