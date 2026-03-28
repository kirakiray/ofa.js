# attr



El método `attr` se utiliza para obtener o establecer los atributos de un elemento.

## Uso directo

Puedes usar directamente el método `attr` para obtener o establecer los atributos de un elemento.

<o-playground name="attr - uso directo" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div id="target1" test-attr="1">Soy objetivo 1</div>
      <div id="target2">Soy objetivo 2</div>
      <div id="logger" style="border:blue solid 1px;padding:8px;margin:8px;">registrador</div>
      <script>
        $("#logger").text = $("#target1").attr('test-attr');
        setTimeout(()=> {
          $("#target1").attr('test-attr', '2')
          $("#logger").text = $("#target1").attr('test-attr');
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Uso mediante sintaxis de plantilla

También puedes usar el método `attr:aaa="bbb"` para establecer el atributo **aaa** del elemento objetivo en el valor del componente **bbb**. Este método es especialmente útil para el renderizado de componentes.

<o-playground name="attr - sintaxis de plantilla" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./attr-demo.html"></l-m>
      <attr-demo></attr-demo>
      <script>
        setTimeout(()=>{
          \$("attr-demo").txt = "2";
        },1000);
      </script>
    </template>
  </code>
  <code path="attr-demo.html" active>
    <template component>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div attr:test-attr="txt">Soy el objetivo</div>
      <script>
        export default {
          tag: "attr-demo",
          data: {
            txt: "1"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "2";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

