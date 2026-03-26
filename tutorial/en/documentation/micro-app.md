# Mini App

Use `o-app` for application encapsulation; this tag represents a micro-app. It will load the `app-config.js` configuration file, which defines the app's home page URL and page transition animation settings.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
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
```

<o-playground name="Micro App Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // Home page URL of the app
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
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
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
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>## home - Homepage address

Specifies the path to the home page module loaded when the app starts; both relative and absolute paths are supported.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Page Transition Animation

Control the transition animation effects when switching pages, including three states:

| State | Description |
|-------|-------------|
| `current` | The style after the current page animation ends |
| `next` | The starting style when the new page enters |
| `previous` | The target style when the old page leaves |```javascript
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

## Parameter passing methods

In `o-app`, page navigation supports passing parameters through URL Query, and the target page receives them through the `query` parameter of the module function.

## Page Navigation

Within the o-app, each page module can use an `<a>` tag with the `olink` attribute for page navigation. This tag triggers the application's route switching, includes transition animations, and does not refresh the entire page.

```html
<a href="./about.html" olink>Go to About page</a>
```

In page components, you can use the `back()` method to return to the previous page:

```html
<template page>
  <button on:click="back()">Back</button>
</template>
```