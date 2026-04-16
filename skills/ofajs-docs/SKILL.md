---
name: "ofajs-docs"
description: "ofa.js framework tutorial. Use when users ask about ofa.js usage methods, component development, page modules, or want to build web applications without Node.js/Webpack."
---

> 💡 **AI Usage Guide**: This tutorial comes with complete example source code in the `assets/` directory. When encountering specific problems or needing to understand a feature in depth, proactively check the corresponding example files. The source code contains more complete implementation details and comments. **When documentation description differs from source code, the source code takes precedence.**

# ofa.js Tutorial

ofa.js is a progressive Web micro-frontend framework that runs without requiring Node.js, Webpack, or NPM.

## Quick Start

Introduce ofa.js JS file directly in HTML to start using it:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Page Module Usage Example

This example demonstrates a simple counter page, covering data binding, event handling, computed properties, and style definitions.

### Example Files

- [page.html](assets/01-start/page.html): Page module definition file, responsible for page module logic and rendering.
- [demo.html](assets/01-start/demo.html): Entry file that references the page module, responsible for loading ofa.js framework and page module.

### Description

1. Page modules are defined using `<template page>` tag, elements to be rendered are written inside `template`, file suffix is `.html`.
2. Module logic is written in `<script>` inside `template`, returning an object via `export default` function to define page module data and methods. **There must be exactly one script tag.**
3. You can receive `{ query }` parameter in `export default` function to get URL query parameters.
4. Data and methods are defined in `data` and `proto`, corresponding to page module properties and methods respectively.
5. Use `{{key}}` syntax on elements to directly render data from `data` as text.
6. After defining module methods in `proto`, you can use `on:xxx` for event binding on template elements. Refer to DOM events for available events.
7. Simple function calculations can be done directly in templates, e.g., `num++`.
8. Use `get xxx` keyword in `proto` to define computed properties (unlike Vue, do NOT use `computed`).
9. Module styles are written in `<style>` inside `template`. To define styles for the module element itself, use `:host` selector, refer to Web Component style selectors.

### Additional Notes

1. **Direct Function Execution**: For simple operations (like counter increment, state toggle, etc.), you can write short expressions directly in event attributes, such as `count++`, `isShow = !isShow`.
2. **Passing Parameters to Event Handlers**: You can pass parameters during event binding, e.g., `on:click="addNumber(5)"`, parameters will be passed to methods defined in `proto`.
3. **Accessing Event Object**: You can access native event object through `$event` parameter in event handler, e.g., `handleClick($event)`.
4. **Non-reactive Data**: Properties starting with `_` are non-reactive, changes won't trigger view updates. Suitable for temporary data that doesn't need UI updates.
5. Object data set directly on the instance will be automatically converted to reactive state data, changes will trigger view updates. Therefore, if it's a custom class instance, use `_` prefixed property name to store it, to avoid being converted to reactive data.
```html
<script>
  export default async () => ({
    data: {
      obj: {
        // Object data on instance will be automatically converted to reactive state data
        val: "hello world",
      },
    },
    attached() {
      const obj2 = {
        val: "change val",
      };

      this.obj = obj2;

      console.log(this.obj.val === obj2.val); // => true
      console.log(this.obj === obj2); // => false, already converted to reactive state data, different object reference

      // this.obj = new SomeClass(); // ❌ Don't do this, will be auto-converted to reactive state data
      // this._obj = new SomeClass(); // ✅ Do this instead, won't be auto-converted to reactive state data
    },
  });

  class SomeClass {
    constructor() {}
  }
</script>
```

## Component Module Usage Example

This example demonstrates a switch component implementation, covering component definition, property passing, event communication, and slots.

### Example Files

- [switch.html](assets/02-switch/switch.html): Component module definition file, responsible for component module logic and rendering.
- [page.html](assets/02-switch/page.html): Page module that uses this component.
- [demo.html](assets/02-switch/demo.html): Entry file that references the page module.

### Description

