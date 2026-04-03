# ofa.js AI 开发速查

这组文档用于帮助 AI 生成可直接运行的 `ofa.js` 页面、组件和微应用代码。原则是：**优先保证正确性，再压缩篇幅**。

## 核心规则

1. 页面文件使用 `<template page>`；组件文件使用 `<template component>`。
2. 模块逻辑写在 `<script>` 内，统一使用 `export default async () => ({ ... })`。
3. 组件必须返回 `tag`；页面不需要 `tag`。
4. 响应式状态放 `data`；组件接收外部 HTML 属性放 `attrs`。
5. `attrs` 和 `data` 的 key 不能重名。
6. `:` 是属性绑定，保留 JavaScript 原始类型；`attr:` 是 HTML attribute 绑定，值会转成字符串；`sync:` 是双向绑定。
7. 模板事件使用 `on:event="method"`，也可以直接写简短表达式，如 `on:click="count++"`。
8. 自定义事件统一使用 `this.emit("event-name", { data: {...} })`，监听方从 `event.data` 取值。
9. 共享状态优先用 `$.stanz()`；挂载共享状态时，在 `attached` 赋值，在 `detached` 清理。
10. 条件和列表渲染优先使用 `o-if`、`o-fill`；只有必须避免额外 DOM 节点时才用 `x-if`、`x-fill`。
11. 不要在模板控制区域内直接增删节点，例如 `o-fill`、`o-if` 或复杂绑定内部。

## 最小运行方式

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./page.html"></o-page>
  </body>
</html>
```

## 页面模块骨架

```html
<template page>
  <style>
    :host {
      display: block;
    }
  </style>

  <h2>{{title}}</h2>
  <input sync:value="title" />
  <button on:click="changeTitle">Change</button>

  <script>
    export default async () => ({
      data: {
        title: "Hello ofa.js",
      },
      proto: {
        changeTitle() {
          this.title = "Updated";
        },
      },
    });
  </script>
</template>
```

## 组件模块骨架

```html
<template component>
  <style>
    :host {
      display: inline-block;
    }
  </style>

  <button on:click="toggle">{{labelText}}</button>

  <script>
    export default async () => ({
      tag: "demo-switch",
      attrs: {
        label: null,
        disabled: null,
      },
      data: {
        checked: false,
      },
      proto: {
        get labelText() {
          return this.label ?? "Switch";
        },
        toggle() {
          if (this.disabled !== null) return;
          this.checked = !this.checked;
          this.emit("change", { data: { checked: this.checked } });
        },
      },
    });
  </script>
</template>
```

使用组件：

```html
<l-m src="./demo-switch.html"></l-m>
<demo-switch label="通知" on:change="handleChange"></demo-switch>
```

## 模板语法速查

### 常用渲染

```html
<p>{{msg}}</p>
<p :html="htmlContent"></p>
<input :value="msg" />
<input sync:value="msg" />
<div attr:title="tip"></div>
<p class:active="isActive"></p>
<p :style.color="isGreen ? 'green' : 'red'"></p>
```

### 事件

```html
<button on:click="add">Add</button>
<button on:click="count++">+1</button>
<button on:click="addBy(5)">+5</button>
<button on:click="handleClick($event)">Event</button>
<button one:click="initOnce">Only once</button>
```

```html
<script>
  export default async () => ({
    data: { count: 0 },
    proto: {
      add() {
        this.count++;
      },
      addBy(num) {
        this.count += num;
      },
      handleClick(event) {
        console.log(event.type);
      },
    },
  });
</script>
```

### 条件渲染

```html
<o-if :value="role === 'admin'">
  <p>管理员</p>
</o-if>
<o-else-if :value="role === 'user'">
  <p>用户</p>
</o-else-if>
<o-else>
  <p>游客</p>
</o-else>
```

说明：

- `o-if` / `o-fill` 会真实渲染组件节点。
- `x-if` / `x-fill` 不会渲染额外 DOM，但性能更差，只在必须保持 DOM 结构时使用。

### 列表渲染

```html
<ul>
  <o-fill :value="items">
    <li>{{$index + 1}}. {{$data.name}}</li>
  </o-fill>
</ul>
```

`o-fill` 内可直接使用：

- `$data`：当前项数据
- `$index`：当前索引
- `$host`：当前页面或组件实例

命名模板写法：

```html
<o-fill :value="items" name="item-tpl"></o-fill>
<template name="item-tpl">
  <li>{{$data.name}}</li>
</template>
```

### 计算属性、侦听器、生命周期

```html
<script>
  export default async () => ({
    data: {
      count: 1,
      doubleCount: 2,
      width: 10,
      height: 5,
      area: 50,
    },
    proto: {
      get countDouble() {
        return this.count * 2;
      },
      set countDouble(val) {
        this.count = val / 2;
      },
    },
    watch: {
      count(newVal) {
        this.doubleCount = newVal * 2;
      },
      ["width,height"]() {
        this.area = this.width * this.height;
      },
    },
    ready() {},
    attached() {},
    loaded() {},
    detached() {},
  });
