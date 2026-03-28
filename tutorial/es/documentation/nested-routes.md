# Páginas/Rutas anidadas

En ofa.js, las páginas anidadas (también conocidas como rutas anidadas) son una función poderosa que te permite crear estructuras de páginas con relaciones jerárquicas padre-hijo. La página padre actúa como un contenedor de diseño y renderiza el contenido de las páginas hijas a través de la ranura `<slot>`.

## Conceptos básicos

- **Página padre (Layout)**: actúa como contenedor de diseño e incluye elementos UI comunes como la barra de navegación y la barra lateral  
- **Página hija**: contenido específico de la página de negocio que se renderiza en la posición del `<slot>` de la página padre

## Cómo escribir la página padre

La página padre necesita utilizar la etiqueta `<slot></slot>` para reservar un lugar de renderizado para la página hija.

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
    ...
  </style>
  ...
  <div class="content">
    <slot></slot>
  </div>
  ...
</template>
```

## Escritura de subpáginas

Las subpáginas especifican la ruta de la página principal exportando la propiedad `parent`.

```html
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
    export const parent = 'layout.html'; // ⚠️ 关键代码

    export default async () => {
      return {
        data: {
          val: "Hola, código de demostración de ofa.js",
        },
      };
    };
  </script>
</template>
```

## Ejemplo de página anidada

Aquí hay un ejemplo completo de rutas anidadas, que incluye el diseño raíz, la página principal y las páginas secundarias:

<o-playground name="Ejemplo de página anidada" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Dirección de la página de inicio de la aplicación
    export const home = "./sub-page01.html";
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
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>Página 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>Página 2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>Soy la subpágina 1</h1>
      <p>Ruta actual: {{src}}</p>
      <a href="./sub-page02.html" olink>Ir a la página 2</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>Soy la subpágina 2</h1>
      <p>Ruta actual: {{src}}</p>
      <a href="./sub-page01.html" olink>Ir a la página 1</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Escucha de rutas en la página padre

La página padre puede escuchar los cambios de ruta mediante el gancho del ciclo de vida `routerChange`, lo cual es útil cuando necesitas actualizar el estado de navegación según la ruta actual.

```html
<template page>
  ...
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## Precauciones

- El valor del atributo `parent` puede ser una ruta relativa (como `./layout.html`) o una ruta absoluta (como `/pages/layout.html`)
- La página padre debe contener la etiqueta `<slot></slot>`, de lo contrario, el contenido de la página secundaria no se mostrará
- Los estilos de la página padre se heredarán a la página secundaria, y la página secundaria también puede definir sus propios estilos
- Usar el hook `routerChange` permite escuchar los cambios de ruta y lograr funciones como el resaltado de navegación

## Anidación multinivel

Una página padre también puede tener su propia página padre, formando una estructura multinivel anidada.

```html
<!-- Subpágina -->
<template page>
  <p>Contenido de la subpágina</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- Página principal -->
<template page>
  <div class="layout">
    <nav>Barra de navegación</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## Ejemplo de anidamiento multinivel

<o-playground name="Ejemplo completo de rutas anidadas" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Dirección de la página de inicio de la aplicación
    export const home = "./sub-page01.html";
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
  <code path="root-layout.html">
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
          border: 1px dashed gray;
        }
        .root {
          height: 100%;
          word-break: break-word;
          padding: 10px;
        }
      </style>
      <div style="text-align: center;font-weight: bold;">Root Layout</div>
      <div class="root">
        <slot></slot>
      </div>
      <script>
        export default () => {
          return { data: {} };
        };
      </script>
    </template>
  </code>
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>Página 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>Página 2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export const parent = "./root-layout.html";
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>Soy la página hija 1</h1>
      <p>Ruta actual：{{src}}</p>
      <a href="./sub-page02.html" olink>Ir a la página 2</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>Soy la página hija 2</h1>
      <p>Ruta actual：{{src}}</p>
      <a href="./sub-page01.html" olink>Ir a la página 1</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

