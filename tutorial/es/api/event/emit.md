# emit



Usando el método `emit`, puedes activar eventos de forma proactiva, y los eventos activados tienen un mecanismo de burbujeo. El mecanismo de burbujeo significa que el evento burbujea desde el elemento interno hacia el elemento externo, activándose desde el nivel interno hacia el externo.

A continuación se presenta un ejemplo que demuestra cómo usar el método `emit` para disparar eventos personalizados y utilizar el mecanismo de burbujeo para propagar eventos a elementos externos：

<o-playground name="emit - disparar evento" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, hemos registrado el mismo controlador de eventos personalizado `custom-event` para el elemento `<ul>` y el elemento `<li>`. Cuando usamos el método `emit` para activar el evento, este burbujea desde el elemento `<li>` hasta el elemento `<ul>`, activando ambos controladores de eventos.

## Datos personalizados

Al incluir el parámetro `data`, puedes pasar datos personalizados al handler del evento:

<o-playground name="emit - datos personalizados" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, pasamos datos personalizados al manejador de eventos mediante el parámetro `data`. El manejador de eventos puede obtener los datos pasados a través de `event.data`.

## Disparar eventos sin burbujeo

Si no deseas que el evento se propague, puedes pasar el parámetro `bubbles: false` al disparar el evento:

<o-playground name="emit - sin burbujeo" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          Soy el objetivo
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul se activó';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target se activó';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, utilizamos el parámetro `bubbles: false` para desencadenar un evento personalizado. Este evento no se propaga hacia los elementos superiores, por lo que solo se activa el controlador de eventos del elemento `<li>`.

## Penetrar el nodo raíz

Por defecto, los eventos no atraviesan el DOM de sombra de un componente personalizado. Pero puedes hacer que los eventos personalizados atraviesen el nodo raíz y se disparen en elementos fuera de él estableciendo `composed: true`.

<o-playground name="emit - Penetrar nodo raíz" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, creamos un componente personalizado `composed-test` que contiene un elemento dentro de un DOM sombra y un botón que activa un evento. Por defecto, los eventos no atraviesan el DOM sombra hacia el nodo raíz. Sin embargo, al usar el parámetro `composed: true` al activar el evento, permitimos que el evento atraviese hasta el nodo raíz, activando así un elemento fuera del nodo raíz.