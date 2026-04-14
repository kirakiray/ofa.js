---
name: "ofajs-docs"
description: "ofa.js framework documentation skill. Use when user asks about ofa.js concepts, tutorials, component development, state management, or wants to learn how to build web apps with ofa.js."
---

# ofa.js Documentation Skill

ofa.js is a lightweight web frontend framework for building web applications without build tools.

## Core Concepts

### What is ofa.js
- Easy-to-use Web frontend framework for building Web applications
- No build tools required - runs directly in browser
- Native micro-frontend support - each module can be independently developed and deployed
- AI-friendly: no compilation black box, code can be quickly deployed and self-verified

### Basic Page Structure

```html
<!-- index.html - Application Entry -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <o-page src="./demo-page.html"></o-page>
  </body>
</html>
```

```html
<!-- demo-page.html - Page Module -->
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

## Template Syntax

### Text Rendering
```html
<p>{{val}}</p>
```

### HTML Rendering
```html
<p :html="val"></p>
```

### Event Binding
```html
<button on:click="count++">Click Me - {{count}}</button>
<button on:click="addNumber(5)">Add 5</button>
```

### Property Binding
```html
<input sync:value="name" />
<o-if :value="condition">...</o-if>
```

## Components

### Creating Components
```html
<!-- demo-comp.html -->
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
```

### Using Components
```html
<template>
  <l-m src="./demo-comp.html"></l-m>
  <demo-comp></demo-comp>
</template>
```

### Synchronous Load
```javascript
export default async ({ load }) => {
  await load("./demo-comp.html");
  return { data: {} };
};
```

## Lifecycle Hooks

| Hook       | Timing                   | Purpose                                     |
| ---------- | ------------------------ | ------------------------------------------- |
| `ready`    | DOM created              | DOM operations, init third-party libs       |
| `attached` | Added to DOM             | Start timers, add event listeners           |
| `loaded`   | All subcomponents loaded | Execute after complete component tree ready |
| `detached` | Removed from DOM         | Cleanup timers, remove listeners            |

### Example
```javascript
export default async () => {
  return {
    data: { count: 0 },
    attached() {
      this._timer = setInterval(() => { this.count++; }, 1000);
    },
    detached() {
      clearInterval(this._timer);
    }
  };
};
```

## State Management

### Creating Reactive State
```javascript
const store = $.stanz({ count: 0 });

// In component
export default async ()=>{
  return {
    data: { store: {} },
    attached() { this.store = store; },
    detached() { this.store = {}; }
  };
}
```

### Module-level State
```javascript
export const cartStore = $.stanz({ total: 0 });
```

```javascript
// In component
export default async ({load})=>{
  const { cartStore } = await load("./data.js");

  return {
    data: { cartStore: {} },
    attached() { this.cartStore = cartStore; },
    detached() { this.cartStore = {}; }
  };
}
```

## When to Use This Skill
- User asks about ofa.js framework
- User wants to build web applications without build tools
- User asks about components, templates, event binding
- User needs help with ofa.js state management
- User asks about micro-frontend architecture in ofa.js
- User wants to learn ofa.js basics or advanced features

## Detailed Examples

See the `references/` directory for comprehensive examples:

- [Basic Page Structure](./references/01-basic-page.md)
- [Creating Components](./references/02-components.md)
- [Template Syntax](./references/03-template-syntax.md)
- [Event Binding](./references/04-event-binding.md)
- [Lifecycle Hooks](./references/05-lifecycle.md)
- [State Management](./references/06-state-management.md)
- [Slots](./references/07-slots.md)
- [Router/SPA](./references/08-router.md)
- [Context State: Provider and Consumer](./references/10-provider-consumer.md)
- [Component Development Cases: Switch Component](./references/09-switch-component.md)
