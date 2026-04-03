# ofa.js 使用教程

ofa.js 是一个Web前端框架；它是：

- 可以直接运行在浏览器上，不依赖nodejs webpack 和 npm 的环境
- 一个基于Web Components的前端框架
- 拥有和Vue、React 等框架类似的语法糖
- 为AI优化的前端框架，因为不需要依赖node.js、webpack、npm等工具，直接生成代码放在静态容器就可以运行，大幅节省AI生成应用后部署的成本。
- 一个渐进式微前端框架，从简单使用到复杂的微前端应用，都能使用它来开发

## 如何使用 ofa.js

### 引用

只需要在html内直接引入ofa.js的js文件，即可开始使用ofa.js

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

### 开始使用页面模块

可以创建一个**页面模块**进行简单的使用，它提供和现代框架一个的类似的模板语法糖来开发。

```html
<!-- demo.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js Page Module Usage</title>
    <script
      src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs"
      type="module"
    ></script>
  </head>
  <body>
    <o-page src="./page1.html"></o-page>
  </body>
</html>
```

```html
<!-- page1.html -->
<template page>
  <style>
    :host {
      display: block;
      color: blue;
    }
  </style>
  <h2>Hello World</h2>
</template>
```

当引用 ofa.js 文件成功后，可以在全局使用 `o-page`  组件来加载页面模块；通过 `src` 属性指向页面模块的地址。

通过 `<template page>` 来定义页面模块，放在 `html` 文件内。

其中 `:host` 用于定义当前 page 组件的样式，可以参考 Web Components 的样式选择器 [:host](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/:host)。

所以上面的案例，你可以得到一个蓝色的 Hello World 展示。

## 模板语法

在**页面模块**内，可以使用各种各样的模板语法糖来开发，让你像使用Vue和React一样，降低难度，开发各种需求。

### 文本渲染

```html
<!-- demo.html -->
<!-- 只保留改动代码，其他html的内容省略，参考最上面的案例 -->
<o-page src="./page2.html"></o-page>
```

```html
<!-- page2.html -->
<template page>
  <style>
    :host {
      display: block;
      color: Green;
    }
  </style>
  <h2>{{val}}</h2>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello World",
        },
      };
    };
  </script>
</template>
```

通过在 template 内创建 `script` 标签，内容 `export default` 返回异步函数，并返回一个对象，定义当前**页面模块**的参数。

其中 **data** 用于定义当前页面的数据。

通过在节点使用 `{{key}}` 来直接渲染 `data` 数据到为文本到节点上。

### 绑定事件

通过在 `proto` 上设置模块的方法，然后在模板节点上，使用 `on:xxx` 方法进行绑定。

例如：

```html
<!-- page3.html -->
<template page>
  <style>
    :host {
      display: block;
      color: Green;
    }
  </style>
  <h2>{{val}}</h2>
  <button on:click="handleButtonClick">Click me</button>
  <script>
    export default async () => {
      return {
        data: {
          val: "Hello World",
        },
        proto:{
          handleButtonClick(){
            this.val = "Hello ofa.js App Demo";
          }
        }
      };
    };
  </script>
</template>
```

### 直接运行函数

对于简单的操作（如计数器增加、状态切换等），可以直接在事件属性中编写简短的表达式：

```html
<button on:click="count++">Click Me - {{count}}</button>
```

### 传递参数到事件处理器

```html
<button on:click="addNumber(5)">Add 5 - Current: {{count}}</button>
<script>
  export default async () => {
    return {
      data: { count: 0 },
      proto: {
        addNumber(num) {
          this.count += num;
        }
      }
    };
  };
</script>
```

### 访问事件对象

在事件处理器中，可以通过 `$event` 参数访问原生事件对象：

```html
<div on:click="handleClick($event)">点击任意位置查看坐标</div>
```

### 渲染 HTML 内容

通过为元素添加 `:html` 指令，可将对应变量中的 HTML 字符串解析并安全地插入元素内部：

