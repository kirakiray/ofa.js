# extend



`extend` es un método de orden superior utilizado para extender las propiedades o métodos de una instancia.

> Normalmente, no se recomienda que los usuarios extiendan las propiedades o métodos de una instancia, ya que esto aumenta la curva de aprendizaje. A menos que haya un escenario especial dentro del equipo que requiera personalizar el comportamiento de la instancia, no se recomienda hacerlo.

<o-playground name="extend - extender instancia" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Extensión de la capa inferior de $

De forma similar a jQuery, también puedes usar fn.extend para expandir las propiedades o métodos de la instancia base; las propiedades o métodos extendidos desde fn se aplicarán a todas las instancias.

<o-playground name="extend - extender el nivel inferior" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Sintaxis de plantilla extendida

Al extender propiedades o funciones mediante `extend`, se puede ampliar la funcionalidad de la sintaxis de plantillas e incluso proporcionar un azúcar sintáctico de plantillas exclusivo para los componentes. Sin embargo, hay que tener en cuenta que se debe intentar **no utilizar** sintaxis de plantillas no oficiales, ya que esto conlleva un cierto costo de aprendizaje para los usuarios, y el uso de una gran cantidad de azúcar sintáctico no oficial puede reducir la experiencia de desarrollo.

### Atributos extendidos

Puedes configurar en la plantilla usando `:` a través de propiedades extendidas. A continuación, extenderemos una propiedad `red`, cuando `red` sea `true`, el color de la fuente se volverá rojo:

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "rojo";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - Atributos extendidos" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, hemos añadido un atributo `red` a la sintaxis de la plantilla. Cuando `count % 3` no sea 0, el color de la fuente cambiará a rojo.

### Métodos de extensión

También puedes hacer que esté disponible en la sintaxis de plantilla a través del método de extensión `extend`. El nombre del método es la parte anterior a los dos puntos. Aquí, hemos extendido una sintaxis de plantilla `color`, y los parámetros que le siguen se pasarán al método de extensión definido.

Aquí se establece el atributo `always` como `true`, lo que significa que cada vez que el componente necesite actualizar la interfaz, se llamará a este método definido. Si no se establece `always`, esta función de sintaxis de plantilla solo se ejecutará una vez.

Entre ellos, `options` proporciona más parámetros que pueden ayudarte a desarrollar una sintaxis de plantillas más personalizada:

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - Método de extensión" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">Añadir Contador</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## Principios de la sintaxis de plantillas

Hasta ahora, deberías haber comprendido que gran parte de la sintaxis de plantillas en ofa.js en realidad se extiende mediante `extend`:

- los métodos `class`, `attr` se ejecutan cada vez que se actualiza la vista  
- la vinculación de funciones como `on`, `one` solo se ejecuta una vez

Puedes consultar el siguiente ejemplo para comprender mejor el principio de renderizado de plantillas de ofa.js:

<o-playground name="extend - Principios de la sintaxis de plantilla" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class siempre => {{classalways}}</div>
      <div>attr siempre => {{attralways}}</div>
      <div>on siempre => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

