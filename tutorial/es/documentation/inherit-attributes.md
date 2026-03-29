# Propagar atributos de características

En ofa.js, los [atributos](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attributes) son una de las formas más comunes de pasar datos entre componentes. Simplemente declarando los atributos necesarios en el objeto `attrs` del componente, se pueden pasar datos externos al interior del componente al utilizarlo.

## Uso básico

### Definir propiedades de recepción

Antes de usar el componente, es necesario declarar los atributos que se necesitan recibir en el objeto `attrs` del componente. Los atributos pueden establecer valores predeterminados.

<o-playground name="Ejemplo de uso básico" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp first="OFA" full-name="Ejemplo de componente OFA"></demo-comp>
      <br>
      <demo-comp first="NoneOS" full-name="Caso de uso de NoneOS"></demo-comp>
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
      </style>
      <p>First: {{first}}</p>
      <p>Nombre completo: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              first: null,
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Reglas importantes

1. **Restricción de tipo**: Los valores de atributo pasados deben ser cadenas de texto; otros tipos se convertirán automáticamente a cadenas.

2. **Conversión de nombres**: Dado que los atributos HTML no distinguen entre mayúsculas y minúsculas, al pasar atributos que contengan letras mayúsculas, es necesario usar `-` para separar los nombres (formato kebab-case).
   - Por ejemplo: `fullName` → `full-name`

3. **Definición obligatoria**: Si el componente no define el atributo correspondiente en el objeto `attrs`, no podrá recibir ese atributo. El valor establecido es el valor predeterminado; si no se desea un valor predeterminado, se debe establecer como `null`.

<o-playground name="Ejemplo de regla importante" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
      <demo-comp user-name="Zhang San" age="25"></demo-comp>
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
      </style>
      <p>Nombre de usuario: {{userName}}</p>
      <p>Edad: {{age}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              userName: "Nombre por defecto",
              age: "0"
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Sintaxis de plantilla - Pasar Atributos

En la plantilla de un componente, se puede usar la sintaxis `attr:toKey="fromKey"` para pasar los datos de `fromKey` del componente actual a la propiedad `toKey` del componente secundario.

<o-playground name="Ejemplo de paso de atributos" style="--editor-height: 500px">
  <code path="demo.html" preview>
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
      <textarea sync:value="val"></textarea>
      <br>
      👇
      <demo-comp attr:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
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
        }
      </style>
      <p>Full Name: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs: {
              fullName:""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Transferencia multinivel

Puedes pasar atributos a través de múltiples capas de componentes anidados.

Si un componente necesita depender de otros componentes, es necesario importar los módulos de los otros componentes en el componente.

<o-playground name="Ejemplo de передача de datos multinivel" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer-comp.html"></l-m>
      <outer-comp user-name="Datos superiores"></outer-comp>
    </template>
  </code>
  <code path="outer-comp.html" active>
    <template component>
      <l-m src="./inner-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid blue;
          padding: 8px;
          margin-bottom: 8px;
        }
      </style>
      <p>Componente externo recibe: {{userName}}</p>
      <inner-comp attr:user-name="userName"></inner-comp>
      <script>
        export default async ({ load }) => {
          return {
            tag: "outer-comp",
            attrs: {
              userName: ""
            },
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
          border: 1px solid green;
          padding: 8px;
          margin-left: 20px;
        }
      </style>
      <p>Componente interno recibe: {{userName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "inner-comp",
            attrs: {
              userName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

