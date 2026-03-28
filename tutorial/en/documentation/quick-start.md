# Quick Start

This section will introduce how to quickly get started with ofa.js. In the following tutorials, we will omit the creation steps for the index.html entry file and only showcase the code for the page module files. You can directly start development based on the template.

## Prepare Base Files

To get started quickly with ofa.js, you only need to create a **page module** along with an entry HTML file. The core files required are as follows:

- `index.html`: The entry file of the application, responsible for loading the ofa.js framework and importing page modules
- `demo-page.html`: Page module file, defining the specific content, styles, and data logic of the page

### index.html (Application Entry Point)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Example</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

The main purpose of this file is:- Introduce the ofa.js framework
- Use the `<o-page>` component to load and render page modules

### demo-page.html (Page Module)

```html
<!-- demo-page.html -->
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
    p {
      color: pink;
    }
  </style>
  <p>{{val}}</p>
  <script>
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

The file defines a simple page component, including:- `<template page>` tag, defines a page module  
- CSS styles (using Shadow DOM's `:host` selector)  
- Data binding expression `{{val}}`  
- JavaScript logic that returns an object with initial data


## Online Demo

Below is a real-time example in the online editor, you can directly modify the code and view the effects:

<o-playground name="Online Demo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p {
          color: pink;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

We define styles using the `<style>` tag inside the component; these internal styles only affect the component itself, offering good encapsulation and leaving other elements on the page unaffected.

The `:host` selector is used to define styles for the component's host element; here we set the component to be a block-level element with a red border and 10px of padding.

Through the `{{key}}` expression, you can render the corresponding value from the component data onto the page.

Now you have successfully created your first ofa.js application! Next, let's dive deeper into ofa.js's template rendering syntax and its advanced features.