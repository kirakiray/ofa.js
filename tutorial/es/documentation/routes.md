# Aplicación de página única

Una aplicación de una sola página vincula el componente `o-app` con la barra de direcciones del navegador, manteniendo sincronizada la URL de la página con la ruta de la página dentro de la aplicación. Tras habilitar la aplicación de una sola página:

- Actualizar la página web puede mantener el estado actual de la ruta
- Copiar la URL de la barra de direcciones y abrirla en otro navegador o pestaña también puede restaurar el estado de la aplicación
- Los botones de avance/retroceso del navegador funcionan correctamente

## Uso básico

使用官方的 `o-router` 组件包裹 `o-app` 组件，即可实现单页面应用。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>prueba de router</title>
    <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## atributo fix-body

Después de agregar el atributo `fix-body`, `o-router` restablecerá automáticamente los estilos de `html` y `body`, eliminando los márgenes y rellenos predeterminados.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

Esto es especialmente útil en los siguientes escenarios:- Se requiere que `o-app` llene completamente el viewport
- Cuando la aplicación es el único contenido de la página

## Ejemplo

<o-playground name="Ejemplo de aplicación de una sola página" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>Ir a Acerca de</a>
      <br>
      <br>
      <button on:click="gotoAbout">Botón Ir a Acerca de</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Demo de Aplicación de ofa.js",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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
      <p> Acerca de <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hola Demo de Aplicación de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Cómo funciona

单页面应用基于浏览器的 Hash 模式实现：

1. Cuando se produce un cambio de página dentro de la aplicación, `o-router` actualiza automáticamente el valor hash en la barra de direcciones (por ejemplo, `#/about.html`)
2. Cuando el usuario actualiza la página o accede a través de una URL, `o-router` lee el valor hash y carga la página correspondiente
3. Los botones de avance/retroceso del navegador activan cambios en el hash, controlando así la navegación de páginas de la aplicación

## Ejemplo de cambio de URL

Supongamos que la aplicación tiene dos páginas `home.html` y `about.html`:

| Acción del usuario | Cambio en la barra de direcciones |
|---------|-----------|
| Abrir la aplicación | `index.html` → `index.html#/home.html` |
| Saltar a la página Acerca de | `index.html#/home.html` → `index.html#/about.html` |
| Hacer clic en Atrás | `index.html#/about.html` → `index.html#/home.html` |
| Actualizar la página | Mantiene el hash actual sin cambios |## Limitaciones de uso

- Las aplicaciones de página única solo pueden funcionar con **un** componente `o-app`