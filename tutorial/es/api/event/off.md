# off



El uso del método `off` permite cancelar un controlador de eventos previamente registrado, dejando de escuchar el evento.

A continuación se presenta un ejemplo que demuestra cómo usar el método `off` para cancelar el escucha de eventos：

<o-playground name="off - Quitar detector de eventos" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">agregar conteo</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, hemos registrado un controlador de eventos de clic `f`; cuando se pulsa el botón, el controlador muestra el número de clics dentro de `#logger`. Utilizamos el método `off` para cancelar la escucha del evento cuando el contador alcanza 3.