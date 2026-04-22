# 官方组件

ofa.js 提供了一些官方组件，用于解决特定场景下的问题。

## replace-temp 组件

用途：在 `select`、`table`、`tbody` 等对内部标签结构有要求的场景中做列表渲染。

```html
<select>
  <template is="replace-temp">
    <x-fill :value="items">
      <option>{{$data}}</option>
    </x-fill>
  </template>
</select>
```

规则：

- 只有普通 `o-fill` / `x-fill` 不能正常工作时再使用。
- 模板尽量保持简单，不要叠加太多复杂逻辑。

## inject-host 组件

用途：从组件内部向宿主注入样式，用于控制插槽内容里的深层元素样式。

优先级：

1. 能用 `::slotted()` 就先用 `::slotted()`。
2. 只有 `::slotted()` 不够用时再用 `inject-host`。

```html
<template component>
  <inject-host>
    <style>
      user-list user-list-item .user-list-item-content {
        color: red;
      }
    </style>
  </inject-host>

  <slot></slot>

  <script>
    export default async () => ({
      tag: "user-list",
    });
  </script>
</template>
```

注意：

- `inject-host` 会把内部样式注入宿主作用域。
- 选择器过宽时可能污染其他组件样式。
- 推荐使用带组件名前缀的具体选择器。
- 避免直接使用 `.content`、`div` 这类通用选择器。

推荐：

```html
<inject-host>
  <style>
    user-list .list-item-content {
      color: red;
    }
  </style>
</inject-host>
```

不推荐：

```html
<inject-host>
  <style>
    .content {
      color: red;
    }
  </style>
</inject-host>
```