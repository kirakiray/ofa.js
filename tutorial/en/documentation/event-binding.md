# Event Binding

In ofa.js, event binding is a crucial mechanism for implementing user interaction. You can bind event handlers to elements in various ways to respond to user actions.

## Binding events from proto

This is the recommended way to bind events, suitable for complex event handling logic. Defining event handler functions in the `proto` object allows for better organization of code logic and facilitates maintenance and reuse.

<o-playground name="Binding Events from proto" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Run the function directly

For simple operations—such as incrementing a counter or toggling a state—you can write short expressions directly in the event attribute. This approach is concise and clear, ideal for handling straightforward logic.

<o-playground name="Run Function Directly" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Supported Event Types

ofa.js supports all standard DOM events, including but not limited to:

- Mouse events: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, etc.
- Keyboard events: `keydown`, `keyup`, `keypress`, etc.
- Form events: `submit`, `change`, `input`, `focus`, `blur`, etc.
- Touch events: `touchstart`, `touchmove`, `touchend`, etc.

ofa.js supports exactly the same event types as native DOM events; for more details, refer to the [MDN Events documentation](https://developer.mozilla.org/en-US/docs/Web/API/Event).

## Passing Parameters to Event Handlers

You can also pass parameters to the event handler:

<o-playground name="Passing Parameters to Event Handlers" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">Add 5 - Current: {{count}}</button>
      <button on:click="addNumber(10)">Add 10 - Current: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Accessing the Event Object

In the event handler, you can access the native event object via the `event` parameter:

<o-playground name="Accessing Event Objects" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">Click anywhere to view coordinates</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

You can also access the native event object using the `$event` parameter in expressions, for example to get the mouse click coordinates:

```html
<div class="container" on:click="handleClick($event)">Click anywhere to see coordinates</div>
```

## Listening for Custom Events

Beyond listening to native DOM events, you can also easily listen to custom events emitted by components:

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

For a deeper understanding of custom events, please refer to the [Custom Events](custom-events.md) chapter. It is recommended to follow the tutorial in order, as later content will build naturally on what came before; of course, you’re also welcome to consult it at any time to learn ahead.