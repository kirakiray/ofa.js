# Template Syntax

## Text Rendering
```html
<p>{{val}}</p>
```

## HTML Rendering
```html
<p :html="val"></p>
```

## Event Binding (from proto)
```html
<button on:click="count++">Click Me - {{count}}</button>
<button on:click="addNumber(5)">Add 5</button>
```

## Property Binding (One-way)
```html
<input type="text" :value="val" placeholder="单向绑定">
```

## Property Binding (Two-way / Sync)
```html
<input type="text" sync:value="username" placeholder="双向绑定">
```

## Class Binding
```html
<div class:active="isActive">Content</div>
```

## Style Binding
```html
<div :style.color="txt">Styled Text</div>
```

## Conditional Rendering
```html
<o-if :value="isShow">
  <p>Content to show</p>
</o-if>
<o-else-if :value="isOther">
  <p>Other content</p>
</o-else-if>
<o-else>
  <p>Default content</p>
</o-else>
```

## List Rendering
```html
<o-fill :value="items">
  <div>{{$index}}. {{$data.name}}</div>
</o-fill>
```

## Key Points
- `{{}}` for text interpolation
- `:html` for HTML content (be careful of XSS)
- `on:event` for event binding
- `sync:` for two-way binding
- `o-fill` uses `$data` for current item, `$index` for index

## references
- [o-fill List Rendering](./references/11-o-fill.md)
