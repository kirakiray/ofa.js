# index



El atributo `index` se utiliza para obtener la posición de un elemento dentro de su elemento padre. Esta posición se cuenta comenzando desde 0, es decir, la posición del primer elemento es 0, la del segundo es 1, y así sucesivamente.

En el siguiente ejemplo, demostramos cómo usar el atributo `index` para obtener la posición de un elemento dentro de su elemento padre:

<o-playground name="index - obtener posición" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">logger</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, primero seleccionamos un elemento `<li>` con un `id` de "target". Luego, usamos la propiedad `index` para obtener la posición de este elemento bajo su elemento padre `<ul>`, es decir, el segundo elemento, por lo que el valor de `index` es 1. Luego mostramos este valor en el elemento `<div>` con un `id` de "logger".