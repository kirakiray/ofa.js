# before



El método `before` se utiliza para añadir elementos delante del elemento destino. Antes de ejecutar la operación `before`, se realiza automáticamente la inicialización del método [$](../instance/dollar.md), por lo que puedes escribir directamente la cadena de texto u objeto del elemento concreto.

**Por favor, tenga en cuenta que no se deben realizar operaciones dentro de los componentes de plantilla como o-fill o o-if.**

<o-playground name="before - 前面添加" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').before(`<li style="color:red;">nuevo li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

