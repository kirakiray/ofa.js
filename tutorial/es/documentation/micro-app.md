# Microaplicación

Usa `o-app` para aplicación, esta etiqueta representa una microaplicación, que cargará el archivo de configuración `app-config.js`, el cual define la dirección de la página de inicio y la configuración de animación de cambio de página.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// Dirección de la página de inicio de la aplicación
export const home = "./home.html";

// Configuración de animación de cambio de página
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

<o-playground name="Ejemplo de microaplicación" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Dirección de la página de inicio de la aplicación
    export const home = "./home.html";
    // Configuración de animación de cambio de página
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html?id=10010" olink>Ir a About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Ir a About (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Demo de App de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Atrás</button> </div>
      <p>{{val}}</p>
      <p> Acerca de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hola Demo de App de ofa.js (desde ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - dirección de la página de inicio

Especifica la ruta del módulo de la página de inicio que se carga al iniciar la aplicación, compatible con rutas relativas y absolutas.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Animación de transición de página

Controla los efectos de animación de transición al cambiar de página, incluye tres estados:

| Estado | Descripción |
|------|------|
| `current` | Estilo de la página actual después de la animación |
| `next` | Estilo inicial al entrar en una nueva página |
| `previous` | Estilo objetivo al salir de la página anterior |```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## Forma de pasar parámetros

En `o-app`, la navegación entre páginas admite pasar parámetros a través de la URL Query, y la página de destino los recibe mediante el parámetro `query` de la función del módulo.

## Navegación de página

Dentro de o-app, cada módulo de página puede usar la etiqueta `<a>` con el atributo `olink` para cambiar de página. Esta etiqueta activa el cambio de ruta de la aplicación, incluye animaciones de transición y no recarga toda la página.

```html
<a href="./about.html" olink>Ir a la página acerca</a>
```

En el componente de página, puedes utilizar el método `back()` para volver a la página anterior:

```html
<template page>
  <button on:click="back()">Volver</button>
</template>
```