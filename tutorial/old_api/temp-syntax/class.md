# class

你可以通过 `class` 语法快速切换模板内的 class 名。在 `class:aaa="bbb"` 中，当 `bbb` 表达式(或组件自身的 `bbb` 属性)为 `true` 时，会为目标元素添加 `aaa` 这个 className。

请注意，className 不能包含大写字母，请使用 `-` 作为分隔符。

以下是一个示例，演示了如何使用 `class` 语法在模板中切换元素的 class 名：

<comp-viewer comp-name="test-class">

```html
<template component>
    <style>
        .color-red{
            color:red;
        }
        .color-blue{
            color:blue;
        }
    </style>
    <div 
      class:color-red="txt == 1" 
      class:color-blue="txt == 2" 
      on:click="switch1">Click Me</div>
    <script>
        export default {
          tag:"test-class",
          data:{
            txt:"1"
          },
          proto:{
            switch1(){
              this.txt = (this.txt == 1) ? 2 : 1;
            }
          }
        };
    </script>
</template>
```

</comp-viewer>

## 直接使用 class

你可以使用 `class` 方法来直接调整元素的 className。在下面的示例中，演示了如何使用 `class` 方法来动态添加和删除类名：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<style>
    .color-red{
        color:red;
    }
    .color-blue{
        color:blue;
    }
</style>
<div id="target">I am target</div>

<script>
    setTimeout(()=>{
        $('#target').class('color-red',true);
    },500);
    setTimeout(()=>{
        $('#target').class('color-red',false);
    },1000);
    setTimeout(()=>{
        $('#target').class('color-blue',true);
    },1500);
</script>
```

</html-viewer>


在这个示例中，我们首先通过 `class` 方法将 `color-red` 类添加到元素上，然后在一秒后将其移除，再过半秒后将 `color-blue` 类添加到元素上。这会动态更改目标元素的样式。

我们建议使用 [classList](../props/class-list.md) 属性来操作类名，因为这是更常见和标准的方法。