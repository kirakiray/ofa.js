# one



Con el método `one`, puedes registrar manejadores de eventos de una sola vez para elementos objetivo, lo que significa que el manejador de eventos se desvinculará automáticamente después de activarse por primera vez y no se volverá a activar.

Aquí hay un ejemplo que demuestra cómo usar el método `one` para registrar un controlador de eventos de clic en un elemento de botón:

<o-playground name="one - click Evento único" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">añadir contador</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, utilizamos el método `one` para añadir un manejador de eventos de clic al elemento botón. Cuando el usuario hace clic en el botón, el manejador de eventos se activa, pero no volverá a activarse después, ya que se ha desvinculado.

## Uso mediante sintaxis de plantilla

También puedes usar la sintaxis de plantilla para vincular manejadores de eventos de un solo uso a elementos objetivo.

<o-playground name="one - Sintaxis de plantillas" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">Add Count</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, utilizamos la vinculación `one:click` en el elemento de botón para un método llamado `addCount`. Cuando el usuario hace clic en el botón, este método se llamará, pero no se activará nuevamente después, ya que es un controlador de eventos de un solo uso.