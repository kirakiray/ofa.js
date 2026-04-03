# ofa.js 状态管理教程

本教程介绍 ofa.js 中的状态管理机制，包括响应式数据、状态共享和上下文状态传递。

## 响应式数据基础

### data 对象

在 ofa.js 中，每个页面或组件都有一个 `data` 对象，用于定义需要在视图中使用的变量。当数据变化时，视图会自动更新。

```html
<template page>
  <p>{{message}}</p>
  <button on:click="updateMessage">更新消息</button>
  <script>
    export default async () => {
      return {
        data: {
          message: "Hello World",
        },
        proto: {
          updateMessage() {
            this.message = "Hello ofa.js";
          }
        }
      };
    };
  </script>
</template>
```

### 属性响应

ofa.js 不仅支持对基本属性值的响应，还支持对多层嵌套对象内部属性值的响应式渲染。

```html
<template page>
  <p>count: {{count}}</p>
  <p>obj.count2: {{obj.count2}}</p>
  <button on:click="handleAddCount">增加</button>
  <script>
    export default async () => {
      return {
        data: {
          count: 20,
          obj: {
            count2: 100,
          },
        },
        proto:{
          handleAddCount(){
            this.count++;
            this.obj.count2++;
          }
        },
      };
    };
  </script>
</template>
```

### 非响应式数据

有时我们需要存储一些不需要响应式更新的数据，例如 Promise 实例、正则表达式对象或其他复杂对象。非响应式属性的命名通常在属性名前添加下划线 `_` 作为前缀。

```html
<script>
  export default async () => {
    return {
      data: {
        count: 20,        // 响应式
        _count2: 100,     // 非响应式，变化不会触发视图更新
      }
    };
  };
</script>
```

非响应式的对象数据性能会比响应式的对象数据性能更好，因为非响应式数据不会触发组件的重新渲染。

## 状态管理

### 什么是状态

在 ofa.js 中，**状态**是指组件或页面模块自身的 `data` 属性。这个状态只能在当前组件上使用，用于存储和管理该组件的内部数据。

当有多个组件或页面需要共享同一份数据时，传统的做法是通过事件传递或 props 层层传递，这种方式在复杂应用中会导致代码难以维护。因此需要**状态管理**——通过定义一个共享的状态对象，让多个组件或页面模块都可以访问和修改这份数据，从而实现状态的共享。

### 生成状态对象

通过 `$.stanz({})` 来创建一个响应式的状态对象。这个方法接收一个普通对象作为初始数据，返回一个响应式的状态代理。

```javascript
// data.js
export const contacts = $.stanz({
  list: [{
    id: 10010,
    name: "皮特",
    info: "每一天都是新的开始",
  },{
    id: 10020,
    name: "迈克",
    info: "生活就像海洋",
  }]
});
```

### 状态对象的特性

#### 1. 响应式更新

`$.stanz()` 创建的状态对象是响应式的。当状态数据发生变化时，所有引用该数据的组件都会自动更新。

```javascript
const store = $.stanz({ count: 0 });

// 在组件中
export default async () => {
  return {
    data: { store: {} },
    proto:{
      increment() {
        store.count++; // 所有引用了 store.count 的组件都会自动更新
      }
    },
    attached() {
      this.store = store;
    },
    detached(){
      this.store = {}; // 组件销毁时，清空挂载的状态数据
    }
  };
};
```

#### 2. 深度响应式

状态对象支持深度响应式，嵌套对象和数组的变化也会被监听。

```javascript
const store = $.stanz({
  user: {
    name: "张三",
    settings: { theme: "dark" }
  },
  list: []
});

// 修改嵌套属性也会触发更新
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新任务" });
```

### 在组件中使用状态

推荐在组件的 `attached` 生命周期中挂载共享状态：

```html
<script>
  export default async ({ load }) => {
    const { contacts } = await load("./data.js");
    return {
      data: { list: [] },
      attached() {
        // 将共享状态挂载到组件的 data 上
        this.list = contacts.list;
      },
      detached() {
        // 组件销毁时，清空挂载的状态数据，防止内存泄漏
        this.list = [];
      }
    };
  };
</script>
```

### 合理管理状态作用域

- **全局状态**：适用于整个应用都需要访问的数据（如用户信息、全局配置）
- **模块状态**：适用于特定功能模块内部共享的数据

```javascript
// 全局调用状态
export const globalStore = $.stanz({ user: null, theme: "light" });

// 模块内使用的状态
const cartStore = $.stanz({ total: 0 });
```

## 上下文状态

上下文状态是 ofa.js 中用于跨组件数据共享的机制。通过提供者（Provider）和消费者（Consumer）模式，可以实现父子组件、跨层级组件之间的数据传递，而无需通过 props 层层传递。

### 核心概念

