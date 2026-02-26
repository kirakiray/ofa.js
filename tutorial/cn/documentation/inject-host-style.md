# 注入宿主样式

因为 web components 不能设定 slot 内多级的样式，所以我们需要在组件内注入宿主样式，方便在组件内多级的元素进行样式设定。

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 设置子一级的元素样式 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item{
                background-color: aqua;
            }
             /* 还可以设置多级的样式 */
            user-list user-list-item user-list-item-content{
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag:"user-list",
                ...
            };
        };
    </script>
</template>
```

这个组件是属于注入性的样式，可能会影响到其他组件内的元素。所以使用时务必小心，做好css选择器条件筛选。