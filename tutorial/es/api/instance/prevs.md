# prevs



Con el atributo `prevs`, puede obtener fácilmente todas las instancias de elementos adyacentes anteriores al elemento actual, las cuales se devolverán en forma de matriz.

<o-playground name="prevs - elementos anteriores" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Soy 0</li>
        <li>Soy 1</li>
        <li id="target">Soy el objetivo</li>
        <li>Soy 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').prevs.forEach(e => e.text = 'cambiar texto');
        },500);
      </script>
    </template>
  </code>
</o-playground>

