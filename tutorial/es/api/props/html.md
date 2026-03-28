# html



El método `html` se utiliza para obtener o establecer el código HTML interno del elemento objetivo.

<o-playground name="html - Uso directo" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">objetivo 1</span>
      </div>
      <div id="target2">texto original</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">texto nuevo</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Precauciones

`html` es un método relativamente peligroso; incluso si se inserta `script`, ejecutará automáticamente el código JavaScript interno. Tenga cuidado para prevenir XSS al usarlo.

## Uso mediante sintaxis de plantilla

También puedes usar el atributo `:html` para establecer el valor HTML correspondiente en el elemento de destino. Esto es especialmente útil en la representación de componentes.

<o-playground name="html - Sintaxis de plantilla" style="--editor-height: 500px">
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
      <div>HTML renderizado:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "Soy txt"
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

