# watch

一旦 `ready` 阶段完成，与之关联的 `watch` 对象中的监听函数会被触发一次。随后，当数据的某个值发生变动时，会再次触发相应键（key）的监听函数。


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
  <div>test watch</div>
  <script>
    let count = 0;
    export default {
      tag: "test-ready",
      data:{
        val: "I am val"
      },
      watch:{
        val(val){
          count++;
          $("#logger").text = count;
          $("#shadowHtml").push(`<div>${val}</div>`);
        }
      },
      ready(){
        setTimeout(()=>{
          this.val = 'change val';
        },500);
      }
    };
  </script>
</template>
```

</comp-viewer>

## 生命周期流程图

<img src="../../../publics/life-cycle.png" width="512" />
