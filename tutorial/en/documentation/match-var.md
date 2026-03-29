# Style Query

`match-var` is a utility in ofa.js for styling based on CSS variables. It dynamically applies different styles according to the current component’s CSS variable values, enabling context-aware styling without JavaScript—ideal for theme colors and similar use cases.

## Core Concepts

- **match-var**: A style-matching component that applies internal styles only when a CSS variable equals a given value.  
- **Attribute Matching**: Define the CSS variable and expected value to match via component attributes.  
- **Style Application**: When the match succeeds, the rules inside the `<style>` tag are applied to the component.

## Basic Usage

The `match-var` component uses attributes to define the CSS variable to match and its expected value. When the component's CSS variable equals the specified attribute value, the internally defined styles are applied.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Attributes

The `match-var` component uses arbitrary attributes to define matching rules for CSS variables. The attribute name corresponds to the CSS variable name (without the `--` prefix), and the attribute value is the expected value to match.

### How it works

1. **Browser support**: If the browser supports `@container style()` queries, the native CSS capability is used directly.  
2. **Fallback**: If not supported, it polls for changes in CSS variable values and dynamically injects styles once a match is found.  
3. **Manual refresh**: Style detection can be triggered manually via the `$.checkMatch()` method.

## Basic Example

<o-playground name="Basic Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">Switch Theme</button> - Theme:{{currentTheme}}
      <div class="container">
        <theme-box>
          Display different styles based on CSS variables
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Display light theme
        </theme-box>
        <theme-box style="--theme: dark;">
          Display dark theme
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Multi-condition matching

Multiple attributes can be used simultaneously to define more complex matching conditions, and the styles will only be applied when all CSS variables match.

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## Multi-Condition Matching Example

<o-playground name="Property Matching Example" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>Theme: {{theme}} <button on:click="changeTheme">Toggle Theme</button></div>
      <div>Size: {{size}} <button on:click="changeSize">Toggle Size</button></div>
      <div class="content">
        <test-card>
          <div>Multi-condition Style Matching Example</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch Manual Refresh

In some cases, changes to CSS variables may not be automatically detected; you can manually call the `$.checkMatch()` method to trigger style detection.

> Currently, Firefox does not yet support `@container style()` queries, so it is necessary to manually call `$.checkMatch()`; once future browsers natively support it, the system will automatically detect variable changes, eliminating the need for manual triggering.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Manually trigger style detection
    $.checkMatch();
  }
}
```

## Best Practices

1. **Prioritize Native CSS Capabilities**: `match-var` prioritizes the use of the browser's native `@container style()` queries, offering better performance in modern browsers.  
2. **Organize Styles Reasonably**: Keep related matching styles together for easier maintenance and understanding.  
3. **Utilize data() Binding**: Combine with the `data()` directive to achieve responsive style switching.