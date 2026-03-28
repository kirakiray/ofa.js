# after



El método `after` se utiliza para agregar elementos después del elemento objetivo. Antes de ejecutar la operación `after`, se ejecutará automáticamente la operación de inicialización del [método $](../instance/dollar.md), por lo que se pueden especificar directamente la cadena de elementos específica o el objeto.

**Por favor, tenga en cuenta que no se deben realizar operaciones dentro de los componentes de plantilla como o-fill o o-if.**

<o-playground name="after - añadir detrás" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">new li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

