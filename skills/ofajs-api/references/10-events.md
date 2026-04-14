# Event Operations

## on - Bind Event
```javascript
$("#btn").on("click", (event) => {
  console.log("clicked!");
});

// Template syntax
<button on:click="handleClick">Click</button>
```

## emit - Trigger Event
```javascript
$("#target").emit("custom-event", { data: "my data" });

// Options
$("#target").emit("custom-event", {
  data: "my data",
  bubbles: false,     // Don't bubble up
  composed: true      // Cross shadow DOM boundary
});
```

## off - Unbind Event
```javascript
const handler = () => console.log("clicked");
$("#btn").on("click", handler);
$("#btn").off("click", handler);
```

## one - One-time Event
```javascript
$("#btn").one("click", () => console.log("fires once"));

// Template syntax
<button one:click="handleOnce">Click</button>
```

## Access Event Object
```javascript
$("#btn").on("click", (event) => {
  console.log(event.clientX, event.clientY);
});

// In template with $event
<div on:click="handleClick($event)">Click</div>
```
