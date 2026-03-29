# Renderizado de plantillas

ofa.js proporciona un potente motor de renderizado de plantillas, con una rica sintaxis que permite a los desarrolladores construir aplicaciones rápidamente. Empezaremos por la representación de texto más común.

## Enlace de datos de página

En ofa.js, cada página tiene un objeto `data` donde puedes definir las variables que necesitas usar en la página. Cuando la página comienza a renderizarse, los datos del objeto `data` se enlazan automáticamente con la plantilla, y luego se utiliza la sintaxis `{{nombreDeVariable}}` en la plantilla para renderizar el valor de la variable correspondiente.

## Renderizado de texto

El renderizado de texto es la forma más básica de renderizado. Puedes usar la sintaxis `{{variable}}` en plantillas para mostrar los valores de las variables correspondientes en el objeto `data`.

<o-playground name="Ejemplo de renderizado de texto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola, código de demostración de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Renderizar contenido HTML

Al añadir la directiva `:html` a un elemento, la cadena HTML contenida en la variable correspondiente se analiza e inserta de forma segura dentro del elemento, permitiendo renderizar dinámicamente texto enriquecido o incrustar fragmentos HTML externos sin esfuerzo.

<o-playground name="Ejemplo de Renderización de Contenido HTML" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :html="val"></p>
      <script>
        export default async () => {
          return {
            data: {
              val: '<span style="color:green;">Hello ofa.js Demo Code</span>',
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

