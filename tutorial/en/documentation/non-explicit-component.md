# Implicit Component

ofa.js has two built-in implicit components:

* Conditional rendering components: `x-if`, `x-else-if`, `x-else`
* Filling component: `x-fill`

The functions of these two components are the same as the `o-if` and `o-fill` components, but they themselves are not actually rendered into the DOM. Instead, their internal elements are directly rendered into the corresponding areas.

For example:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- The style is not red because the o-if component itself exists in the DOM -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- The style is red because the x-if component is not rendered into the DOM -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Non-explicit Components" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* Select first-level .item elements as red */
            color:red;
        }
        /* Need to select .item elements inside the o-if component */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- Style is not red because the o-if component itself exists in the DOM -->
                <div class="item">Will not appear red</div>
            </o-if>
            <x-if :value="true">
                <!-- Style is red because the x-if component does not render into the DOM -->
                <div class="item">Appears red</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if Conditional Rendering Component

`x-if` has the same functionality as [o-if](./conditional-rendering.md), used to determine whether to render content based on the truthiness of a conditional expression. The difference is that `x-if` itself will not exist as a DOM element, and its internal content will be directly rendered into the parent container.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Welcome back, user!</p>
    </x-if>
</div>
```

`x-if` can also be used with `x-else-if` and `x-else`.

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Admin Panel</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>User Center</p>
    </x-else-if>
    <x-else>
        <p>Please log in</p>
    </x-else>
</div>
```

## x-fill Fill Component

`x-fill` works exactly like [o-fill](./list-rendering.md): it renders array data as multiple DOM elements. Like `x-if`, `x-fill` itself is not rendered into the DOM; its inner template is rendered directly into the parent container.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Example of using named templates:

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## Performance Description

In addition to functional differences, the rendering performance of non-explicit components is **significantly worse** than that of explicit components (`o-if`, `o-fill`). This is because non-explicit components are not actually rendered into the DOM, requiring additional simulated rendering logic to handle the positioning and updating of internal elements.

Additionally, non-explicit components can introduce subtle bugs: because they never actually enter the DOM, operations that rely on DOM structure—such as event binding, style calculations, or queries by third-party libraries—may fail or behave unexpectedly.

Therefore, it is recommended to **prioritize explicit components** (`o-if`, `o-else-if`, `o-else`, `o-fill`) and use non-explicit components only in specific scenarios.

## Usage Scenarios

Although implicit components have poor performance, they may be used in the following scenarios:

1. Avoid extra DOM levels: when you don’t want `o-if` or `o-fill` elements to become part of the DOM structure  
2. Style inheritance: when inner elements must inherit parent styles directly, without interference from intermediate component elements  
3. CSS selector constraints: when you need precise styling via parent-child selectors (e.g., `.container > .item`) and want no extra wrapper elements