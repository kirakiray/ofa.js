# Enlace de atributos

ofa.js admite la vinculación de datos a las propiedades de los objetos después de la instanciación de elementos, como el valor (value) o la propiedad checked de un elemento input.

## Enlace de propiedad unidireccional

El enlace unidireccional de atributos utiliza la sintaxis `:toKey="fromKey"` para sincronizar "unidireccionalmente" los datos del componente al atributo del elemento DOM. Cuando los datos del componente cambian, el atributo del elemento se actualiza instantáneamente; sin embargo, los cambios propios del elemento (como la entrada del usuario) no se escriben de vuelta al componente, manteniendo el flujo de datos único y controlable.

<o-playground name="Enlace unidireccional de propiedades" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valor actual: {{val}}</p>
      <input type="text" :value="val" placeholder="Este es un campo de entrada con enlace unidireccional">
      <p>Nota: modificar el contenido directamente en el campo no cambiará el valor mostrado arriba</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Enlace bidireccional de propiedades

El enlace bidireccional de atributos utiliza la sintaxis `sync:xxx`, logrando la sincronización bidireccional entre los datos del componente y los elementos DOM. Cuando cambian los datos del componente, se actualizan los atributos del elemento DOM; cuando cambian los atributos del elemento DOM (como la entrada del usuario), también se actualizan automáticamente los datos del componente.

<o-playground name="Enlace de propiedad bidireccional" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valor actual: {{val}}</p>
      <input type="text" sync:value="val" placeholder="Este es un campo de entrada con enlace bidireccional">
      <p>Sugerencia: modificar el contenido en el campo actualizará el valor mostrado arriba en tiempo real</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Características del enlace bidireccional

- Flujo de datos: Componente ↔ Elemento DOM (bidireccional)
- Cambios en datos del componente → Actualización del elemento DOM
- Cambios en el elemento DOM → Actualización de datos del componente
- Aplicable en escenarios que requieren entrada del usuario y sincronización de datos

### Escenarios comunes de enlace de datos bidireccional

<o-playground name="Ejemplo de enlace bidireccional de formulario" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Ejemplo de enlace bidireccional de formulario</h3>
      <div class="form-group">
        <label>Campo de texto:</label>
        <input type="text" sync:value="textInput" placeholder="Ingresa texto">
      </div>
      <div class="form-group">
        <label>Campo numérico:</label>
        <input type="number" sync:value="numberInput" placeholder="Ingresa un número">
      </div>
      <div class="form-group">
        <label>Texto multilínea:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Ingresa texto multilínea"></textarea>
      </div>
      <div class="form-group">
        <label>Selector:</label>
        <select sync:value="selectedOption">
          <option value="">Selecciona...</option>
          <option value="option1">Opción 1</option>
          <option value="option2">Opción 2</option>
          <option value="option3">Opción 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Casilla de verificación:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> Acepto los términos
        </label>
      </div>
      <div class="preview">
        <h4>Vista previa en tiempo real:</h4>
        <p>Texto: {{textInput}}</p>
        <p>Número: {{numberInput}}</p>
        <p>Texto multilínea: {{textareaInput}}</p>
        <p>Selección: {{selectedOption}}</p>
        <p>Estado de la casilla: {{isChecked ? 'Marcada' : 'No marcada'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Precauciones

1. **Consideraciones de rendimiento**：El enlace bidireccional crea observadores de datos, y el uso excesivo puede afectar el rendimiento
2. **Consistencia de datos**：El enlace bidireccional garantiza la consistencia entre datos y vista, pero hay que tener cuidado de evitar bucles infinitos de actualización
3. **Configuración de valores iniciales**：Asegurar que los datos enlazados tengan valores iniciales apropiados, para evitar problemas de visualización de undefined
4. **Conflictos de eventos**：Evitar usar simultáneamente enlace bidireccional y manejo manual de eventos en el mismo elemento, para evitar conflictos