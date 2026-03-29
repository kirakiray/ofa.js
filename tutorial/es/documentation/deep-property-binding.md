# Comprender la vinculación de propiedades

En el contenido anterior, ya se presentó brevemente el uso básico del [enlace de propiedades](./property-binding.md). El caso anterior se utilizó para enlazar la propiedad `value` de elementos nativos del navegador (como `textarea`); en esta sección se profundizará en la esencia del enlace de propiedades: en realidad se enlaza a la propiedad JavaScript del componente después de su instanciación, no al atributo HTML.

## Mecanismo de enlace de propiedades del componente

En ofa.js, cuando usamos la sintaxis `:toProp="fromProp"` en el componente padre, estamos estableciendo la propiedad JavaScript de la instancia del componente hijo, no el atributo HTML. Esto difiere significativamente de establecer directamente un atributo HTML (como `attr:toKey="fromKey"`).

El siguiente ejemplo demuestra cómo pasar datos a un componente personalizado mediante enlace de propiedades:

<o-playground name="Comprender el enlace de atributos" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo:- El dato `val` del componente padre se enlaza a la propiedad `fullName` del componente hijo `<demo-comp>`
- Utiliza la sintaxis `:full-name="val"` para pasar el valor de `val` del componente padre a la propiedad `fullName` del componente hijo
- Después de recibir el valor, el componente hijo lo muestra en la plantilla mediante `{{fullName}}`

## Enlace de atributos vs herencia de propiedades de características

Es importante tener en cuenta que el enlace de atributos (`:）y la herencia de atributos de características (`attr:`）presentan las siguientes diferencias clave：

### Enlace de atributos (`:`)

- Propiedades de JavaScript vinculadas a la instancia del componente
- Los datos pasados mantienen su tipo original (cadena, número, booleano, etc.)
- Se pueden acceder y modificar directamente dentro del componente, incluso sin definir `data` previamente dentro del componente

### Herencia de atributos de características (`attr:`)

- Establecer atributos HTML
- Todos los valores se convertirán en cadenas
- Se utiliza principalmente para pasar atributos a elementos DOM subyacentes
- Requiere un manejo especial para analizar datos complejos
- Debe definir `attrs` dentro del componente por adelantado para recibir los valores de los atributos

Comparación de gramática:```html
<!-- Enlace de atributos: pasar valores JavaScript, mantener tipos de datos -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Herencia de atributos: establecer atributos HTML, todos los valores se convierten en cadenas -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- Se pasa realmente la cadena "42" -->
```

## Diferencias de comparación de casos

<o-playground name="Comparación de diferencias entre casos" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

Donde `vone` es una propiedad de la instancia del componente y `vtwo` es un atributo HTML; el valor del atributo será seleccionado por el selector `[vtwo]` y se le aplicarán los estilos, mientras que `vone`, al ser una propiedad de la instancia del componente, no será seleccionada por el selector `[vone]`.

## Enlace de datos bidireccional

Los componentes instanciados también admiten el enlace de datos bidireccional, utilizando la sintaxis `sync:toProp="fromProp"`. El enlace bidireccional permite la sincronización de datos entre el componente padre y el componente hijo; cuando los datos en cualquiera de los lados cambian, el otro lado también se actualiza en consecuencia.

> A diferencia de Angular y Vue, ofa.js no requiere configuración especial u operaciones adicionales para los componentes, y puede soportar de forma nativa la sintaxis de enlace de datos bidireccional.

### Ejemplo de enlace bidireccional

El siguiente ejemplo muestra cómo establecer un enlace de datos bidireccional entre un componente padre y un componente hijo:

<o-playground name="Ejemplo de enlace bidireccional" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Valor en el componente padre: {{val}}</h3>
      <p>Modifica el valor del componente padre mediante el campo de entrada:</p>
      <input type="text" sync:value="val" placeholder="Introduce texto en el campo...">
      <p>Modifica el valor del componente padre desde el componente hijo:</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Valor mostrado en el componente hijo: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="Introduce en el campo del hijo...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En este ejemplo:- El `val` del componente padre y el `fullName` del componente hijo implementan el enlace bidireccional a través de `sync:full-name="val"`
- Cuando se introduce contenido en el cuadro de entrada del componente padre, el componente hijo muestra inmediatamente el nuevo valor
- Cuando se introduce contenido en el cuadro de entrada del componente hijo, el componente padre también actualiza la visualización inmediatamente

### Diferencia entre el enlace bidireccional y el enlace de propiedades común

| Característica | Enlace de propiedad normal (`:)` | Enlace bidireccional (`sync:`) |
|----------------|----------------------------------|--------------------------------|
| Flujo de datos | Unidireccional: padre → hijo | Bidireccional: padre ↔ hijo |
| Sintaxis | `:prop="value"` | `sync:prop="value"` |
| Modificación del componente hijo | No afecta al componente padre | Afecta al componente padre |
| Escenario de uso | Pasar configuración del padre al hijo | Necesita sincronización de datos padre-hijo |### Precauciones

1. **Consideraciones de rendimiento**: El enlace bidireccional desencadena un nuevo renderizado cuando cambian los datos, por lo que debe usarse con precaución en escenarios complejos.
2. **Control del flujo de datos**: Un exceso de enlaces bidireccionales puede dificultar el seguimiento del flujo de datos; se recomienda diseñar de manera adecuada la comunicación entre componentes.
3. **Compatibilidad de componentes**: No todos los componentes son adecuados para usar enlace bidireccional; es necesario considerar el propósito de diseño del componente.