- **o-provider**: 数据提供者，定义需要共享的数据
- **o-consumer**: 数据消费者，从最近的提供者获取数据
- **watch:xxx**: 监听消费者数据的变化，并绑定到组件或页面模块的属性上

### o-provider 提供者

`o-provider` 组件用于定义共享数据的提供者。它通过 `name` 属性标识自己的名称，并通过属性来定义需要共享的数据。

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  <!-- 子组件可以消费这些数据 -->
  <my-component></my-component>
</o-provider>
```

特性：
1. **自动属性传递**: provider 上的所有非保留属性都会作为共享数据
2. **响应式更新**: 当 provider 的数据变化时，消费者会自动更新
3. **层级查找**: 消费者会从最近的上级 provider 开始查找对应 name 的数据

### o-consumer 消费者

`o-consumer` 组件用于消费（使用）提供者的数据。它通过 `name` 属性指定要消费的提供者名称。

```html
<o-consumer name="userInfo" watch:custom-name="userName" watch:custom-age="userAge"></o-consumer>

<script>
export default async () => {
  return {
    data:{
      userName: "",
      userAge: 0,
    },
  };
};
</script>
```

### o-root-provider 根提供者

`o-root-provider` 是根级别的全局提供者，它的作用域是整个文档。即使在没有父级 provider 的情况下，消费者也可以获取到根提供者的数据。

```html
<!-- 定义全局根提供者 -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- 在页面的任何位置都可以消费 -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

优先级规则：当同时存在同 name 的 provider 和 root-provider 时，离消费者最近的 provider 优先。

### getProvider(name) 方法

`getProvider(name)` 是一个实例方法，用于获取对应 name 的提供者元素。

```html
<script>
export default async () => {
  return {
    proto:{
      changeValue(){
        const provider = this.getProvider("userInfo");
        provider.customName = "new value";
      }
    }
  };
};
</script>
```

也可以通过元素上获取 provider：

```javascript
// 获取当前元素上级的 provider
const provider = $(".my-element").getProvider("userInfo");

// 直接获取全局 root-provider
const globalProvider = $.getRootProvider("globalConfig");
```

### dispatch 事件派发

provider 可以派发事件给所有消费它的 consumer：

```html
<o-provider name="chat" id="chatProvider" custom-messages='["欢迎来到聊天室"]'>
  <chat-list></chat-list>
</o-provider>

<script>
// 派发事件
$("#chatProvider").dispatch("new-message", {
  data: { text: "Hello World" }
});
</script>
```

消费者监听事件：

```html
<o-consumer name="chat" on:new-message="addMessage"></o-consumer>

<script>
export default async () => {
  return {
    data: { messages: [] },
    proto: {
      addMessage(event) {
        this.messages.push(event.data.text);
      }
    }
  };
};
</script>
```

## 样式查询（match-var）

`match-var` 是 ofa.js 中用于根据 CSS 变量进行样式匹配的功能组件。这种特性专门用于样式相关的上下文状态传递，不需要使用 JavaScript，适合主题色等样式传递需求。

### 基本用法

`match-var` 组件通过属性来定义需要匹配的 CSS 变量和期望值。当组件的 CSS 变量值与指定的属性值匹配时，内部定义的样式就会被应用。

```html
<template component>
  <match-var theme="dark">
    <style>
      :host {
        background-color: #333;
        color: white;
      }
    </style>
  </match-var>
  <slot></slot>
</template>
```

### 多条件匹配

可以同时使用多个属性来定义更复杂的匹配条件：

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

### 使用 data() 绑定 CSS 变量

结合 `data()` 指令可以实现响应式的样式切换：

```html
<template page>
  <style>
    .container {
      --theme: data(currentTheme);
    }
  </style>
  <button on:click="changeTheme">切换主题</button>
  <div class="container">
    <theme-box></theme-box>
  </div>
  <script>
    export default async () => {
      return {
        data: { currentTheme: "light" },
        proto:{
          changeTheme(){
            this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
          }
        }
      };
    };
  </script>
</template>
```

### checkMatch 手动刷新

在某些情况下，CSS 变量的变化可能无法被自动检测到，这时可以手动调用 `$.checkMatch()` 方法来触发样式检测。

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // 手动触发样式检测
    $.checkMatch();
  }
}
```

## 最佳实践

1. **状态清理**：在组件的 `detached` 生命周期中，及时清理对状态数据的引用，避免内存泄漏。

2. **避免循环依赖**：状态对象之间不要形成循环引用，这可能导致响应式系统出现问题。

3. **大型数据结构**：对于大型数据结构，考虑使用计算属性或分片管理，避免不必要的性能开销。

4. **合理命名**：为 provider 和 consumer 使用有意义的 name，便于追踪和维护。

5. **避免过度使用**：上下文状态适用于跨组件共享数据，普通父子组件建议使用 props。

6. **根提供者用于全局配置**：主题、语言、全局状态等适合使用 root-provider。
