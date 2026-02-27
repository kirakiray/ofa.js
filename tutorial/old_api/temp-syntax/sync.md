# sync

通过 sync 语法对组件进行双向数据绑定

<comp-viewer comp-name="sync-render">

```html
<template component>
    <input type="text" sync:value="txt" />
    <br>
    render txt: {{txt}}
    <script>
        export default {
            tag:"sync-render",
            data:{
                txt:"I am txt"
            },
        };
    </script>
</template>
```

</comp-viewer>

sync 还可以和内嵌的组件实例属性进行绑定，案例请查看[双向数据绑定](../../cases/sync.md)；