# loaded

`loaded` 生命周期钩子在组件模板内的所有依赖都加载完成后触发。这个阶段确保在渲染组件之前，所有的依赖都已经加载完毕。这个时候适合去除在 `ready` 阶段添加的Loading样式。

## 示例代码

```html
<div id="logger">-</div>
<div style="color:red;">loaded : <span id="loaded"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-loaded');
  },500);
</script>
```

<comp-viewer comp-name="test-loaded">

```
<div id="logger">-</div>
<div style="color:red;">loaded : <span id="loaded"></span></div>
<script>
  setTimeout(()=>{
    const ele = document.createElement('test-loaded');
  },500);
</script>
```

```html
<template component>
  <l-m src="https://ofajs.github.io/ofa-v4-docs/docs/publics/comps/punch-logo.html"></l-m>
  <punch-logo></punch-logo>
  <script>
    let count = 0;
    export default {
      tag: "test-loaded",
      ready(){
        $("#loaded").push(`<div>ready - ${this.shadow.$('l-m').ele.loaded}</div>`);
      },
      loaded(){
        count++;
        $("#logger").text = count;
        $("#loaded").push(`<div>loaded - ${this.shadow.$('l-m').ele.loaded}</div>`);
      }
    };
  </script>
</template>
```

</comp-viewer>

## 生命周期流程图

<img src="../../../publics/life-cycle.png" width="512" />
