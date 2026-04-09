# next



Con la propiedad `next`, puedes obtener la instancia del elemento adyacente siguiente.

<o-playground name="next - elemento siguiente" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">Soy 1</li>
        <li id="target">Soy el objetivo</li>
        <li>Soy 3</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').next.text = "cambiar elemento siguiente al objetivo";
          \$("#logger1").text = \$('#first').next === $('#target')
        },500);
      </script>
    </template>
  </code>
</o-playground>

