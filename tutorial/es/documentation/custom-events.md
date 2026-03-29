# Eventos personalizados

En ofa.js, además de los eventos DOM integrados, también se pueden crear y utilizar eventos personalizados para lograr la comunicación entre componentes. Los eventos personalizados son un mecanismo importante en el desarrollo basado en componentes, ya que permiten a los componentes difundir mensajes o cambios de estado hacia arriba.

## método emit - desencadenar evento personalizado

El método `emit` se utiliza para disparar eventos personalizados, notificando a los oyentes externos sobre los cambios de estado internos del componente o las acciones del usuario.

### Uso básico

```javascript
// Dispara un evento personalizado simple
this.emit('custom-event');

// Dispara un evento personalizado con datos
this.emit('data-changed', {
  data: {
    // Datos personalizados, estructura libre según necesidad
    newValue: 100,
    oldValue: 50
  }
});
```

### Parámetros del método emit

El método `emit` acepta dos argumentos:

1. **Nombre del evento**: cadena, que indica el nombre del evento a desencadenar
2. **Objeto de opciones** (opcional): contiene las opciones de configuración del evento
   - `data`: datos a transmitir
   - `bubbles`: valor booleano, controla si el evento burbujea (por defecto es true)
   - `composed`: valor booleano, controla si el evento puede atravesar los límites del Shadow DOM
   - `cancelable`: valor booleano, controla si el evento puede ser cancelado

Luego, el elemento de nivel superior puede usar el método `on` [(enlace de eventos)](./event-binding.md) para escuchar este evento personalizado.

### Ejemplo de uso de emit

<o-playground name="Ejemplo de uso de emit" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">Haga clic para activar el evento</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'El botón fue clicado',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - Mecanismo de propagación de eventos

La propiedad `bubbles` controla si el evento se propagará hacia arriba a los elementos padres. Cuando se establece en `true`, el evento se propaga por el árbol DOM hacia arriba. El valor predeterminado es `true`. Si se establece en `false`, el evento no burbujea.

### Explicación detallada del mecanismo de burbujeo

- **Comportamiento predeterminado**: los eventos emitidos con `emit` tienen propagación activada por defecto (`bubbles: true`)
- **Ruta de propagación**: el evento se propaga hacia arriba, nivel por nivel, desde el elemento que lo desencadena
- **Detener propagación**: invocar `event.stopPropagation()` en el manejador del evento detiene la propagación

### Ejemplo de burbuja

<o-playground name="Ejemplo de Eventos Personalizados" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>Contenedor externo (escucha eventos de burbuja): {{bubbledEventCount}} veces</p>
      <p>Componente interno (escucha eventos directos): {{directEventCount}} veces</p>
      <p>Datos recibidos: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">Disparar evento no burbujeante</button>
      <button on:click="triggerBubblingEvent">Disparar evento burbujeante</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // Evento no burbujeante, solo será capturado por oyentes directos
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: 'Evento no burbujeante disparado', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // Evento burbujeante, se propagará hacia arriba a elementos padre
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'Evento burbujeante disparado', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - atraviesa los límites del Shadow DOM

El atributo `composed` controla si el evento puede cruzar el límite del Shadow DOM. Esto es especialmente importante para el desarrollo de Web Components, el valor predeterminado es `false`.

### Mecanismo de penetración explicado en detalle

- **Aislamiento de Shadow DOM**: por defecto, los eventos no pueden cruzar los límites del Shadow DOM
- **Habilitar la propagación**: establecer `composed: true` permite que el evento atraviese los límites del Shadow DOM
- **Casos de uso**: cuando un componente necesita enviar eventos al entorno anfitrión, debe establecer `composed: true`

### Ejemplo de penetración

<o-playground name="Ejemplo de evento personalizado con datos" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>Escuchando eventos: {{bubbledEventCount}} veces</p>
      <p>Datos recibidos: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>Escuchando eventos: {{bubbledEventCount}} veces</p>
      <p>Datos recibidos: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">Activar evento no composed</button>
      <button on:click="triggerComposedEvent">Activar evento composed</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // Evento no composed, solo será capturado por el oyente directo
                this.emit('child-event', {
                  data: { type: 'non-composed', message: 'Evento no composed activado', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // Evento composed, cruzará el límite del Shadow DOM
                this.emit('child-event', {
                  data: { type: 'composed', message: 'Evento composed activado', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

