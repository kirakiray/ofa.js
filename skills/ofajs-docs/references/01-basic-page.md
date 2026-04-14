# Basic Page Structure

## index.html (Application Entry)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js App</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

## demo-page.html (Page Module)
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
    export default async () => {
      return {
        data: {
          val: "Hello ofa.js",
        },
      };
    };
  </script>
</template>
```

## Key Points
- `<template page>` defines a page module
- `:host` selector styles the component root element
- `{{val}}` renders data binding
- Default export returns `{ data: {...} }` object
