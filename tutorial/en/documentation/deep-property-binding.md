# Understanding Property Binding

In the previous content, we briefly introduced the basic usage of [property binding](./property-binding.md). The earlier example bound the `value` property of a native browser element (`textarea`); this section explores the essence of property binding—it actually binds to the JavaScript property of the instantiated component, not the HTML attribute.

## Component Property Binding Mechanism

In ofa.js, when we use the `:toProp="fromProp"` syntax in a parent component, we are setting a JavaScript property of the child component instance, not an HTML attribute. This is an important distinction from directly setting HTML attributes (such as `attr:toKey="fromKey"`).

The following example demonstrates how to pass data to a custom component through property binding:

<o-playground name="Understanding Property Binding" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <demo-comp :full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>FullName: {{fullName}}</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In this example:- The `val` data in the parent component is bound to the `fullName` prop of the child component `<demo-comp>`.
- The parent's `val` is passed to the child's `fullName` prop using the syntax `:full-name="val"`.
- After receiving the value, the child component displays it in the template via `{{fullName}}`.

## Attribute Binding vs. Feature Attribute Inheritance

It is worth noting that property binding (`:`) and attribute inheritance (`attr:`) have the following key differences:

### Property Binding (`:`)

- JavaScript properties bound to component instances
- Passed data maintains its original type (strings, numbers, booleans, etc.)
- Can be directly accessed and modified within the component, even without the component internally defining `data` in advance

### Feature Attribute Inheritance (`attr:`)

- Setting HTML attributes
- All values are converted to strings
- Primarily used for passing attributes to underlying DOM elements
- Requires special handling to parse complex data
- Must define `attrs` inside the component in advance to receive attribute values

请提供您需要对比的语法内容或句子，我将为您翻译。```html
<!-- Property binding: pass JavaScript values while preserving data types -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>
<my-component :is-active="true"></my-component>

<!-- Attribute inheritance: set HTML attributes, all values become strings -->
<my-component attr:data-value="simpleString"></my-component>
<my-component attr:count="42"></my-component>  <!-- actually receives the string "42" -->
```

## Case Comparison Differences

<o-playground name="Case Comparison Differences" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [vone]{
            color: red;
        }
        [vtwo]{
            color: green;
        }
      </style>
      <demo-comp :vone="valOne"></demo-comp>
      <br>
      <demo-comp attr:vtwo="valTwo"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              valOne: "I am One",
              valTwo: "I am Two",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 8px;
        }
      </style>
      <p>(1: {{vone}}) --- (2: {{vtwo}})</p>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            attrs:{
              vtwo: null,
            },
            data: {
              vone: null
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

`vone` is a property of the component instance, while `vtwo` is an HTML attribute; the attribute’s value is matched by the `[vtwo]` selector and receives the corresponding styles, whereas `vone`, being a component-instance property, is not matched by the `[vone]` selector.

## Two-way Data Binding

Instantiated components also support two-way data binding using the `sync:toProp="fromProp"` syntax. Two-way binding allows data synchronization between parent and child components—when data changes on either side, the other side updates accordingly.

Unlike Angular and Vue, ofa.js natively supports two-way data binding syntax without requiring special configuration or extra operations for components.

### Two-Way Binding Example

The example below shows how to set up two-way data binding between a parent and a child component.

<o-playground name="Two-way Binding Example" style="--editor-height: 600px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">Value in parent component: {{val}}</h3>
      <p>Modify parent component's value through input box:</p>
      <input type="text" sync:value="val" placeholder="Enter text in input box...">
      <p>Modify parent component's value through child component:</p>
      <demo-comp sync:full-name="val"></demo-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 8px;
          margin: 8px;
        }
      </style>
      <p>Value displayed in child component: {{fullName}}</p>
      <input type="text" sync:value="fullName" placeholder="Enter in child component's input box...">
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              fullName: ""
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In this example:- The parent's `val` and the child's `fullName` are two-way bound via `sync:full-name="val"`
- When text is entered in the parent's input, the child instantly reflects the new value
- When text is entered in the child's input, the parent is immediately updated

### The Difference Between Two-Way Binding and Regular Property Binding

| Feature | Normal Property Binding (`:`) | Two-way Binding (`sync:`) |
|---|---|---|
| Data Flow | One-way: Parent → Child | Two-way: Parent ↔ Child |
| Syntax | `:prop="value"` | `sync:prop="value"` |
| Child Component Modification | Does not affect parent component | Affects parent component |
| Use Cases | Parent passes configuration to child | Need to synchronize data between parent and child |### Precautions

1. **Performance considerations**: Two-way binding triggers re-renders on data changes; use sparingly in complex scenarios.  
2. **Data-flow control**: Excessive two-way binding can make data flow hard to trace; design inter-component communication carefully.  
3. **Component compatibility**: Not every component suits two-way binding; consider the component’s design intent.