```html
<p :html="htmlContent"></p>
<script>
  export default async () => {
    return {
      data: {
        htmlContent: '<span style="color:green;">Hello ofa.js</span>',
      },
    };
  };
</script>
```

### 单向属性绑定

单向属性绑定使用 `:toKey="fromKey"` 语法，将组件数据"单向"同步到 DOM 元素的属性：

```html
<input type="text" :value="val" placeholder="这是一个单向绑定的输入框">
```

### 双向属性绑定

双向属性绑定采用 `sync:xxx` 语法，实现了组件数据与DOM元素之间的双向同步：

```html
<input type="text" sync:value="val" placeholder="这是一个双向绑定的输入框">
```

### 类和样式绑定

#### 类绑定

使用 `class:className="booleanExpression"` 语法来绑定特定的类：

```html
<p class:hide="isHide">{{val}}</p>
<button on:click="isHide = !isHide">Toggle Display</button>
```

#### 样式绑定

使用 `:style.propertyName` 语法来绑定特定的样式属性：

```html
<p :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
<button on:click="isGreen = !isGreen">Toggle Color</button>
```

#### 属性绑定

使用 `attr:attributeName` 语法来实现属性绑定：

```html
<p attr:title="tooltipText">Hover over me</p>
<input type="text" attr:disabled="isDisabled" />
```

### 条件渲染

ofa.js 提供了基于组件的条件渲染方案，通过 `o-if`、`o-else-if` 和 `o-else` 组件实现：

```html
<o-if :value="role === 'admin'">
  <p>管理员面板</p>
</o-if>
<o-else-if :value="role === 'user'">
  <p>用户中心</p>
</o-else-if>
<o-else>
  <p>请登录</p>
</o-else>
```

### 列表渲染

`o-fill` 组件提供了强大的列表渲染功能：

```html
<ul>
  <o-fill :value="fruits">
    <li>{{$index + 1}}. {{$data.name}} - 价格: ¥{{$data.price}}</li>
  </o-fill>
</ul>
<script>
  export default async () => {
    return {
      data: {
        fruits: [
          { name: "苹果", price: 5 },
          { name: "橙子", price: 6 },
        ]
      }
    };
  };
</script>
```

在 `o-fill` 内：
- `$index` 代表当前项的索引（从0开始）
- `$data` 代表当前项的数据对象
- `$host` 代表当前组件实例

使用命名模板的示例：

```html
<o-fill :value="products" name="product-template"></o-fill>
<template name="product-template">
  <div class="product-card">
    <div class="product-name">{{$data.name}}</div>
    <div class="product-price">¥{{$data.price}}</div>
  </div>
</template>
```

### 计算属性

计算属性是定义在 `proto` 对象中的特殊方法，使用 JavaScript 的 `get` 或 `set` 关键字来定义：

```html
<script>
  export default async () => {
    return {
      data: { count: 1 },
      proto: {
        get countDouble() {
          return this.count * 2;
        },
        set countDouble(val) {
          this.count = val / 2;
        }
      }
    };
  };
</script>
```

### 侦听器

侦听器定义在组件的 `watch` 对象中，用于监听数据变化：

```html
<script>
  export default async () => {
    return {
      data: { count: 0, doubleCount: 0 },
      watch: {
        count(newVal) {
          this.doubleCount = newVal * 2;
        }
      }
    };
  };
</script>
```

监听多个数据源：

```html
<script>
  export default async () => {
    return {
      data: { width: 10, height: 5, area: 0 },
      watch: {
        ["width,height"]() {
          this.area = this.width * this.height;
        }
      }
    };
  };
</script>
```

### 生命周期

ofa.js 提供了完整的生命周期钩子函数：

```html
<script>
  export default async () => {
    return {
      data: {},
      ready() {
        // 组件准备就绪，DOM已创建
      },
      attached() {
        // 组件已挂载到DOM
      },
      detached() {
        // 组件已从DOM移除，适合清理资源
      },
      loaded() {
        // 组件完全加载完成
      }
    };
  };
</script>
```

