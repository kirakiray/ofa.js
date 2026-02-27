# 文本渲染

你可以使用两个包裹的大括号的形式 `{{xxx}}` 在模板内渲染文本，其中 `xxx` 是组件或页面自身的属性。这允许你将属性的值直接渲染到页面上。

以下是一个示例，演示了如何在模板中渲染文本：

<comp-viewer comp-name="text-render">

```html
<template component>
    render test: {{txt}}
    <script>
        export default {
            tag:"text-render",
            data:{
                txt:"I am txt"
            },
        };
    </script>
</template>
```

</comp-viewer>

在这个示例中，`{{txt}}` 将会被属性 `txt` 的值替代，最终呈现在页面上。