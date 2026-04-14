# o-fill - List Rendering

`o-fill` is ofa.js's core component for rendering lists from arrays. It automatically tracks array changes and efficiently updates the DOM.

## Basic Usage

```html
<ul>
  <o-fill :value="fruits">
    <li>{{$index + 1}}. {{$data.name}} - ¥{{$data.price}}</li>
  </o-fill>
</ul>

<script>
export default async () => ({
  data: {
    fruits: [
      { name: "苹果", price: 5 },
      { name: "橙子", price: 6 },
    ]
  }
});
</script>
```

### Available Variables

| Variable | Description |
|----------|-------------|
| `$index` | Current item index (0-based) |
| `$data` | Current item data object |
| `$host` | Current component/page instance |

## Adding and Removing Items

```html
<button on:click="addItem">Add</button>
<button on:click="removeItem">Remove Last</button>

<ul>
  <o-fill :value="items">
    <li>
      {{$index + 1}}. {{$data.name}}
      <button on:click="$host.removeItem($index)">Delete</button>
    </li>
  </o-fill>
</ul>

<script>
export default async () => ({
  data: {
    items: [
      { name: "苹果", price: 5 },
      { name: "橙子", price: 6 },
    ]
  },
  proto: {
    addItem() {
      this.items.push({ name: "香蕉", price: 3 });
    },
    removeItem(index) {
      this.items.splice(index, 1);
    }
  }
});
</script>
```

## Named Template (Complex Items)

For complex list item structures, use a named template:

```html
<o-fill :value="products" name="product-template"></o-fill>

<template name="product-template">
  <div class="product-card">
    <h3>{{$data.name}}</h3>
    <p>¥{{$data.price}}</p>
    <small>Index: {{$index + 1}}</small>
  </div>
</template>

<script>
export default async () => ({
  data: {
    products: [
      { name: "MacBook Pro", price: 12999 },
      { name: "iPhone 15", price: 5999 },
    ]
  }
});
</script>
```

## Nested o-fill

```html
<o-fill :value="categories" name="category-template"></o-fill>

<template name="category-template">
  <div class="category">
    <h3>{{$data.name}}</h3>
    <o-fill :value="$data.items">
      <div>• {{$data}}</div>
    </o-fill>
  </div>
</template>

<script>
export default async () => ({
  data: {
    categories: [
      {
        name: "电子产品",
        items: ["手机", "电脑", "平板"]
      },
      {
        name: "服装",
        items: ["T恤", "裤子", "外套"]
      }
    ]
  }
});
</script>
```

## Performance: fill-key

For frequently updating lists, use `fill-key` to improve performance:

```html
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

This helps ofa.js correctly identify items when the array order changes.

## Key Differences: o-fill vs x-fill

| Feature | o-fill | x-fill |
|---------|--------|--------|
| DOM presence | Yes - renders as a component | No - invisible |
| Use when | Most cases | Must avoid extra DOM nodes |

```html
<!-- o-fill creates a component node in DOM -->
<style>.container > .item { color: red; }</style>
<div class="container">
  <o-fill :value="items">
    <div class="item">{{$data}}</div>
  </o-fill>
</div>
<!-- .item is NOT a direct child of .container -->

<!-- x-fill does not create DOM nodes -->
<style>.container > .item { color: red; }</style>
<div class="container">
  <x-fill :value="items">
    <div class="item">{{$data}}</div>
  </x-fill>
</div>
<!-- .item IS a direct child of .container -->
```

## Best Practices

1. **Simple lists**: Use direct rendering inside `<o-fill>`
2. **Complex items**: Use named templates with `<template name="xxx">`
3. **Frequent updates**: Add `fill-key="id"` for better performance
4. **Nested data**: `$data` in nested o-fill refers to parent item's property
5. **Event handlers**: Use `$host.method()` to call parent methods