1. Component modules are defined using `<template component>` tag, elements to be rendered are written inside `template`.
2. Basic logic is consistent with page modules, the difference is that the returned object needs a `tag` field to define the component's tag name, and **cannot use `query` parameter**.
3. Before using a component, use `<l-m>` tag to introduce the component module, `src` attribute is the component module path. After introducing, you can use the component's tag name in the template.
4. Component modules can use `attrs` to define default property values, these values will be actually rendered to the component's `attributes`. Properties passed through attrs will be converted to strings by default. **Note: `attrs` and `data` keys cannot have the same name.**
5. Use `:tokey="fromkey"` syntax to one-way pass the `fromkey` property from current page/component module to the `tokey` property of target component module. Changes in upper module will sync to component module property.
6. Use `sync:toKey="fromKey"` syntax to two-way sync the `fromKey` property of current page/component module with the `toKey` property of target component module. Either side's changes will sync to the other.
7. Use `class:className="fromKey"` syntax, when current page/component module's `fromKey` property is `true`, this class name will be added to target component module; otherwise removed.
8. Use `attr:toKey="fromKey"` syntax to pass current page/component module's `fromKey` property to target component module's `toKey` property (attributes property); if null, remove that attribute.
9. `<slot></slot>` tag is used to define component slots, other components can insert content into slots; you can also add name attribute to slot, consistent with Web Component named slots.
10. Components or page modules can use `this.emit("eventName", options)` method to trigger custom events, where `options` is a parameter object with:
    - `options.data`: Add custom event data.
    - `options.bubbles`: Whether event bubbles, default is `true`.
    - `options.composed`: Whether event crosses Shadow DOM boundary, default is `false`.
    - Other parameters reference native Event parameters, such as `cancelable`, etc.
11. Upper modules can listen to custom events of target component module via `on:eventName="handler"` syntax; this is equivalent to `on:eventName="handler($event)"`, passing Event object to handler function.

## List Rendering Usage Example

This example demonstrates a Todo List implementation, covering list rendering, conditional rendering, and reactive state data.

### Example Files

- [page.html](assets/03-todolist/page.html): Todo List page module, including list rendering and conditional rendering.
- [demo.html](assets/03-todolist/demo.html): Entry file that references the page module.

### Description

1. Use `o-fill` component for list rendering, `$data` represents current item data, `$index` represents current item index, `$host` represents current page/component module instance. When binding events on list items, need to call methods on `$host`, format is `$host.methodName($data)`, passing current item data to handler function.
2. Use `o-if` / `o-else-if` / `o-else` components for conditional rendering, `:value="bool"` is a boolean value for judging whether to render the component node.
3. Use `$.stanz()` to create reactive state data, e.g., `todos`. State data supports these listening methods:
   - Use `watchTick` to listen for data changes, returns listener ID `wid`.
   - Use `watch` to listen for data changes synchronously (triggers in real-time), returns listener ID `wid`.
   - Use `unwatch(wid)` to cancel listening.
4. Assign reactive state data to current module in `attached` lifecycle, clear references in `detached` lifecycle.
5. After using externally introduced reactive state data, need to cancel listening in `detached` lifecycle, otherwise memory leak.
6. Both page modules and component modules can use these features.

## Context Data Passing Usage Example

This example demonstrates a file manager implementation, covering data listening, cross-level data sync, `o-provider`/`o-consumer` context communication, and recursive list rendering.

### Example Files

- [demo.html](assets/04-filelist/demo.html): Entry file that references the page module.
- [page.html](assets/04-filelist/page.html): Main entry page.
- [filelist.html](assets/04-filelist/filelist.html): File list component.
- [editor.html](assets/04-filelist/editor.html): File content viewer component.
- [data.js](assets/04-filelist/data.js): Simulated data and data fetching functions.

### Description

1. Use `<o-provider name="providerName" sync:custom-name="selfKey">` tag to wrap child components, use `sync:custom-name` to sync current module data to context. Context property changes will automatically notify all child components.
2. `o-consumer` component will sync property changes from upper `o-provider` component with the same name (crossing Shadow DOM boundary), then use `watch:custom-name` to sync context property changes to current component.
3. Compared to event bubbling and property layer-by-layer passing, when it comes to multi-level nested data sync, using `o-provider` and `o-consumer` can greatly improve development efficiency.
4. In child components, use `this.getProvider(providerName)` to get context object, directly modify `custom-name` context property to sync to other child components, no need to pass layer by layer (remember to fix camelCase naming).
5. Add `watch` object in page or component module parameters to define listener functions for properties that need monitoring. When property values change, listener functions will automatically trigger.
6. `o-fill` can render specified name `template` via `name` attribute, this template can recursively render itself or other named templates, achieving nested rendering of multi-level lists.

