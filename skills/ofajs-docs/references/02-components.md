# Creating Components

## Component File (demo-comp.html)
```html
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async () => {
      return {
        tag: "demo-comp",
        data: {
          title: "Component Title",
        },
      };
    };
  </script>
</template>
```

## Using Component
```html
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp></demo-comp>
</template>
```

## Synchronous Load
```javascript
export default async ({ load }) => {
  await load("./demo-comp.html");
  return {
    data: {},
    proto: {},
  };
};
```

## Key Points
- `<template component>` with `tag` property defines component
- `l-m` tag asynchronously loads component modules
- `load()` method synchronously loads components
- `tag` name must match usage tag name
