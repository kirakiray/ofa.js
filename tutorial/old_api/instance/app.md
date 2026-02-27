# app

在 `o-app` 内的元素，包括在 `o-app` 内的 `o-page` 的影子节点内的元素，或者再内部的子组件，它们的 `app` 属性都是指向这个 `o-app` 的元素实例。

以下是一个示例，演示了如何在 `o-app` 内的元素中访问 `app` 属性：

<iframe src="../../../publics/test-app/demo.html" style="border:none;width:100%;height:200px;"></iframe>

代码如下：

```html
<!-- demo.html -->
<style>
    o-app {
    display: block;
    width: 250px;
    height: 150px;
    border: #aaa solid 1px;
    }
</style>
<o-app data-warn="main-app">
    <o-page src="./page1.html?count=100"></o-page>
</o-app>
```

```html
<!-- page1.html -->
<template page>
  <l-m src="./test-comp.html"></l-m>
  <div>txt : {{txt}}</div>
  <test-comp></test-comp>
  <script>
    export default {
      data: {
        txt: "-",
      },
      ready() {
        this.txt = this.app.data.warn;
      },
    };
  </script>
</template>
```

```html
<!-- test-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      padding: 8px;
      margin: 8px;
      border: #aaa solid 1px;
    }
  </style>
  in test-comp shadow:
  <br />
  apptag: {{app.tag}}
  <br />
  appwarn: {{app.data.warn}}
  <script>
    export default {
      data: {},
    };
  </script>
</template>
```

在上述示例中，`o-app` 元素的 `app` 属性包含了 `o-page` 元素和 `test-comp` 自定义组件内的元素。这意味着它们都可以通过 `app` 属性访问到 `o-app` 元素的数据和方法。