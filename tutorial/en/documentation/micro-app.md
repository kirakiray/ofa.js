# Micro App

Use `o-app` for appification, this tag represents a micro-application, it will load the `app-config.js` configuration file, which defines the home page address and page transition animation configuration.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// Application home page address
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
    // Home page address of the app
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
</o-playground>

## home - Homepage URL

Specifies the path to the home page module loaded when the app starts; both relative and absolute paths are supported.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - Page Switch Animation

Control the transition animation effect when switching pages, including three states:

| Status | Description |
|------|------|
| `current` | Styles after the current page animation ends |
| `next` | Initial styles when the new page enters |
| `previous` | Target styles when the old page exits |```javascript
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

## Parameter Passing Methods

In `o-app`, page navigation supports passing parameters via URL Query, and the target page receives them through the `query` parameter of the module function.

## Page Navigation

Within the o-app, each page module can use an `<a>` tag with the `olink` attribute to switch pages. This tag triggers the application's route switching, includes a transition animation, and does not refresh the entire page.

```html
<a href="./about.html" olink>Go to About page</a>
```

In the page component, you can use the `back()` method to go back to the previous page:

```html
<template page>
  <button on:click="back()">Back</button>
</template>
```