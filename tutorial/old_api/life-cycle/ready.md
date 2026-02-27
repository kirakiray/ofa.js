# ready

`ready` 生命周期钩子会在组件的数据和模板刚被初始化后触发，表示组件已经准备就绪。在这个阶段，你可以访问组件的数据，并且模板已经渲染完成，可以执行一些与界面交互相关的操作。

## 示例代码

```html
<div id="logger">-</div>
<div style="color:red;">shadow html : <span id="shadowHtml"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-ready');
  },500);
</script>
```

<comp-viewer comp-name="test-ready">

```
<div id="logger">-</div>
<div style="color:red;">shadow html : <span id="shadowHtml"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-ready');
  },500);
</script>
```

```html
<template component>
  <div>test ready</div>
  <script>
    let count = 0;
    export default {
      tag: "test-ready",
      ready(){
        count++;
        $("#logger").text = count;
        $('#shadowHtml').text = this.shadow ? this.shadow.html : 'null';
      }
    };
  </script>
</template>
```

</comp-viewer>

## 生命周期流程图

<img src="../../../publics/life-cycle.png" width="512" />
