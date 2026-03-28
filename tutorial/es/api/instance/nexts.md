# nexts



Usando la propiedad `nexts`, puede obtener fácilmente todas las instancias de elementos adyacentes después del elemento actual, y estos elementos se devolverán en forma de array.

<o-playground name="nexts - Elementos posteriores" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Yo soy 1</li>
        <li id="target">Yo soy el objetivo</li>
        <li>Yo soy 3</li>
        <li>Yo soy 4</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').nexts.forEach(e => e.text = 'cambiar texto');
        },500);
      </script>
    </template>
  </code>
</o-playground>

