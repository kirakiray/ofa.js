# refresh

用于主动刷新组件的渲染视图，有时候组件上的数据没有更新时，可以使用该方法刷新组件的视图；

<comp-viewer comp-name="custom-comp">

```html
<template component>
  <!-- "_"开头的私有数据改动不会触发页面的刷新 -->
  <div>{{_count}}</div>
  <button on:click="refresh()">刷新</button>
  <script>
    export default {
      tag: "custom-comp",
      data: {
        _count: 0,
      },
      attached() {
        this._timer = setInterval(() => {
          this._count++;
        }, 200);
      },
    };
  </script>
</template>
```

</comp-viewer>