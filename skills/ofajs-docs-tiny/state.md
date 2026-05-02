# ofa.js 状态管理速查

本文档只保留 AI 在生成页面和组件时最常用、最容易写错的状态管理规则。

## 1. 本地响应式数据

页面或组件的本地状态写在 `data` 中：

```html
<script>
  export default async () => ({
    data: {
      count: 0,
      user: {
        name: "张三",
      },
    },
    proto: {
      add() {
        this.count++;
        this.user.name = "李四";
      },
    },
  });
</script>
```

规则：

- `data` 默认是响应式的，修改嵌套对象属性也会更新视图。
- 以 `_` 开头的字段是非响应式数据，适合缓存、Promise、临时对象。
- 非响应式字段变化后如果要刷新视图，可手动调用 `this.refresh()`。

## 2. 共享状态：`$.stanz()`

多个页面或组件共享同一份数据时，使用 `$.stanz()`：

```javascript
// store.js
export const store = $.stanz({
  count: 0,
  user: { name: "张三" },
  list: [],
});
```

特点：

- 返回响应式对象。
- 支持深层对象和数组更新。
- 所有引用同一个 store 的地方都会自动同步。

## 3. 在页面或组件中挂载共享状态

推荐模式：在 `attached` 挂载，在 `detached` 清理。

```html
<script>
  export default async ({ load }) => {
    const { store } = await load("./store.js");
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

这样写的原因：

- 生命周期更清晰。
- 组件销毁时能及时释放引用，减少内存泄漏风险。

## 4. 状态作用域建议

- 全局状态：用户信息、主题、语言、全局配置。
- 模块状态：购物车、聊天面板、某个局部业务块。
- 局部状态：仅当前页面或组件自己使用的数据，直接放 `data`。

## 5. 上下文状态：`o-provider` / `o-consumer`

当数据要跨层级传递，但不想层层传参时，使用上下文状态。

### 提供数据

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  <profile-card></profile-card>
</o-provider>
```

规则：

- `name` 用于标识上下文。
- provider 上的非保留属性会作为共享数据提供给 consumer。
- consumer 会优先查找最近的同名 provider。

### 消费数据

```html
<o-consumer
  name="userInfo"
  watch:custom-name="userName"
  watch:custom-age="userAge"
></o-consumer>

<script>
  export default async () => ({
    data: {
      userName: "",
      userAge: 0,
    },
  });
</script>
```

`watch:provider-key="localKey"` 的含义：把 provider 的字段实时同步到当前实例的字段上。

### 根提供者

整个文档共享数据时，使用 `o-root-provider`：

```html
<o-root-provider name="globalConfig" custom-theme="dark"></o-root-provider>
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

规则：

- 若同时存在同名 `o-provider` 和 `o-root-provider`，最近的 `o-provider` 优先。

## 6. 获取 provider

在页面或组件实例上可使用 `getProvider(name)`：

```html
<script>
  export default async () => ({
    proto: {
      updateUserName() {
        const provider = this.getProvider("userInfo");
        provider.customName = "新名字";
      },
    },
  });
</script>
```

也可以：

```javascript
const provider = $(".target").getProvider("userInfo");
const rootProvider = $.getRootProvider("globalConfig");
```

## 7. provider 派发事件

provider 可以给所有 consumer 派发事件：

```html
<o-provider name="chat" id="chatProvider">
  <chat-panel></chat-panel>
</o-provider>

<script>
  $("#chatProvider").dispatch("new-message", {
    data: { text: "Hello World" },
  });
</script>
```

consumer 监听：

```html
<o-consumer name="chat" on:new-message="addMessage"></o-consumer>

<script>
  export default async () => ({
    data: { messages: [] },
    proto: {
      addMessage(event) {
        this.messages.push(event.data.text);
      },
    },
  });
</script>
```

## 8. 样式上下文：`match-var`

`match-var` 适合根据 CSS 变量切换样式，常用于主题场景。

```html
<template component>
  <match-var theme="dark">
    <style>
      :host {
        background: #333;
        color: #fff;
      }
    </style>
  </match-var>
  <slot></slot>
</template>
```

配合 `data()` 设置 CSS 变量：

```html
<template page>
  <style>
    .wrap {
      --theme: data(currentTheme);
    }
  </style>
  <div class="wrap">
    <theme-box></theme-box>
  </div>
  <script>
    export default async () => ({
      data: { currentTheme: "light" },
    });
  </script>
</template>
```

某些 CSS 变量变化若没有被自动检测到，可手动调用：

```javascript
$.checkMatch();
```

## 9. AI 生成代码时的选择顺序

1. 只在当前页面或组件内使用的数据，放 `data`。
2. 多个模块共享同一份对象，使用 `$.stanz()`。
3. 跨层级传递但不想层层绑定时，使用 `o-provider` / `o-consumer`。
4. 纯样式主题传递优先考虑 `match-var`。

## 10. 最佳实践

- 在 `detached` 中清理共享状态引用。
- 避免让大型状态对象无限增长。
- 不要滥用全局状态，优先缩小状态作用域。
- provider 的 `name` 要清晰、稳定、可复用。
- 普通父子数据传递优先用组件属性；只有跨层级时再用上下文状态。
