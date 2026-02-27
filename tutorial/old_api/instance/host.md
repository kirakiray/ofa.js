# host

使用 `host` 属性，可以获取元素的宿主组件实例。这对于在组件内部访问其宿主组件的数据和方法非常有用。

下面是一个示例，演示如何使用 `host` 属性获取宿主组件的实例：

<comp-viewer comp-name="host-demo">

```html
<template component>
  <div>tag: {{txt}}</div>
  <div>bool: {{txt2}}</div>
  <script>
    export default {
      tag: "host-demo",
      data: {
        txt: "-",
        txt2: '-'
      },
      ready(){
        const host = this.shadow.$("div").host;
        this.txt = host.tag;
        this.txt2 = host === this;
      }
    };
  </script>
</template>
```

</comp-viewer>

在这个示例中，我们创建了一个自定义组件 `host-demo`，并在组件内部访问了它的宿主组件实例，然后比较了它们是否相等。

如果元素不在组件内，`host` 的值将为 `null`。例如：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li id="target">
        I am target
    </li>
</ul>

<div id="logger" style="border:red solid 1px;padding:8px;">-</div>

<script>
    setTimeout(()=>{
        $("#logger").text = String($("#target").host);
    },500);
</script>
```

</html-viewer>

在这个示例中，`#target` 元素在 body下，不在任何组件或页面内，所以 `$("#target").host` 的值为 `null`。