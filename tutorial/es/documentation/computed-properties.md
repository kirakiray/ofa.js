# Propiedades calculadas

Las propiedades computadas son una forma de derivar nuevos datos a partir de datos reactivos; se actualizan automáticamente cuando cambian los datos de los que dependen. En ofa.js, las propiedades computadas se definen como métodos especiales dentro del objeto `proto`, utilizando las palabras clave `get` o `set` de JavaScript.

## Características y ventajas

- **Almacenamiento en caché**: el resultado de la propiedad calculada se almacena en caché y solo se recalcula cuando cambian los datos de los que depende  
- **Reactiva**: cuando se actualizan los datos de los que depende, la propiedad calculada se actualiza automáticamente  
- **Declarativa**: se crean relaciones de dependencia de forma declarativa, lo que hace que el código sea más claro y fácil de entender

## get Propiedad calculada

La propiedad `get` se utiliza para derivar nuevos valores a partir de datos reactivos, no acepta parámetros y solo devuelve un valor calculado basado en otros datos.

<o-playground name="get Ejemplo de propiedad calculada" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>El valor de la propiedad calculada countDouble es：{{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble fue accedida');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Ejemplos de escenarios de aplicación práctica

Las propiedades computadas se utilizan comúnmente para manejar lógicas complejas de transformación de datos, como filtrar arreglos, formatear texto de visualización, etc.:

<o-playground name="Ejemplo de propiedad calculada" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="Filtrar nombres...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['Juan', 'María', 'Carlos']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set Propiedad calculada

Los `set` de las propiedades computadas te permiten modificar el estado de datos subyacente mediante operaciones de asignación. Recibe un parámetro, que generalmente se utiliza para actualizar inversamente los datos originales de los que depende.

<o-playground name="set ejemplo de propiedad calculada" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>Valor base: {{count}}</p>
        <p>Valor doble: {{countDouble}}</p>
        <button on:click="resetCount">Restablecer contador</button>
        <button on:click="setCountDouble">Establecer valor doble a 10</button>
        <button on:click="incrementCount">Incrementar valor base</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // Asegura que count no sea negativo
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Propiedades calculadas vs métodos

Aunque los métodos también pueden lograr funcionalidades similares, las propiedades computadas tienen la característica de almacenamiento en caché y solo se recalculan cuando los datos de los que dependen cambian, lo que resulta en un mejor rendimiento.

```javascript
// Usar propiedades computadas (recomendado) - con caché
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Usar un método - se ejecuta cada vez que se llama
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Precauciones

1. **Evitar operaciones asíncronas**: Las propiedades calculadas deben mantenerse sincrónicas y sin efectos secundarios, prohibiendo llamadas asíncronas o modificaciones directas del estado del componente dentro de ellas.  
2. **Seguimiento de dependencias**: Asegúrese de depender únicamente de datos reactivos; de lo contrario, las actualizaciones serán impredecibles.  
3. **Protección contra errores**: Si dentro de una propiedad calculada se produce una dependencia circular o una asignación anómala, podría provocar fallos en la renderización o incluso bucles infinitos. Es crucial establecer condiciones límite de antemano y manejar adecuadamente las excepciones.

## Ejemplo de aplicación práctica

A continuación se muestra un ejemplo simple de validación de formularios, que demuestra la utilidad de las propiedades computadas：

<o-playground name="Ejemplo de validación de formulario" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>Ejemplo de validación simple</h3>
      <input type="text" sync:value="username" placeholder="Ingrese nombre de usuario (al menos 3 caracteres)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Estado: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'Nombre de usuario válido' : 'Longitud del nombre de usuario insuficiente';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

