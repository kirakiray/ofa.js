# Microaplicación

使用 `o-app` 进行应用化，这个标签就代表着一个微应用，它会加载 `app-config.js` 配置文件，该文件定义了应用的首页地址和页面切换动画配置。

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

<o-playground name="微应用示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 应用首页地址
    export const home = "./home.html";
    // 页面切换动画配置
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
      <a href="./about.html?id=10010" olink>Ir a Acerca de (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Ir a Acerca de (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola dea.js App Demo",
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
      <div style="padding: 8px;"> <button on:click="back()">Volver</button> </div>
      <p>{{val}}</p>
      <p> Acerca de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hola dea.js App Demo (desde ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - Página de inicio

Especifica la ruta del módulo de la página de inicio que se cargará al iniciar la aplicación; admite rutas relativas y absolutas.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Animación de transición de página

Controlar el efecto de animación de transición al cambiar de página, incluye tres estados:

| Estado | Descripción |
|--------|-------------|
| `current` | Estilo después de que finaliza la animación de la página actual |
| `next` | Estilo inicial cuando la nueva página entra |
| `previous` | Estilo objetivo cuando la página anterior sale |```javascript
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

## Métodos de paso de parámetros

En `o-app`, la navegación entre páginas admite el paso de parámetros mediante URL Query, y la página destino los recibe a través del parámetro `query` de la función del módulo.

## Navegación de página

En la aplicación o-app, cada módulo de página puede usar la etiqueta `<a>` con el atributo `olink` para cambiar de página. Esta etiqueta activa el enrutamiento de la aplicación, incluye animaciones de transición y no recarga toda la página.

```html
<a href="./about.html" olink>Ir a la página about</a>
```

En los componentes de página, se puede utilizar el método `back()` para volver a la página anterior:

```html
<template page>
  <button on:click="back()">Volver</button>
</template>
```