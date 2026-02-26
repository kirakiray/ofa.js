# 注入宿主样式

在 Web Components 中，由于 `slot` 插槽的限制，无法直接设置插槽内多层级元素的样式。为了解决这个问题，ofa.js 提供了 `<inject-host>` 组件，允许在组件内部向宿主元素注入样式，从而实现对插槽内容中多层级元素的样式控制。

## 基本用法

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 设置直接子一级元素的样式 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 还可以设置多层级嵌套的样式 */
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

## 工作原理

`<inject-host>` 组件会将内部包含的 `<style>` 标签内容注入到组件的宿主元素中。这样，注入的样式规则可以穿透组件边界，作用于 slot 插槽内的元素。

通过这种方式，你可以：
- 设置插槽内容中任意深度的元素样式
- 使用完整的选择器路径确保样式只作用于目标元素
- 保持组件样式的封装性，同时实现灵活的样式穿透

## 注意事项

⚠️ **样式污染风险**：由于注入的样式会作用到宿主元素所在的作用域，可能会影响到其他组件内的元素。在使用时务必遵循以下原则：

1. **使用具体的选择器**：尽量使用完整的组件标签路径，避免使用过于宽泛的选择器
2. **添加命名空间前缀**：为你的样式类添加独特的前缀，减少与其他组件冲突的可能
3. **避免使用通用标签选择器**：尽量使用类名或属性选择器代替标签选择器

```html
<!-- 推荐：使用具体的选择器 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 不推荐：使用过于通用的选择器 -->
<inject-host>
    <style>
        .content {  /* 容易与其他组件冲突 */
            color: red;
        }
    </style>
</inject-host>
```