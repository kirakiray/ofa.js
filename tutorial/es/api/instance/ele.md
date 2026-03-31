# ele



A través de la propiedad `ele`, puedes obtener el [Elemento Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) real de la instancia, permitiéndote así utilizar propiedades o métodos nativos.

<o-playground name="ele - obtener elemento" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">Soy el objetivo</li>
      </ul>
      <div id="logger" style="color:red;"></div>
      <script>
        setTimeout(()=>{
          var ele = $("#target").ele;
          ele.innerHTML = '<b>cambiar objetivo</b>';
          \$("#logger").text = ele.clientWidth;
        },500);
      </script>
    </template>
  </code>
</o-playground>