</script>
```

生命周期顺序：`ready -> attached -> loaded`。

### 非响应式数据

以 `_` 开头的属性不会触发视图更新，适合缓存、Promise、临时对象：

```html
<script>
  export default async () => ({
    data: {
      count: 1,
      _cache: null,
    },
  });
</script>
```

## `attrs`、`data`、绑定方式的区别

| 场景 | 用什么 | 说明 |
| --- | --- | --- |
| 组件接收外部 HTML 属性 | `attrs` | 适合字符串属性、布尔属性；常用默认值是 `null` |
| 组件内部状态 | `data` | 保持原始类型，供模板和逻辑直接使用 |
| 传递 JS 值给组件实例 | `:prop="expr"` | 不要求提前声明在 `attrs` 中 |
| 设置 HTML attribute | `attr:name="expr"` | 会变成 attribute 字符串 |
| 双向同步 | `sync:name="key"` | DOM/组件与当前实例双向联动 |

必须遵守：

- `attrs` 和 `data` 不要使用同名 key。
- HTML attribute 不区分大小写，传值时要用 kebab-case，例如 `fullName` 对应 `full-name`。
- 布尔属性建议在 `attrs` 中设为 `null`，通过 `!== null` 判断是否存在。

例子：

```html
<template component>
  <input type="text" sync:value="fullName" />
  <script>
    export default async () => ({
      tag: "user-card",
      attrs: {
        label: null,
      },
      data: {
        fullName: "",
      },
    });
  </script>
</template>
```

```html
<user-card label="姓名"></user-card>
<user-card sync:full-name="userName"></user-card>
```

## 插槽与自定义事件

默认插槽：

```html
<template component>
  <slot></slot>
  <script>
    export default async () => ({ tag: "demo-box" });
  </script>
</template>
```

命名插槽：

```html
<template component>
  <slot></slot>
  <slot name="footer"></slot>
  <script>
    export default async () => ({ tag: "demo-box" });
  </script>
</template>
```

组件触发事件：

```html
<script>
  export default async () => ({
    tag: "my-button",
    proto: {
      fire() {
        this.emit("submit", {
          data: { value: 123 },
          bubbles: true,
          composed: false,
        });
      },
    },
  });
</script>
```

监听方式：

```html
<my-button on:submit="handleSubmit"></my-button>
```

```html
<script>
  export default async () => ({
    proto: {
      handleSubmit(event) {
        console.log(event.data.value);
      },
    },
  });
</script>
```

## 微应用与路由

最小应用：

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
export const home = "./home.html";

export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```

单页路由：

```html
<l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

页面跳转：

```html
<a href="./about.html" olink>About</a>
```

```html
<script>
  export default async () => ({
    proto: {
      goAbout() {
        this.goto("./about.html");
        this.replace("./about.html");
        this.back();
        this.forward();
      },
    },
  });
</script>
```

嵌套路由：父页面放 `<slot></slot>`；子页面通过 `export const parent = "./layout.html"` 指定父页面。

## DOM API 使用建议

- 普通页面中可直接使用 `$()`、`$.all()` 操作元素。
- 在页面模块或组件模块中，优先使用 `this.shadow.$()` 获取 Shadow DOM 内的元素。
- 需要手动刷新非响应式数据时可调用 `this.refresh()`。
- 不要在由模板语法控制的区域随意使用 `push()`、`splice()`、`before()`、`after()` 改结构。

示例：

```html
<template page>
  <ul id="list">
    <li>Item 1</li>
  </ul>
  <button id="btn">Add</button>

  <script>
    export default async () => ({
      attached() {
        this.shadow.$("#btn").on("click", () => {
          this.shadow.$("#list").push(`<li>Item ${this.shadow.$("#list").length + 1}</li>`);
        });
      },
    });
  </script>
</template>
```

## 状态管理

共享状态、Provider/Consumer、`match-var` 详见 [state.md](./state.md)。

最常用模式：

```javascript
// data.js
export const store = $.stanz({ count: 0, user: { name: "张三" } });
```

```html
<script>
  export default async ({ load }) => {
    const { store } = await load("./data.js");
    return {
      data: { localStore: {} },
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

## 其他官方能力

- `replace-temp`：用于 `select`、`table` 等特殊结构中的列表渲染。
- `inject-host`：向宿主注入样式，处理深层插槽样式。

详见 [official-components.md](./official-components.md)。

## API 参考

需要 DOM API、事件 API、`o-app` / `o-page`、`formData()`、`$.stanz()` 速查时，查看 [api.md](./api.md)。

## 给 AI 的最终建议

生成 `ofa.js` 代码时，优先遵循以下顺序：

1. 先判断是页面还是组件。
2. 再确定外部输入放 `attrs`，内部状态放 `data`。
3. 优先使用模板绑定和生命周期，不要先写命令式 DOM 操作。
4. 组件对外通信优先用 `sync:` 和 `emit()`。
5. 需要共享数据时再引入 `$.stanz()` 或 Provider/Consumer。
