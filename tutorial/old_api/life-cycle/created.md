# created

`created` 生命周期钩子在组件创建时被触发。在此阶段，组件的数据尚未被初始化，模板内容也未被渲染。你可以在这个阶段执行一些初始化操作，或者准备在后续阶段使用的数据。

## 示例代码

```html
<div id="logger">-</div>
<div style="color:red;">shadow html : <span id="shadowHtml"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-created');
  },500);
</script>
```

<comp-viewer comp-name="test-created">

```
<div id="logger">-</div>
<div style="color:red;">shadow html : <span id="shadowHtml"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-created');
  },500);
</script>
```

```html
<template component>
  <div>test created</div>
  <script>
    let count = 0;
    export default {
      tag: "test-created",
      created(){
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
