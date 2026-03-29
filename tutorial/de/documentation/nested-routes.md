# Verschachtelte Seiten/Routen

In ofa.js sind verschachtelte Seiten (auch als verschachtelte Routen bezeichnet) eine leistungsstarke Funktion, die es dir ermöglicht, Seitenstrukturen mit Eltern-Kind-Hierarchien zu erstellen. Die übergeordnete Seite fungiert als Layout-Container und rendert den Inhalt der untergeordneten Seite über ein `<slot>`-Element.

## Grundlegende Konzepte

- **Übergeordnete Seite (Layout)**: Eine Seite, die als Layout-Container dient und gemeinsame UI-Elemente wie Navigationsleiste, Seitenleiste usw. enthält
- **Untergeordnete Seite**: Der konkrete Inhalt einer Geschäftsseite, der in den `<slot>`-Steckplatz der übergeordneten Seite gerendert wird

## Schreibweise der Übersichtsseite

Die übergeordnete Seite muss das `<slot></slot>`-Tag verwenden, um einen Renderplatz für die untergeordnete Seite vorzusehen.

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

## Schreibweise von Unter-Seiten

Untergeordnete Seiten geben den Pfad der übergeordneten Seite durch den Export der Eigenschaft `parent` an.

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
    export const parent = 'layout.html'; // ⚠️ Schlüsselcode

    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

## Beispiel für verschachtelte Seiten

Im Folgenden finden Sie ein vollständiges Beispiel für verschachtelte Routen, einschließlich Root-Layout, übergeordneter Seite und untergeordneter Seite:

<o-playground name="Beispiel für verschachtelte Seiten" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Startseiten-Adresse der Anwendung
    export const home = "./sub-page01.html";
    // Konfiguration für Seitenwechsel-Animation
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
                <a href="./sub-page01.html" olink>Seite 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>Seite 2</a>
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
      <h1>Ich bin Unterseite 1</h1>
      <p>Aktuelle Route: {{src}}</p>
      <a href="./sub-page02.html" olink>Zu Seite 2 springen</a>
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
      <h1>Ich bin Unterseite 2</h1>
      <p>Aktuelle Route: {{src}}</p>
      <a href="./sub-page01.html" olink>Zu Seite 1 springen</a>
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

## Überwachung der Routing-Ereignisse der übergeordneten Seite

Die übergeordnete Seite kann den Lebenszyklus-Hook `routerChange` verwenden, um Änderungen der Route zu überwachen, was nützlich ist, wenn du den Navigationszustand basierend auf der aktuellen Route aktualisieren musst.

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

## Hinweise

- Der Wert der Eigenschaft `parent` kann ein relativer Pfad sein (z. B. `./layout.html`) oder ein absoluter Pfad (z. B. `/pages/layout.html`)
- Die übergeordnete Seite muss das Tag `<slot></slot>` enthalten, andernfalls kann der Inhalt der untergeordneten Seite nicht angezeigt werden
- Die Stile der übergeordneten Seite werden auf die untergeordnete Seite vererbt; die untergeordnete Seite kann jedoch auch eigene Stile definieren
- Mit dem Hook `routerChange` können Router-Änderungen überwacht werden, um Funktionen wie Navigations-Hervorhebung zu realisieren

## Mehrstufige Verschachtelung

Eine übergeordnete Seite kann ebenfalls ihre eigene übergeordnete Seite haben und so eine mehrstufige verschachtelte Struktur bilden.

```html
<!-- Unterseite -->
<template page>
  <p>Unterseiteninhalt</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- Elternseite -->
<template page>
  <div class="layout">
    <nav>Navigationsleiste</nav>
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

## 示例 für mehrstufige Verschachtelung

<o-playground name="Vollständiges Beispiel für verschachtelte Routen" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Startseiten-URL der Anwendung
    export const home = "./sub-page01.html";
    // Konfiguration für Seitenwechselanimationen
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
                <a href="./sub-page01.html" olink>Seite 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>Seite 2</a>
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
      <h1>Ich bin Unterseite 1</h1>
      <p>Aktuelle Route: {{src}}</p>
      <a href="./sub-page02.html" olink>Zu Seite 2 springen</a>
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
      <h1>Ich bin Unterseite 2</h1>
      <p>Aktuelle Route: {{src}}</p>
      <a href="./sub-page01.html" olink>Zu Seite 1 springen</a>
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

