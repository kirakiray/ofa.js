# Single Page Application

A single-page application binds the `o-app` component to the browser’s address bar, keeping the web URL synchronized with the in-app page path. After enabling the single-page application:

- Refreshing the page preserves the current route state
- Copying the URL from the address bar and opening it in another browser or tab also restores the application state
- The browser's forward/back buttons work properly

## Basic Usage

Wrap the `o-app` component with the official `o-router` component to implement a single-page application.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body attribute

After adding the `fix-body` attribute, `o-router` will automatically reset the styles of `html` and `body`, removing the default margin and padding.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

This is particularly useful in the following scenarios:- `o-app` needs to fill the viewport completely  
- When the app is the only content of the page

## Example

<o-playground name="Single Page Application Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // Application home page URL
    export const home = "./home.html";
    // Page transition animation configuration
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
      <a href="./about.html" olink>Go to About</a>
      <br>
      <br>
      <button on:click="gotoAbout">Go to About Button</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
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
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## How It Works

Single-page application implemented using browser-based Hash mode:

1. When the page switches inside the app, `o-router` automatically updates the hash in the address bar (e.g., `#/about.html`).
2. When users refresh the page or visit via URL, `o-router` reads the hash and loads the corresponding page.
3. The browser’s forward/back buttons trigger hash changes, thereby controlling in-app navigation.

## URL Change Examples

Assume the application has two pages, `home.html` and `about.html`.

| User Action | Address Bar Change |
|---|---|
| Open App | `index.html` → `index.html#/home.html` |
| Navigate to About Page | `index.html#/home.html` → `index.html#/about.html` |
| Click Back | `index.html#/about.html` → `index.html#/home.html` |
| Refresh Page | Keep current hash unchanged |## Usage Restrictions

- A single-page application can only work with **one** `o-app` component.