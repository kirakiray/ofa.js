# 非显式组件

ofa.js 内好包含两种非显示组件:

* 条件渲染组件: x-if x-else-if x-else：
* 填充组件: x-fill

他们功能和 o-if 和 o-fill 组件功能相同，但是它们本地并不会真实的渲染到 DOM 中，而是内部元素渲染到对应的区域。

例如: 

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 样式不为红色，o-if 组件存在 -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- 样式为红色，x-if 组件不存在 -->
        <div class="item">2</div>
    </x-if>
</div>
```

除了功能上的区别，非显示组件的渲染性能会比显示的组件性能差很多，因为非显示组件不会真实的渲染到 DOM 中，多了很多模拟渲染的逻辑。所以尽量，还是使用显示组件。