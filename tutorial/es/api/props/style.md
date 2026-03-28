# style



El atributo `style` se mantiene igual que el nativo.

Tenga en cuenta que el atributo `style` no puede obtener el valor real del estilo, sino solo el valor establecido en el atributo `style`. Aunque el método `style` es similar al [método css](./css.md), no puede sobrescribir todos los estilos. En comparación con `css`, el método `style` tiene una mayor eficiencia de ejecución interna.

A continuación se presenta un ejemplo que demuestra cómo usar `style`：

<o-playground name="style - uso directo" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">texto original</div>
      <br>
      <h4>registrador</h4>
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

Recuerda que el método `style` solo obtiene y establece los valores en el atributo `style`, no el estilo calculado real.

## Uso mediante sintaxis de plantilla

También puedes usar la sintaxis de plantillas para establecer el estilo del elemento de destino.

<o-playground name="style - Sintaxis de plantilla" style="--editor-height: 400px">
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
      <div :style.color="txt">Soy el objetivo</div>
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

