# 官方组件

ofa.js 提供了一些官方组件，用于解决特定场景下的问题。

## replace-temp 组件

用于解决在 select 或 table 等特殊元素内进行列表渲染的问题：

```html
<select>
  <template is="replace-temp">
    <x-fill :value="items">
      <option>{{$data}}</option>
    </x-fill>
  </template>
</select>
```

## 注入宿主样式

在 Web Components 中，由于 `slot` 插槽的限制，无法直接设置插槽内多层级元素的样式。`<inject-host>` 组件允许在组件内部向宿主元素注入样式，实现对插槽内容中多层级元素的样式控制。

> 注意：建议优先使用 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 选择器设置插槽内容样式，只有无法满足需求时才使用 `<inject-host>`。

### 基本用法

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
    </style>
    <inject-host>
        <style>
            /* 设置插槽内多层级元素的样式 */
            user-list user-list-item {
                background-color: aqua;
            }
            user-list user-list-item .user-list-item-content {
                color: red;
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
```

### 工作原理

`<inject-host>` 会将内部的 `<style>` 标签内容注入到组件的宿主元素中，使样式规则可以穿透组件边界，作用于 slot 插槽内的元素。

### 注意事项

⚠️ **样式污染风险**：注入的样式会作用到宿主元素所在的作用域，可能影响其他组件。

使用原则：
1. 使用具体的选择器，避免过于宽泛
2. 添加命名空间前缀，减少冲突
3. 避免使用通用标签选择器
4. 优先考虑优化组件设计，使用 `::slotted()` 选择器

```html
<!-- 推荐 ✅ -->
<inject-host>
    <style>
        user-list .list-item-content { color: red; }
    </style>
</inject-host>

<!-- 不推荐 ❌ -->
<inject-host>
    <style>
        .content { color: red; }  /* 容易冲突 */
    </style>
</inject-host>
```
