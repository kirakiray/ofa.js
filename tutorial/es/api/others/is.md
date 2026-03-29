# is



El método `is` se utiliza para detectar si un elemento cumple con la expresión.

<o-playground name="is - detectar elemento" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Yo soy 1</li>
        <li id="target">Yo soy el objetivo</li>
        <li>Yo soy 3</li>
      </ul>
      <div id="logger">registrador</div>
      <script>
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          ¿Es li?: ${target.is('li')} <br>
          ¿Es div?: ${target.is('div')} <br>
          ¿Tiene id?: ${target.is('[id]')} <br>
          ¿Tiene clase?: ${target.is('[class]')} <br>
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

