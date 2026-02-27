# attached

`attached` 生命周期钩子会在组件被添加到文档中时触发。在这个阶段，适合获取组件内元素的尺寸相关信息，进行数据绑定和全局事件的操作。

## 示例代码

```html
<div id="logger">-</div>
<div style="color:red;">shadow html : <span id="shadowHtml"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-ready');
    setTimeout(()=>{
      $('body').push(ele);
    },500);
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
    setTimeout(()=>{
      $('body').push(ele);
    },500);
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
      },
      attached(){
        count++;
        $("#logger").text = count;
      }
    };
  </script>
</template>
```

</comp-viewer>

## 生命周期流程图

<img src="../../../publics/life-cycle.png" width="512" />
