# parents



Usando el atributo `parents`, puedes obtener fácilmente todas las instancias de elementos padres del elemento actual, que se devolverán en forma de array.

<o-playground name="parents - 父元素" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div>
        <ul>
          <li>I am 1</li>
          <li id="target">I am target</li>
          <li>I am 3</li>
        </ul>
      </div>
      <div>
        logger: <span id="logger"></span>
      </div>
      <script>
        setTimeout(()=>{
          $("#logger").text = $("#target").parents.map(e => e.tag);
        },500);
      </script>
    </template>
  </code>
</o-playground>

