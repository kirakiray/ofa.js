# Agregar o eliminar elementos secundarios

Las instancias de elementos tienen características similares a las de un array; añadir o eliminar nodos solo requiere utilizar los métodos habituales de array. Al emplear los métodos `push`, `unshift`, `pop`, `shift` y `splice`, internamente se ejecuta automáticamente la inicialización del método [$$](../instance/dollar.md), por lo que se puede indicar directamente la cadena de elemento o el objeto concreto.

Del mismo modo, también puede utilizar otros métodos de array, como `forEach`, `map`, `some`, etc.

**Tenga en cuenta que no se deben añadir ni eliminar elementos secundarios en los elementos que tengan sintaxis de plantilla.**

## push



Agregar un elemento hijo al final.

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Soy 1</li>
        <li>Soy 2</li>
        <li>Soy 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">nuevo li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



Agregar un subelemento al inicio del array.

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



Eliminar el subelemento desde el final.

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Soy 1</li>
        <li>Soy 2</li>
        <li>Soy 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



Eliminar subelementos al principio del array

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Soy 1</li>
        <li>Soy 2</li>
        <li>Soy 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



Se pueden eliminar o reemplazar elementos secundarios existentes, también se pueden añadir nuevos elementos secundarios. Su uso es similar al método `splice` de los arrays.

<o-playground name="array-like - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Soy 1</li>
        <li>Soy 2</li>
        <li>Soy 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">nuevo li 1</li>`, `<li style="color:green;">nuevo li 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

