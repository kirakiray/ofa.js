# text



El método `text` se utiliza para obtener o establecer el contenido de texto de un elemento.

## Uso directo

Puedes obtener o establecer directamente el contenido de texto de un elemento.

<o-playground name="text - uso directo" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target1">target 1</div>
      <div id="target2">texto original</div>
      <br>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').text = `<b style="color:blue;">nuevo texto</b>`;
          \$("#logger").text = $("#target1").text;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Uso mediante sintaxis de plantilla

También puedes usar el atributo `:text` para establecer el valor de texto correspondiente en el elemento de destino. Esto es especialmente útil en la representación de componentes.

<o-playground name="text - Sintaxis de plantilla" style="--editor-height: 450px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./text-demo.html"></l-m>
      <text-demo></text-demo>
      <script>
        setTimeout(()=>{
          \$("text-demo").txt = "cambiar txt desde fuera";
        },1000);
      </script>
    </template>
  </code>
  <code path="text-demo.html" active>
    <template component>
      <div>Texto renderizado:
        <span :text="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "text-demo",
          data: {
            txt: "Soy txt"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "cambiar txt";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

