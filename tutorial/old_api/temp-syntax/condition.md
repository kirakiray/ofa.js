# 条件渲染

条件渲染是通过三个条件组件来实现的：

## x-if

`x-if` 是主要的判断组件，需要设置 `value` 值。如果 `value` 的条件满足，它会显示包裹的内容。

## x-if-else

`x-if-else` 可以跟在 `x-if` 或 `x-if-else` 后面，需要设置 `value` 值。如果前面的条件组件不满足，且自身的 `value` 为 true，它会显示包裹的内容。

## x-else

`x-else` 可以跟在 `x-if` 或 `x-if-else` 后面，放在最后。如果前面的条件都不满足，它会显示自身包裹的内容。不需要设置 `value` 值。

## 示例

<comp-viewer comp-name="text-render">

```html
<template component>
    <button on:click="count++">Add Count</button>
    <x-if :value="count % 3 === 0">
        <div style="color:red;">if => {{count}}</div>
    </x-if>
    <x-else-if :value="(count + 1) % 3 === 0">
        <div style="color:green;">else-if => {{count}}</div>
    </x-else-if>
    <x-else>
        <div style="color:blue;">else => {{count}}</div>
    </x-else>
    <script>
        export default {
            tag:"text-render",
            data:{
                count:0
            },
        };
    </script>
</template>
```

</comp-viewer>

在示例中，使用了这些条件渲染组件来根据 `count` 的值选择要显示的内容。当 `count` 能被 3 整除时，`x-if` 条件满足，显示红色的文本；当 `(count + 1)` 能被 3 整除时，`x-if-else` 条件满足，显示绿色的文本；否则，显示蓝色的文本。

