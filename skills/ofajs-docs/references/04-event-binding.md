# Event Binding

## From proto (Recommended)
```javascript
export default async () => {
  return {
    data: { count: 1 },
    proto: {
      clickMe() {
        this.count++;
      },
      addNumber(num) {
        this.count += num;
      }
    }
  };
};
```

```html
<button on:click="clickMe">Click</button>
<button on:click="addNumber(5)">Add 5</button>
```

## Direct Expression
```html
<button on:click="count++">Increment</button>
```

## Access Event Object
```javascript
proto: {
  handleClick(event) {
    this.x = event.clientX;
    this.y = event.clientY;
  }
}
```

```html
<div on:click="handleClick($event)">Click me</div>
```

## Supported Events
- Mouse: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`
- Keyboard: `keydown`, `keyup`, `keypress`
- Form: `submit`, `change`, `input`, `focus`, `blur`
- Touch: `touchstart`, `touchmove`, `touchend`

## Custom Events (emit)
```javascript
this.emit('custom-event', {
  data: { message: 'hello' },
  bubbles: true,
  composed: true
});
```

```html
<my-component on:custom-event="handleEvent"></my-component>
```