生命周期执行顺序：`ready` → `attached` → `loaded`

### 非响应式数据

以 `_` 开头的属性名为非响应式属性，变化不会触发视图更新：

```html
<script>
  export default async () => {
    return {
      data: {
        count: 20,        // 响应式
        _count2: 100,     // 非响应式
      }
    };
  };
</script>
```

## 组件开发

### 创建组件

组件模块的 `<template>` 元素使用 `component` 属性，并声明 `tag` 属性指定组件标签名：

```html
<!-- demo-comp.html -->
<template component>
  <style>
    :host {
      display: block;
      border: 1px solid green;
      padding: 10px;
    }
  </style>
  <h3>{{title}}</h3>
  <script>
    export default async () => {
      return {
        tag: "demo-comp",
        data: {
          title: "OFAJS 组件示例",
        },
      };
    };
  </script>
</template>
```

使用组件：

```html
<!-- 异步引用和同步引用二选一，通常选异步引用 -->
<!-- 异步引用 -->
<l-m src="./demo-comp.html"></l-m>
<demo-comp></demo-comp>

<!-- 同步引用，在页面模块或组件模块内使用 -->
<script>
  export default async ({ load }) => {
    await load("./demo-comp.html");
    return { data: {} };
  };
</script>
<demo-comp></demo-comp>
```

### 传递特征属性

在组件的 `attrs` 对象中声明需要接收的属性：

```html
<!-- demo-comp.html -->
<template component>
  <p>First: {{first}}</p>
  <p>Full Name: {{fullName}}</p>
  <script>
    export default async () => {
      return {
        tag: "demo-comp",
        attrs: {
          first: null,        // 无默认值
          fullName: "",       // 有默认值
        },
      };
    };
  </script>
</template>
```

使用：

```html
<demo-comp first="OFA" full-name="OFA 组件示例"></demo-comp>
```

注意：HTML 属性不区分大小写，传递包含大写字母的属性时，需要使用 `-` 分割命名（kebab-case 格式），如 `fullName` → `full-name`。

### attrs 与 data 的正确使用

**核心规则**：`attrs` 和 `data` 的 key 不能重复。

| 特性 | attrs | data |
|------|-------|------|
| 用途 | 接收外部 HTML 属性 | 组件内部状态 |
| 数据类型 | 会转为字符串 | 保持原始类型 |
| 默认值 | 建议用 `null` | 根据需求设置 |

**使用规则**：

1. **布尔属性（disabled）**：用 `null` 初始化，`!== null` 判断是否存在
2. **字符串属性（label）**：用 `null` 初始化，可区分"未设置"和"空字符串"
3. **内部状态（checked）**：放 `data` 中，通过 `sync:` 双向绑定
4. **emit 事件**：使用 `data` 而不是 `detail`，如 `this.emit("change", { data: { checked } })`

```html
<!-- switch.html -->
<template component>
  <div class="switch" class:checked="checked" class:disabled="disabled !== null" on:click="toggle">
    <span class="slider"></span>
  </div>
  <o-if :value="label !== null">
    <span class="label">{{label}}</span>
  </o-if>
  <script>
    export default async () => ({
      tag: "ofa-switch",
      attrs: { disabled: null, label: null },  // 外部属性
      data: { checked: false },                 // 内部状态
      proto: {
        toggle() {
          if (this.disabled !== null) return;  // 布尔属性判断
          this.checked = this.checked ? null : true;
          this.emit("change", { data: { checked: this.checked } });
        },
      },
    });
  </script>
</template>

<!-- 使用 -->
<ofa-switch></ofa-switch>                         <!-- 默认关闭 -->
<ofa-switch disabled></ofa-switch>                <!-- 禁用，用 !== null 判断 -->
<ofa-switch label="通知"></ofa-switch>            <!-- 带标签 -->
<ofa-switch sync:checked="state"></ofa-switch>    <!-- 双向绑定 -->
<ofa-switch on:change="handleChange"></ofa-switch>
<script>
  export default async () => ({
    data: { state: false },
    proto: { handleChange(e) { console.log(e.data.checked); } },
  });
</script>
```

