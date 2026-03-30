# Class and Style Binding

In ofa.js, you can achieve flexible UI state management by dynamically binding class names, styles, and attributes. This enables the interface to automatically adjust its appearance based on data changes.

## Class Binding

Class binding lets you dynamically add or remove CSS classes based on data state. You can bind a specific class using the syntax `class:className="booleanExpression"`.

When `booleanExpression` is `true`, the class name is added to the element; when it is `false`, the class name is removed.

### Base class binding

<o-playground name="Basic Class Binding" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Multiple Class Bindings

You can also bind multiple classes at once, allowing the element to have different visual states based on different conditions.

<o-playground name="Multiple Class Bindings" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Style Binding

Style binding lets you set inline style values directly and supports dynamic updates. ofa.js offers two ways to bind styles:

### Single Style Property Binding

Use the `:style.propertyName` syntax to bind a specific style property.

<o-playground name="Single Style Property Binding" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Toggle Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Multi-style Attribute Binding

You can also bind multiple style attributes at once:

<o-playground name="Multi-style Attribute Binding" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Dynamic Styling Example
      </p>
      <button on:click="changeStyles">Change Styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Property Binding

In addition to class and style bindings, you can also dynamically bind other HTML attributes. ofa.js uses the `attr:attributeName` syntax to achieve attribute binding.

### Basic Attribute Binding

<o-playground name="Basic Attribute Binding" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">Change Color</button>
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "This is a tooltip message",
              val: "Hover over me to see the title",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Handling Boolean Attributes

For Boolean attributes (such as `disabled`, `hidden`), ofa.js decides whether to add the attribute based on the truthiness of the bound value.

<o-playground name="Boolean Attribute Handling" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Data Functions Inside Style Tags

You can use `data(xxx)` in styles to bind component data. This is particularly suitable for scenarios where styles need to be dynamically changed based on component data.

<o-playground name="Data Functions within Style Tags" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p:hover{
          color:red;
        }
      </style>
      <style>
        p {
          font-size: data(size);
          color:green;
          transition: all data(time)s ease;
        }
      </style>
      FontSize: <input type="number" sync:value="size" placeholder="This is a two-way bound input box" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="This is a two-way bound input box" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Notes

The `data(xxx)` inside `style` essentially replaces the entire content of the style, so it's better to only write data-related styles inside the style and place non-data styles in another style for better performance.

```html
<!-- ❌ p:hover without data(xxx) will also be refreshed -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ Only styles with data(xxx) will be re-rendered -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```