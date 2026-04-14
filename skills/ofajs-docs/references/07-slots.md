# Slots

## Default Slot
```html
<!-- Component definition -->
<template component>
  <div class="card">
    <slot></slot>
  </div>
  <script>
    export default { tag: "my-card" };
  </script>
</template>
```

```html
<!-- Usage -->
<my-card>
  <p>Custom content</p>
</my-card>
```

## Slot with Default Content
```html
<slot>
  <div>Default content if none provided</div>
</slot>
```

## Named Slots
```html
<!-- Component -->
<template component>
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
  <footer><slot name="footer"></slot></footer>
</template>
```

```html
<!-- Usage -->
<my-layout>
  <h1 slot="header">Title</h1>
  <p>Main content</p>
  <span slot="footer">Footer text</span>
</my-layout>
```

## Multi-level Slot Passing
```html
<!-- Parent passes slot to child -->
<child-component>
  <div style="color: red;">
    <slot></slot>
  </div>
</child-component>
```
