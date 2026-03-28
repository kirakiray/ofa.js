# css



El método `css` se utiliza para obtener o establecer los estilos de un elemento objetivo.

## Uso directo

Puedes usar directamente el método `css` para obtener o establecer los estilos de un elemento.

<o-playground name="css - uso directo" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">texto original</div>
      <br>
      <h4>registro</h4>
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

## Configuración completa

Al obtener el objeto `css`, puedes establecer directamente los valores de estilo en el elemento.

<o-playground name="css - configuración completa" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">texto original</div>
      <br>
      <h4>logger</h4>
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

Utilizando las características del objeto `css`, podrás ajustar rápidamente los estilos del elemento de destino。

## Uso mediante sintaxis de plantilla

También puedes usar la sintaxis de plantillas para establecer el estilo del elemento de destino.

<o-playground name="css - Sintaxis de plantilla" style="--editor-height: 400px">
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
      <div :css.color="txt">Soy el objetivo</div>
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

## Trucos para configurar CSS

Puedes modificar un atributo de estilo de un elemento mediante `$ele.css = {...$ele.css, color:'red'}` sin afectar los demás atributos de estilo. De esta forma puedes cambiar solo una propiedad sin tener que reescribir todo el estilo.

### Ejemplo

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

En el ejemplo anterior, al usar `{ ...myElement.css, color: 'red' }`, solo modificamos el estilo de color del elemento, manteniendo las demás propiedades de estilo sin cambios. Esta es una técnica muy útil que permite modificar los estilos de los elementos de forma flexible.