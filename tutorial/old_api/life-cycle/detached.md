# detached

`detached` 生命周期钩子会在组件从文档中移除时触发。在这个阶段，你可以执行一些清理操作，比如取消事件监听或者释放资源，以防止内存泄漏。

## 示例代码

```html
<div id="logger">-</div>
<div style="color:red;">shadow html : <span id="shadowHtml"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-ready');
    setTimeout(()=>{
      $('body').push(ele);
      setTimeout(()=>{
        $(ele).remove();
      },500);
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
      setTimeout(()=>{
        $(ele).remove();
      },500);
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
      },
      detached(){
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