### 属性绑定 vs 特征属性

| 特性 | 属性绑定 (`:`) | 特征属性 (`attr:`) |
|------|---------------|-------------------|
| 绑定目标 | 组件实例的 JavaScript 属性 | HTML 属性 |
| 数据类型 | 保持原始类型 | 转换为字符串 |
| 定义要求 | 不需要提前定义 | 必须在 `attrs` 中定义 |

```html
<!-- 属性绑定：传递 JavaScript 值，保持数据类型 -->
<my-component :data-value="complexObject"></my-component>
<my-component :count="42"></my-component>

<!-- 特征属性：设置 HTML 属性，所有值转为字符串 -->
<my-component attr:data-value="simpleString"></my-component>
```

### 双向属性绑定（组件间）

```html
<!-- 父组件 -->
<demo-comp sync:full-name="val"></demo-comp>

<!-- 子组件 demo-comp.html -->
<input type="text" sync:value="fullName">
<script>
  export default async () => {
    return {
      tag: "demo-comp",
      data: { fullName: "" }
    };
  };
</script>
```

### 插槽

#### 默认插槽

```html
<!-- demo-comp.html -->
<template component>
  <slot></slot>
  <script>
    export default async () => ({ tag: "demo-comp" });
  </script>
</template>

<!-- 使用 -->
<demo-comp>
  <div>Hello, OFAJS!</div>
</demo-comp>
```

#### 命名插槽

```html
<!-- demo-comp.html -->
<template component>
  <slot></slot>
  <slot name="footer"></slot>
  <script>
    export default async () => ({ tag: "demo-comp" });
  </script>
</template>

<!-- 使用 -->
<demo-comp>
  <div>主要内容</div>
  <div slot="footer">Footer Content</div>
</demo-comp>
```

### 自定义事件

使用 `emit` 方法触发自定义事件：

```html
<!-- my-component.html -->
<template component>
  <button on:click="handleClick">点击触发事件</button>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        proto: {
          handleClick() {
            this.emit('button-clicked', {
              data: { message: '按钮被点击了', timestamp: Date.now() },
              bubbles: true,      // 是否冒泡，默认为 true
              composed: false,    // 是否穿透 Shadow DOM，默认为 false
            });
          }
        }
      };
    };
  </script>
</template>
```

监听自定义事件：

```html
<my-component on:button-clicked="handleButtonClick"></my-component>
```

## 微应用与路由

### 微应用

使用 `o-app` 进行应用化：

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
export const home = "./home.html";

export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```

### 单页面应用

使用 `o-router` 组件实现单页面应用：

```html
<!doctype html>
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router fix-body>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

### 页面导航

```html
<!-- 使用 olink 属性的链接 -->
<a href="./about.html" olink>跳转到关于页面</a>

<!-- 编程式导航 -->
<button on:click="gotoAbout">跳转</button>
<script>
  export default async () => {
    return {
      data: {},
      proto: {
        gotoAbout() {
          this.goto("./about.html");      // 跳转到指定页面
          this.replace("./about.html");   // 替换当前页面
          this.back();                     // 后退
          this.forward();                  // 前进（需要设置 allowForward: true）
        }
      }
    };
  };
</script>
```

### 嵌套页面/路由

父页面使用 `<slot></slot>` 预留子页面位置：

```html
<!-- layout.html -->
<template page>
  <header>导航栏</header>
  <div class="content">
    <slot></slot>
  </div>
</template>
```

子页面通过导出 `parent` 属性指定父页面：

```html
<!-- sub-page.html -->
<template page>
  <p>子页面内容</p>
  <script>
    export const parent = './layout.html';
    export default async () => ({ data: {} });
  </script>
</template>
```

## 状态管理

