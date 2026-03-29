# version



A través de la propiedad `ofa.version`, puedes obtener el número de versión de ofa.js que se ha introducido actualmente.

> **Requiere ofa.js versión ≥ 4.3.40**

<o-playground name="version - obtener versión">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

De esta manera, puedes mostrar en la página la versión actual de ofa.js que estás utilizando.