**Detailed Documentation**: [Provider and Context State](references/provider-context.md)

## Routing and Multi-level Nested Pages Usage Example

This example demonstrates a complete single-page application, covering o-router routing, multi-level nested pages, page transition animations, and route listening.

### Example Files

- [demo.html](assets/05-routing/demo.html): Entry file, using o-router and o-app to build single-page application.
- [app-config.js](assets/05-routing/app-config.js): Application configuration file, defining home page address and page transition animations.
- [layout.html](assets/05-routing/layout.html): Root layout page, including navigation bar, using `<slot>` to render child pages.
- [home.html](assets/05-routing/home.html): Home page, nested in layout.html.
- [list.html](assets/05-routing/list.html): List page (first-level child page), including second-level nested Tab switching.
- [list-page1.html](assets/05-routing/list-page1.html): Recommended product list (second-level child page).
- [list-page2.html](assets/05-routing/list-page2.html): Hot product list (second-level child page).
- [detail.html](assets/05-routing/detail.html): Detail page, getting URL query parameters.

### Description

1. Use `<o-router>` to wrap `<o-app>` to build single-page application.
2. `app-config.js` configuration file defines application home page via `export const home`, defines page transition animation via `export const pageAnime`.
3. Parent page uses `<slot></slot>` tag to reserve child page rendering position, child page establishes nested relationship by specifying parent page path via `export const parent`.
4. For routing跳转, you can use `<a href="./about.html" olink>About</a>`, or use `this.goto("./about.html")` for programmatic跳转, both support browser forward/back and URL sync.
5. Child pages can get URL query parameters via `{ query }` parameter, e.g., `export default async ({ query }) => {...}`.
6. In layout page module, you can listen for route changes via `routerChange` lifecycle and `ready` lifecycle, to refresh navigation highlight state.
7. Multi-level nesting: list.html as first-level child page, its sub-pages list-page1.html and list-page2.html as second-level child pages nested within, forming a two-level nesting structure.

## Isomorphic Rendering (SCSR) Usage Example

This example demonstrates ofa.js's isomorphic rendering (Symphony Client-Server Rendering) mode, each page itself is a complete HTML file, server can directly return that file to implement SSR.

### Example Files

- [home.html](assets/06-scsr/home.html): Home page SCSR page, used when client accesses directly.
- [about.html](assets/06-scsr/about.html): About page SCSR page.
- [app-config.js](assets/06-scsr/app-config.js): Application configuration file.
- [public.css](assets/06-scsr/public.css): Public style file.

### Description

1. In SCSR mode, each HTML page itself contains complete `<o-app src="./app-config.js"><template page>...</template></o-app>` structure.
2. When server stitches templates, outer layer uses fixed HTML structure for loading ofa.mjs and scsr.min.mjs files, replace `template page` content with actual page module content; doesn't depend on specific server language, any backend environment can implement SSR.
3. Server must set correct HTTP header when returning HTML: `Content-Type: text/html; charset=UTF-8`.

## API Documentation

Besides template syntax, ofa.js provides rich JS APIs, including element selection (`$`, `$.all`), node operations (`push`, `remove`, `wrap`), attribute styles (`text`, `html`, `css`, `attr`), event handling (`on`, `emit`, `off`), Shadow DOM access (`shadow`), reactive data (`$.stanz`, `watch`), etc. For complete API list, see [ofa.js API Reference](references/api.md).

### Example Files

- [07-api/shadow-demo.html](assets/07-api/shadow-demo.html): Component module, accessing shadow nodes via `this.shadow.$()`
- [07-api/demo.html](assets/07-api/demo.html): Entry file, demonstrating external calling component methods

## Other Reference Documentation

- [Loading Modules and Third-party Libraries](references/load-modules.md): Usage of `load` and `url` parameters in `export default` function
- [Official Components](references/official-components.md): Usage of `replace-temp` and `inject-host` components
- [match-var Style Query](references/match-var.md): Usage for switching styles based on CSS variables
