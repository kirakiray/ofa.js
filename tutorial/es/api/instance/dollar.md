# $

`$` es la función central en ofa.js, utilizada para obtener y manipular instancias de elementos del DOM. A continuación se detallan las principales funcionalidades de `$`:

## Obtener instancia de elemento

Mediante el método `$`, puedes obtener la primera instancia de elemento en la página que coincida con un [selector CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) y realizar operaciones sobre él. Aquí tienes un ejemplo:

<o-playground name="$ - Obtener elemento">
  <code path="demo.html">
    <template>
      <div id="target1">texto objetivo 1</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'cambiar objetivo 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

En el ejemplo anterior, utilizamos el símbolo `$` para seleccionar la instancia del elemento con `id` "target1", y modificamos su contenido de texto estableciendo la propiedad `text`.

## Buscar instancias de elementos secundarios

La instancia también tiene el método `$`, que puede obtener la primera instancia de elemento secundario que cumpla con las condiciones a través del método `$` en la instancia.

<o-playground name="$ - Buscar elementos hijos">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

No insertes directamente la instancia de un elemento obtenida en otro lugar, ya que esta operación afectará al elemento original. Si necesitas crear una copia, puedes utilizar el método [clone](./clone.md).

<o-playground name="$ - Características de instancia" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Obtener elementos secundarios dentro de nodos sombra

Puedes obtener la instancia a través del atributo [shadow](./shadow.md) y luego obtener el elemento deseado mediante el método `$`:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Instanciación directa de elementos

Puedes inicializar directamente elementos nativos como instancias de objeto `$` de la siguiente manera:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

De esta manera, puedes convertir convenientemente los elementos HTML existentes en instancias de `$` para operar y procesar con las funciones que proporciona `$`.

## Generar instancias de elementos

Además de `$` para obtener instancias de elementos existentes, también se puede utilizar para crear nuevas instancias de elementos y agregarlas a la página.

### Generación a través de cadenas de texto

Puedes usar la función `$` para crear nuevas instancias de elementos a partir de una cadena, de la siguiente manera:

<o-playground name="$ - Generación de cadenas" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">añadir texto target 1</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, utilizamos la función `$` para crear una nueva instancia de elemento con los estilos y el contenido de texto especificados, y la añadimos dentro de la instancia de elemento existente con `id` "target1".

### Generación a través de objetos

También puedes usar la función `$` para generar nuevas instancias de elementos a través de objetos, como se muestra a continuación:

<o-playground name="$ - Generación de objetos" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, usamos la función `$` para definir una nueva instancia de elemento mediante un objeto, incluyendo el tipo de etiqueta, el contenido de texto y los atributos de estilo, y la agregamos a un elemento existente con id "target1".