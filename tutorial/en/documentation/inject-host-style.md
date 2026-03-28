# Inject host styles

In Web Components, due to the limitations of `slot`, it is impossible to directly style multi-level elements within the slot. To solve this, ofa.js provides the `<inject-host>` component, allowing styles to be injected from inside the component into the host element, thereby enabling styling of multi-level elements in slotted content.

> Note: It is recommended to prioritize using the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) selector for styling slotted content. Only use the `<inject-host>` component when it is necessary to meet specific requirements.

## Basic Usage

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Style direct first-level children */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* You can also style deeply nested elements */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Case

The example below demonstrates how to use `<inject-host>` to style nested elements within a slot. We create two components: the `user-list` component serves as the list container, and the `user-list-item` component serves as the list item. Through `<inject-host>`, we can style `user-list-item` and its internal elements within the `user-list` component.

<o-playground name="Inject Host Styles" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Zhang San</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Li Si</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Age: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

As can be seen in the running results:- The background color of the `user-list-item` component is aqua (set via `<inject-host>` of the `user-list` component)
- The text color of the name is red (set via `<inject-host>` of the `user-list` component to style `user-list-item .item-name`)

## How It Works

The `<inject-host>` component injects the content of the internal `<style>` tag into the component's host element. This way, the injected style rules can penetrate the component boundary and apply to elements within the slot.

In this way, you can:- Set styles for elements at any depth within slot content
- Use complete selector paths to ensure styles only affect target elements
- Maintain component style encapsulation while achieving flexible style penetration

## Notes

⚠️ **Style Pollution Risk**: Since the injected styles will take effect in the scope where the host element is located, they may affect elements within other components. When using it, be sure to follow the following principles:

1. **Use specific selectors**: Prefer full component tag paths; avoid overly broad selectors.  
2. **Add namespace prefixes**: Give your style classes a unique prefix to reduce collision risk.  
3. **Avoid universal tag selectors**: Favor class or attribute selectors over tag selectors.  
4. **Rethink component design**: Consider whether you can avoid `<inject-host>` by refining the component. For example, combining child components with [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) selectors is often cleaner.

```html
<!-- Recommended ✅: Use specific selectors -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- Not recommended ❌: Using overly generic selectors -->
<inject-host>
    <style>
        .content {  /* Prone to conflicts with other components */
            color: red;
        }
    </style>
</inject-host>
```

### Performance Tips

Since `<inject-host>` triggers style re-injection into the host, which may lead to component reflow or repaint, use it with caution in frequently updated scenarios.
If you only need to style the first-level elements inside a slot, prefer using the [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) pseudo-class selector instead, as it avoids the extra rendering overhead from penetrating injection and provides better performance.