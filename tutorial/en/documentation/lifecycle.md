# Lifecycle

ofa.js components come with full lifecycle hooks, letting you run specific logic at different stages. These hooks allow you to step in and act at key moments—creation, mounting, updating, and destruction.

## Lifecycle Hook Functions

ofa.js provides the following main lifecycle hook functions, listed in the order most commonly used:

### attached

The `attached` hook is called when a component is inserted into the document, indicating that the component has been mounted to the page. This is the most commonly used lifecycle hook, typically used to perform initialization operations that can only be carried out after the component is actually displayed on the page, avoiding unnecessary calculations when the component is not visible. This hook is also ideal for element size measurements, animation initialization, and other operations that depend on the component being rendered to the page.

- **Call timing**: When the component is added to the DOM tree  
- **Main uses**: Start timers, add event listeners, perform operations that require visibility

### detached

The `detached` hook is called when the component is removed from the document, indicating that the component is about to be unmounted. This hook is suitable for cleaning up resources, such as clearing timers, removing event listeners, etc.

- **Timing**: When the component is removed from the DOM tree  
- **Primary use**: Clean up resources, cancel subscriptions, remove event listeners

### ready

The `ready` hook is called when the component is ready, at which point the component's template has been rendered, DOM elements have been created, but may not yet have been inserted into the document. This hook is suitable for performing DOM operations or initializing third-party libraries.

- **Invocation timing**: After the component template has rendered and the DOM is created
- **Primary use**: Perform initialization operations that depend on the DOM

### loaded

The `loaded` hook is triggered after the component, all its child components, and asynchronous resources have finished loading. At this point, you can safely remove the loading state or perform follow-up operations that depend on the complete component tree. If there are no dependencies, it is called after the `ready` hook.

- **Invocation timing**: When the component and all its child components have fully loaded  
- **Primary use**: Perform operations that depend on the complete component tree

## Lifecycle Execution Order

The component's lifecycle hooks execute in the following order:

2. `ready` - The component is ready (DOM has been created)
3. `attached` - The component is mounted to the DOM
4. `loaded` - The component has fully loaded

When a component is removed from the DOM, the `detached` hook is called.

## Usage Example

The example below shows how to use lifecycle hooks in a component:

<o-playground name="Lifecycle Example" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>Lifecycle Demo</h3>
      <div class="counter">Counter: {{count}}</div>
      <button on:click="count += 10">Add 10</button>
      <button on:click="removeSelf">Remove Component</button>
      <div class="log">
        <h4>Lifecycle Log:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // Remove self from DOM to trigger detached hook
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: Component is ready, DOM created");
              console.log("Component ready");
            },
            attached() {
              this.addLog("attached: Component mounted to DOM");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("Component mounted");
            },
            detached() {
              this.addLog("detached: Component removed from DOM");
              // Clear timer to prevent memory leak
              clearInterval(this._timer); 
              console.log("Component unmounted");
            },
            loaded() {
              this.addLog("loaded: Component fully loaded");
              console.log("Component fully loaded");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>In this example, you can observe the execution order and timing of different lifecycle hooks. When you click the "Remove Component" button, you will see the `detached` hook being triggered.

## Real-World Application Scenarios

### Initialization Operation

Initialize data in the `ready` hook:

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM manipulation
      this.initDomElements();
    }
  };
};
```

### Resource Management

Start the timer in the `attached` hook and clean up resources in the `detached` hook:

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // Start the timer
      this.timer = setInterval(() => {
        console.log('Scheduled task executed');
      }, 1000);
    },
    detached() {
      // Clean up the timer
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

Lifecycle hook functions are an important concept in ofa.js component development. Properly using them can help you better manage component state and resources and improve application performance.

