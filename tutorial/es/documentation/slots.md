# Slot

Las ranuras son espacios reservados en un componente para recibir contenido externo. Al utilizar ranuras, puedes crear componentes reutilizables y, al mismo tiempo, permitir que quien use el componente personalice su contenido interno.

## Slot predeterminado

<o-playground name="Ejemplo de ranura predeterminada" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>¡Hola, OFAJS!</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Contenido de la ranura:
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Contenido predeterminado del slot

Cuando el componente padre no proporciona contenido para el slot, los elementos dentro de `<slot></slot>` se mostrarán como contenido predeterminado.

<o-playground name="Ejemplo de contenido predeterminado de slot" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <h3>Con contenido de slot:</h3>
      <demo-comp>
        <div>Contenido personalizado</div>
      </demo-comp>
      <h3>Sin contenido de slot (muestra el contenido predeterminado):</h3>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>Contenido del slot:
      <span style="color: red;">
        <slot>
          <div>Este es el contenido predeterminado</div>
        </slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Slots con nombre

Cuando un componente necesita múltiples posiciones de slot, se pueden usar slots con nombre para distinguir diferentes slots. Para definir slots con nombre, se utiliza `<slot name="xxx">`, y al usarlos, se especifica en qué slot se coloca el contenido mediante el atributo `slot="xxx"`.

<o-playground name="Ejemplo de ranuras con nombre" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp>
        <div>¡Hola, OFAJS!</div>
        <div slot="footer">Contenido del pie de página</div>
      </demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
        }
      </style>Contenido de la ranura:
      <br />
      <span style="color: red;">
        <slot></slot>
      </span>
      <br />
      <span style="color: blue;">
        <slot name="footer"></slot>
      </span>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Paso de ranuras multinivel

El contenido de los slots puede transmitirse a través de múltiples niveles de componentes. Cuando un componente padre transmite contenido de slot a un componente hijo, este hijo puede seguir transmitiendo ese contenido de slot a sus propios componentes hijos, logrando así una propagación de slots en varias capas.

<o-playground name="Ejemplo de paso de slots multinivel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp>
        <div style="color: red;">Título del nivel más externo</div>
      </outer-comp>
    </template>
  </code>
  <code path="outer-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin-bottom: 10px;
        }
      </style>
      <h3>Componente externo</h3>
      <l-m src="./inner-comp.html"></l-m>
      <inner-comp>
        <div style="color: inherit;">
          <slot></slot>
        </div>
      </inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
          };
        };
      </script>
    </template>
  </code>
  <code path="inner-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
        }
      </style>
      <h4>Componente interno</h4>
      <slot></slot>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

En el ejemplo anterior:- El componente padre más externo define el contenido de `slot="header"`
- El componente externo (outer-comp) recibe este contenido de slot y lo pasa al componente interno (inner-comp)
- El componente interno finalmente renderiza el contenido del slot proveniente del nivel más externo