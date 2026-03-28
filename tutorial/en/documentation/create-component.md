# Create Component

In ofa.js, components are the core mechanism for achieving page reuse and modularity. A component is essentially a custom Web Component that defines its own template, styles, and logic, enabling the creation of reusable UI elements.

## Basic Component Structure

Unlike page modules, component modules use the `component` attribute in the `<template>` element and declare a `tag` attribute to specify the component tag name.

At the location where a component needs to be used, asynchronously load the component module through the `l-m` tag, and the system will automatically complete the registration; you can then use the component directly like a regular HTML tag.

<o-playground name="Component Basic Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
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
              title: "OFAJS Component Example",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Component Core Concepts

### tag - Component tag name

`tag` is the component's tag name, **which must be consistent with the tag name used in the component**. For example, if your component's `tag` is defined as `"demo-comp"`, then when used in HTML, you must write `<demo-comp></demo-comp>`.

### Component Module Reference

Use the `l-m` tag to import a component module; the component will be auto-registered. It works like a `script` tag but is dedicated to loading and registering component modules.

> Note: The `l-m` reference tag is an **asynchronous reference**, suitable for loading components on demand when the page loads.

## Sync Quote Component

In some scenarios, you may need to load a component synchronously (e.g., to ensure it is fully registered before use). Use the `load` method with the `await` keyword to achieve synchronous referencing.

In both component modules and page modules, the `load` function is automatically injected to allow developers to synchronously load required resources.

<o-playground name="Synchronous Component Reference Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
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
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS Component Example",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Asynchronous Reference vs Synchronous Reference

| Quotation Method | Keywords | Characteristics |
|------------------|----------|-----------------|
| Asynchronous Reference | `l-m` tag | Non-blocking loading, suitable for on-demand component loading |
| Synchronous Reference | `load` method with `await` keyword | Blocking loading, ensures components are registered before use |Both the `l-m` tag reference and the `load` method can load component modules; in general, it is recommended to use the `l-m` tag for asynchronous component references to achieve non-blocking and on-demand loading.