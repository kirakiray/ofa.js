# Ciclo de vida

ofa.js componentes tienen funciones de ciclo de vida completas, que te permiten ejecutar lógica específica en diferentes etapas del componente. Estas funciones de ciclo de vida te permiten intervenir y realizar operaciones correspondientes en momentos clave como la creación, montaje, actualización y destrucción del componente.

## Funciones de gancho del ciclo de vida

ofa.js proporciona los siguientes hooks del ciclo de vida principales, ordenados según el uso habitual:

### attached



El hook `attached` se invoca cuando el componente se inserta en el documento, indicando que el componente ya está montado en la página. Es el hook del ciclo de vida más utilizado, generalmente se usa para realizar operaciones de inicialización que necesitan ejecutarse después de que el componente se muestra realmente en la página, evitando realizar cálculos innecesarios cuando el componente no es visible. Este hook también es muy adecuado para medir el tamaño de elementos, iniciar animaciones y otras operaciones que dependen de que el componente se haya renderizado en la página.

- **Momento de invocación**: el componente se añade al árbol DOM
- **Uso principal**: iniciar temporizadores, añadir detectores de eventos, ejecutar operaciones que requieren visibilidad

### detached



El hook `detached` se llama cuando el componente se elimina del documento, lo que indica que el componente está a punto de ser desmontado. Este hook es adecuado para limpiar recursos, como borrar temporizadores, eliminar escuchadores de eventos, etc.

- **Momento de llamada**: el componente es eliminado del árbol DOM
- **Uso principal**: limpiar recursos, cancelar suscripciones, eliminar oyentes de eventos

### ready



El hook `ready` se llama cuando el componente está listo, en este momento la plantilla del componente ya se ha renderizado, los elementos DOM ya se han creado, pero es posible que aún no se hayan insertado en el documento. Este hook es adecuado para realizar operaciones DOM o inicializar bibliotecas de terceros.

- **Momento de invocación**: la plantilla del componente se ha renderizado y el DOM ha sido creado
- **Uso principal**: ejecutar operaciones de inicialización que dependen del DOM

### loaded



El gancho `loaded` se dispara cuando el componente, todos sus componentes secundarios y los recursos asíncronos se han cargado completamente. En este punto, se puede eliminar de forma segura el estado de carga o ejecutar operaciones posteriores que dependan del árbol de componentes completo. Si no hay dependencias, se llama después del gancho `ready`.

- **Momento de invocación**: cuando el componente y sus componentes hijos se han cargado completamente
- **Propósito principal**: ejecutar operaciones que dependen del árbol de componentes completo

## Orden de ejecución del ciclo de vida

Los hooks del ciclo de vida del componente se ejecutan en el siguiente orden:

2. `ready` - El componente está listo (el DOM ha sido creado)
3. `attached` - El componente está montado en el DOM
4. `loaded` - El componente está completamente cargado

Cuando el componente se elimina del DOM, se invoca el gancho `detached`.

## Ejemplo de uso

El siguiente ejemplo demuestra cómo usar ganchos de ciclo de vida en un componente:

<o-playground name="Ejemplo de ciclo de vida" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Demostración del ciclo de vida</h3>
      <div class="counter">Contador: {{count}}</div>
      <button on:click="count += 10">Aumentar 10</button>
      <button on:click="removeSelf">Eliminar componente</button>
      <div class="log">
        <h4>Registro del ciclo de vida:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Eliminarse del DOM para activar el hook detached
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: Componente listo, DOM creado");
              console.log("Componente listo");
            },
            attached() {
              this.addLog("attached: Componente montado en el DOM");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Componente montado");
            },
            detached() {
              this.addLog("detached: Componente eliminado del DOM");
              // Limpiar el temporizador para evitar fugas de memoria
              clearInterval(this._timer); 
              console.log("Componente desmontado");
            },
            loaded() {
              this.addLog("loaded: Componente completamente cargado");
              console.log("Componente completamente cargado");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo, puedes observar el orden de ejecución y el momento de los diferentes ganchos del ciclo de vida. Cuando haces clic en el botón "Eliminar componente", puedes ver que se activa el gancho `detached`.

## Escenarios de aplicación reales

### Operación de inicialización

En el hook `ready` realizar la inicialización de datos:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // Operaciones del DOM
      this.initDomElements();
    }
  };
};
```

### Gestión de recursos

Inicia el temporizador en el gancho `attached` y limpia los recursos en el gancho `detached`:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Iniciar temporizador
      this.timer = setInterval(() => {
        console.log('Tarea programada ejecutada');
      }, 1000);
    },
    detached() {
      // Limpiar temporizador
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Las funciones de ciclo de vida (lifecycle hooks) son un concepto importante en el desarrollo de componentes de ofa.js. Usarlas correctamente puede ayudarte a gestionar mejor el estado y los recursos de los componentes, mejorando el rendimiento de la aplicación.

