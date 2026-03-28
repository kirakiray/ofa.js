# Inicio rápido

Esta sección presentará cómo comenzar rápidamente a usar ofa.js. En los tutoriales posteriores, omitiremos el paso de crear el archivo de entrada index.html y solo mostraremos el código del archivo del módulo de página. Puede comenzar a desarrollar directamente basándose en la plantilla.

## Preparar archivos básicos

Para empezar rápidamente con ofa.js, simplemente cree un **módulo de página** y lo combine con el HTML de entrada, los archivos principales necesarios son los siguientes:

- `index.html`: archivo de entrada de la aplicación, encargado de cargar el framework ofa.js e importar el módulo de página
- `demo-page.html`: archivo de módulo de página, define el contenido específico, estilos y lógica de datos de la página

### index.html (Punto de entrada de la aplicación)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ejemplo de ofa.js</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

La función principal de este archivo es:- Importar el framework ofa.js
- Usar el componente `<o-page>` para cargar y renderizar módulos de página

### demo-page.html (módulo de página)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hola, Código Demo de ofa.js",
        },
      };
    };
  </script>
</template>
```

Este archivo define un componente de página simple que incluye:- Etiqueta `<template page>`, define el módulo de la página
- Estilos CSS (utilizando el selector `:host` de Shadow DOM)
- Expresión de enlace de datos `{{val}}`
- Lógica JavaScript, devuelve un objeto que contiene los datos iniciales


## Demostración en línea

Aquí hay un ejemplo en vivo en el editor en línea, puedes modificar el código directamente y ver el efecto:

<o-playground name="Demostración en línea" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
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
</o-playground>

Definimos estilos a través de la etiqueta `<style>` dentro del componente. Estos estilos internos solo afectan al interior del componente, ofreciciendo una buena encapsulación y sin influir en otros elementos de la página.

其中 `:host` 选择器用于定义组件宿主元素的样式，这里我们将组件设置为块级元素，并添加红色边框和 10px 的内边距。

Mediante la expresión `{{key}}`, se puede renderizar en la página el valor correspondiente en los datos del componente.

¡Ahora has creado con éxito tu primera aplicación de ofa.js! A continuación, profundicemos en la sintaxis de renderizado de plantillas de ofa.js y sus características avanzadas.