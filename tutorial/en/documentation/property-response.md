# Attribute Response

In the previous [Property Binding](./property-binding.md), we introduced the simple property response mechanism, which explains how to render a component's property values into text display.

ofa.js not only supports reactivity to basic property values, but also supports reactive rendering for internal property values of multi-level nested objects.

<o-playground name="Non-reactive Data Example" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">Increase</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

All data bound to an ofa.js instance object is automatically converted to reactive data. Reactive data supports only basic data types such as strings, numbers, booleans, arrays, and objects. Complex data types such as functions and class instances must be stored as **non-reactive properties**; changes to these properties will not trigger a re-render of the component.

## Non-reactive Data

Sometimes we need to store data that doesn't require reactive updates, such as Promise instances, RegExp objects, or other complex objects. In these cases, non-reactive properties are needed. Changes to these properties won't trigger component re-rendering, making them suitable for storing data that doesn't need to be linked with the view.

Non-reactive properties are typically prefixed with an underscore `_` to distinguish them from reactive ones.

<o-playground name="Non-reactive Data Example" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue increases</button>
      <button on:click="_count2++">Green increments</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

When clicking the `Green increments` button, although the value of `_count2` has actually increased, since it is a non-reactive property, it will not trigger view updates, so the display on the interface does not change. When clicking the `Blue increases` button, since `count` is a reactive property, it will trigger the re-rendering of the entire component, and only at this time will the Green display content be synchronized and updated.

Non-reactive object data performs better than reactive data because it does not trigger component re-renders.


