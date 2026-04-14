---
name: "ofajs-api"
description: "ofa.js API reference skill. Use when user asks about ofa.js instance methods ($ , all, clone), DOM operations (before, after, remove), property manipulation (text, html, css, style, classList), event handling (on, emit, off), or component APIs (o-app)."
---

# ofa.js API Reference

## Instance Methods

### $ (Dollar) - Get/Create Element Instance
```javascript
// Get first element matching selector
$("selector")

// Create element from string
const newEl = $(`<div style="color:red">new element</div>`);

// Create element from object
const newEl = $({
  tag: "div",
  text: "new element",
  css: { color: "red" }
});

// Convert native element
const $ele = $(document.createElement('div'));
```

### all - Get All Matching Elements
```javascript
// Get all elements matching selector
$("selector").all("li")

// Example
$("ul").all("li").forEach((item, index) => {
  item.text = `item ${index}`;
});
```

### shadow - Access Shadow DOM
```javascript
// Access shadow root of a component
$("my-component").shadow.$("selector")

// Example
$("test-shadow").shadow.$("#target").text = 'changed';
```

### prev/next - Sibling Elements
```javascript
$("#target").prev  // Previous sibling
$("#target").next  // Next sibling
```

### siblings - All Siblings
```javascript
$("#target").siblings  // Array of all sibling elements
```

### parent/parents - Parent Elements
```javascript
$("#target").parent   // Direct parent
$("#target").parents   // All ancestors (array)
```

### clone - Clone Element
```javascript
const clone = $("#target").clone();
$("#container").push(clone);
```

### root - Root Node
```javascript
$("#target").root  // Returns document for normal elements, shadow root for shadow DOM
```

### host - Host Component
```javascript
$("#target").host  // Returns the host component instance or null
```

### app - Application Instance
```javascript
$("#target").app  // Returns o-app instance (works in o-app context)
```

### children - Child Elements
```javascript
$("ul")[0]        // Get first child
$("ul")[1]        // Get second child
$("ul").length    // Number of children
```

## DOM Operations

### before - Insert Before
```javascript
$("#target").before(`<li>new item</li>`);
```

### after - Insert After
```javascript
$("#target").after(`<li>new item</li>`);
```

### remove - Remove Element
```javascript
$("#target").remove();
```

### push - Append Child
```javascript
$("#container").push(newElement);
```

## Property Operations

### text - Text Content
```javascript
// Get
$("#target").text

// Set
$("#target").text = "new text"

// Template syntax
<span :text="val"></span>
```

### html - Inner HTML
```javascript
// Get
$("#target").html

// Set
$("#target").html = `<b>bold</b>`

// Template syntax
<span :html="val"></span>
```

### css - Element Styles
```javascript
// Get single style
$("#target").css.color

// Set single style
$("#target").css.color = 'red'

// Set multiple styles (merge)
$("#target").css = { ...$("#target").css, color: 'blue', fontSize: '14px' }

// Template syntax
<div :css.color="txt"></div>
```

### style - Style Attribute
```javascript
// Same API as native style, but cannot get computed styles
$("#target").style.color = 'red';
```

### classList - CSS Classes
```javascript
$("#target").classList.add('class-name')
$("#target").classList.remove('class-name')
$("#target").classList.toggle('class-name')
```

## Event Operations

### on - Bind Event
```javascript
$("#btn").on("click", (event) => {
  console.log("clicked!");
});

// Template syntax
<button on:click="handleClick">Click</button>
```

### emit - Trigger Event
```javascript
$("#target").emit("custom-event", { data: "my data" });

// With options
$("#target").emit("custom-event", {
  data: "my data",
  bubbles: false,     // Don't bubble up
  composed: true      // Cross shadow DOM boundary
});
```

### off - Unbind Event
```javascript
const handler = () => console.log("clicked");
$("#btn").on("click", handler);
$("#btn").off("click", handler);
```

### one - One-time Event
```javascript
$("#btn").one("click", () => console.log("fires once"));
```

## Stanz Features (Instance Data Characteristics)

### watch - Watch for Changes
```javascript
const instance = $("#target");
instance.watch(() => {
  console.log("data changed!");
});
```

### watchTick - Throttled Watch
```javascript
instance.watchTick(() => {
  console.log("throttled updates");
});
```

### unwatch - Remove Watcher
```javascript
const tid = instance.watch(() => {});
// const tid = instance.watchTick(() => {});
instance.unwatch(tid);
```

### Non-reactive Properties (underscore prefix)
```javascript
instance._privateVar = "not watched";
```

## o-app Component

```javascript
const app = $("o-app");

app.src              // Get app config src
app.current          // Get current page instance
app.goto("./page.html")  // Navigate to page
app.replace("./page.html") // Replace current page
app.back()           // Go back
app.routers          // Route configuration
```

## When to Use This Skill
- User asks about specific ofa.js API methods
- User needs to manipulate DOM elements in ofa.js
- User asks about event handling in ofa.js
- User needs to work with component instances
- User asks about o-app navigation methods
- User asks about stanz reactive features

## Detailed API Examples

See the `references/` directory for comprehensive examples:

- [$ (Dollar)](./references/01-dollar.md)
- [all](./references/02-all.md)
- [shadow](./references/03-shadow.md)
- [Navigation](./references/04-navigation.md)
- [Element Manipulation](./references/05-element%20manipulation.md)
- [DOM Operations](./references/06-dom-operations.md)
- [text & html](./references/07-text-html.md)
- [css & style](./references/08-css-style.md)
- [attr & data](./references/09-attr-data.md)
- [Events](./references/10-events.md)
- [Stanz](./references/11-stanz.md)
- [o-app](./references/12-o-app.md)
