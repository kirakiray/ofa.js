# Dollar ($) - Get/Create Element Instance

## Get Element by Selector
```javascript
// Get first element matching selector
$("selector")

// Examples
$("#target")
$(".classname")
$("div")
$("ul li")
```

## Create Element from String
```javascript
const newEl = $(`<div style="color:red">new element</div>`);
$("#container").push(newEl);
```

## Create Element from Object
```javascript
const newEl = $({
  tag: "div",
  text: "new element",
  css: { color: "red" }
});
$("#container").push(newEl);
```

## Convert Native Element
```javascript
const $ele = $(document.createElement('div'));
const $ele = $(document.querySelector('#target'));
```

## Find Child Element
```javascript
$("#parent").$('child-selector')
```
