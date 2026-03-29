# Enlace de Clases y Estilos

En ofa.js, puedes lograr una gestión flexible del estado de la UI mediante el enlace dinámico de nombres de clase, estilos y atributos. Esto permite que la interfaz se ajuste automáticamente a los cambios en los datos.

## Enlace de Clases

El enlace de clases te permite agregar o eliminar clases CSS dinámicamente según el estado de los datos. Puedes usar la sintaxis `class:className="booleanExpression"` para enlazar una clase específica.

Cuando `booleanExpression` es `true`, el nombre de la clase se agrega al elemento; cuando es `false`, el nombre de la clase se elimina.

### Enlace de clases básicas

<o-playground name="Clase de enlace básica" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Alternar visualización</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hola, código de demostración de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Enlace de múltiples clases

También puedes vincular múltiples clases simultáneamente, permitiendo que el elemento tenga diferentes estados de apariencia según distintas condiciones.

<o-playground name="Múltiples enlaces de clases" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Alternar Estados</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Estado Actual - Activo: {{isActive}}, Deshabilitado: {{isDisabled}}, Resaltado: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Enlace de estilos

La vinculación de estilos te permite establecer directamente los valores de estilos en línea, admitiendo actualizaciones dinámicas. ofa.js proporciona dos métodos de vinculación de estilos:

### Enlace de un solo atributo de estilo

Utiliza la sintaxis `:style.propertyName` para enlazar propiedades de estilo específicas.

<o-playground name="Enlace de atributo de estilo único" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Cambiar Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hola de Demo Code ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Vinculación de atributos de múltiples estilos

También puedes enlazar varias propiedades de estilo a la vez:

<o-playground name="Vinculación de atributos de estilo múltiple" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Ejemplo de Estilos Dinámicos
      </p>
      <button on:click="changeStyles">Cambiar Estilos</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Enlace de atributos

Además de la vinculación de clases y estilos, también puedes vincular dinámicamente otros atributos HTML. ofa.js utiliza la sintaxis `attr:attributeName` para realizar la vinculación de atributos.

### Enlace de atributos básicos

<o-playground name="Enlace de atributos básicos" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "Esta es un mensaje de información",
              val: "Pasa el cursor sobre mí para ver el título",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Manejo de atributos booleanos

Para atributos de tipo booleano (como `disabled`, `hidden`), ofa.js decide si añadir el atributo según el valor verdadero o falso del dato enlazado.

<o-playground name="Manejo de atributos booleanos" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Escriba aquí..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Haz clic en mí</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Alternar todos los estados
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('¡Botón pulsado!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Funciones de datos dentro de etiquetas de estilo

Puedes usar `data(xxx)` en los estilos para enlazar datos del componente. Esto es muy adecuado para escenarios en los que los estilos deben cambiar dinámicamente según los datos del componente.

<o-playground name="Función de datos dentro de etiquetas de estilo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p:hover{
          color:red;
        }
      </style>
      <style>
        p {
          font-size: data(size);
          color:green;
          transition: all data(time)s ease;
        }
      </style>
      TamañoFuente: <input type="number" sync:value="size" placeholder="Este es un campo de entrada con enlace bidireccional" />
      <br />
      TiempoTransición: <input type="number" step="0.3" min="0" sync:value="time" placeholder="Este es un campo de entrada con enlace bidireccional" />
      <p>{{val}} - tamaño: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Código de demostración de ofa.js",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Precauciones

Lo que está dentro de `style` en `data(xxx)` técnicamente reemplaza todo el contenido de style, por lo que es mejor escribir solo los estilos relacionados con data dentro de style, y poner los que no necesitan data en otro style, así el rendimiento es mejor.

```html
<!-- ❌ El p:hover sin data(xxx) también será actualizado -->
<style>
  p {
    font-size: data(size);
    color: green;
    transition: all data(time)s ease;
  }
  p:hover {
    color: red;
  }
</style>
``````html
<!-- ✅ Solo los estilos que contienen data(xxx) serán re-renderizados -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```