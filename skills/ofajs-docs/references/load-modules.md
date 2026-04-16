# 加载模块与第三方库

`export default` 函数可接收 `{ load, url }` 参数，用于动态加载模块和第三方库。

## 参数说明

- `url`：当前模块完整 URL
- `load`：加载模块/资源，支持 JSON、第三方 ES Module，与 `<l-m>` 功能一致且共享缓存

## 基本用法

```html
<template component>
  <div :html="content"></div>
  <script>
    export default async ({ load, url }) => {
      const { marked } = await load("https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.esm.js");
      return {
        tag: "md-view",
        attrs: { src: null },
        data: { content: "" },
        watch: { src() { this.loadMd(); } },
        proto: {
          async loadMd() {
            this.content = marked.parse(await (await fetch(this.src)).text());
          }
        }
      };
    };
  </script>
</template>
```

## 加载本地模块

```html
<script>
  export default async ({ load }) => {
    const { store } = await load("./data.js");
    return {
      data: {
        localStore: {},
      },
      attached() {
        this.localStore = store;
      },
      detached() {
        this.localStore = {};
      },
    };
  };
</script>
```

## 加载 JSON

```html
<script>
  export default async ({ load }) => {
    const config = await load("./config.json");
    return {
      data: { settings: config },
    };
  };
</script>
```

## 确保组件完全加载

`load` 方法与 `<l-m>` 标签功能一致，但可以确保目标组件完全加载完成后，才进入当前页面或组件模块的初始化流程。

```html
<script>
  export default async ({ load }) => {
    // 等待 header 和 footer 组件完全加载后，才继续执行
    await load("./components/header.html");
    await load("./components/footer.html");

    return {
      data: {},
    };
  };
</script>
```