ofa.js 提供了多种状态管理机制，包括响应式数据、状态共享和上下文状态传递。

**详细的状态管理教程请参考：[state.md](./state.md)**

快速概览：

```javascript
// 创建共享状态
export const store = $.stanz({ count: 0, user: { name: "张三" } });
```

```html
<!-- 在组件中使用状态 -->
<script>
  export default async ({ load }) => {
    const { store } = await load("./data.js");
    return {
      data: { localStore: {} },
      attached() { this.localStore = store; },
      detached() { this.localStore = {}; }
    };
  };
</script>
```

```html
<!-- 上下文状态传递 -->
<o-provider name="userInfo" user-name="张三">
  <my-component></my-component>
</o-provider>
<o-consumer name="userInfo" watch:user-name="userName"></o-consumer>
```

## 其他重要功能

### 非显式组件

`x-if`、`x-else-if`、`x-else` 和 `x-fill` 是非显式组件，不会渲染到 DOM 中：

```html
<style>
  .container > .item {
    /* 选择子一级 .item 元素为红色 */
    color: red;
  }
</style>
<div class="container">
  <o-if :value="true">
    <!-- 样式不为红色，因为 o-if 组件本身存在于 DOM 中，.item 不是 .container 的直接子元素 -->
    <div class="item">不会显示为红色</div>
  </o-if>
  <x-if :value="true">
    <!-- 样式为红色，因为 x-if 不会渲染到 DOM 中，.item 是 .container 的直接子元素 -->
    <div class="item">显示为红色</div>
  </x-if>
</div>
```

注意：非显式组件性能较差，建议优先使用显式组件（`o-if`、`o-fill`），仅在特定场景下使用非显式组件。

### replace-temp 组件

用于解决在 select 或 table 等特殊元素内进行列表渲染的问题：

```html
<select>
  <template is="replace-temp">
    <x-fill :value="items">
      <option>{{$data}}</option>
    </x-fill>
  </template>
</select>
```

### 注入宿主样式

使用 `<inject-host>` 向宿主元素注入样式：

```html
<template component>
  <inject-host>
    <style>
      user-list user-list-item {
        background-color: blue;
      }
    </style>
  </inject-host>
  <slot></slot>
</template>
```

## API 使用案例

ofa.js 提供了强大的 API 用于操作 DOM 元素。以下是两个简单的使用示例：

### 在普通网页上使用

```html
<!doctype html>
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
  </head>
  <body>
    <ul id="list">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    <button id="btn">Add Item</button>

    <script>
      // 获取元素并绑定事件
      $("#btn").on("click", () => {
        const count = $("#list").length + 1;
        $("#list").push(`<li>Item ${count}</li>`);
      });

      // 修改元素样式
      $("#list").css.color = "blue";
    </script>
  </body>
</html>
```

### 在页面模块内使用

```html
<template page>
  <ul id="list">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  <button id="btn">Add Item</button>

  <script>
    export default async () => {
      return {
        data: {},
        attached() {
          // 绑定点击事件
          this.shadow.$("#btn").on("click", () => {
            const count = this.shadow.$("#list").length + 1;
            this.shadow.$("#list").push(`<li>Item ${count}</li>`);
          });
        }
      };
    };
  </script>
</template>
```

**完整的 API 文档请参考：[api.md](./api.md)**

## SSR 同构渲染

ofa.js 支持同构渲染，适用于任何服务端环境：

```html
<!doctype html>
<html lang="en">
<head>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
</head>
<body>
  <o-app src="/app-config.js">
    <!-- 页面模块内容插入位置 -->
    <template page>
      <p>I am Page</p>
    </template>
  </o-app>
</body>
</html>
```

## 部署

使用 ofa.js 开发的项目，直接部署到静态服务器上即可使用。

生产环境可以使用 [Terser CLI](https://terser.org/docs/cli-usage/) 进行压缩混淆，或使用 [ofa build](https://builder.ofajs.com/) 在线工具。
