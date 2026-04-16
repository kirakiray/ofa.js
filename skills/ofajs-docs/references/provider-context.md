# Provider 与上下文状态

本文档详细介绍 ofa.js 中 `o-provider` 和 `o-consumer` 上下文状态传递机制。

## 核心概念

- **o-provider**: 数据提供者，定义需要共享的数据
- **o-consumer**: 数据消费者，从最近的提供者获取数据
- **watch:xxx**: 监听消费者数据的变化，并绑定到组件或页面模块的属性上

## o-provider 提供者

`o-provider` 组件用于定义共享数据的提供者。它通过 `name` 属性标识自己的名称，并通过属性来定义需要共享的数据。

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  <!-- 子组件可以消费这些数据 -->
  <my-component></my-component>
</o-provider>
```

**特性**：
1. **自动属性传递**: provider 上的所有非保留属性都会作为共享数据
2. **响应式更新**: 当 provider 的数据变化时，消费者会自动更新
3. **层级查找**: 消费者会从最近的上级 provider 开始查找对应 name 的数据

## o-consumer 消费者

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

## o-root-provider 根提供者

`o-root-provider` 是根级别的全局提供者，它的作用域是整个文档。即使在没有父级 provider 的情况下，消费者也可以获取到根提供者的数据。

```html
<!-- 定义全局根提供者 -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- 在页面的任何位置都可以消费 -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

**优先级规则**：当同时存在同 name 的 provider 和 root-provider 时，离消费者最近的 provider 优先。

## getProvider(name) 方法

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

## dispatch 事件派发

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

## 使用场景

相比事件冒泡和属性逐层传递，当涉及多层嵌套的数据同步时，使用 `o-provider` 和 `o-consumer` 可大幅提升开发效率。

子组件中使用 `this.getProvider(providerName)` 获取上下文对象，直接修改 `custom-name` 上下文属性即可同步到其他子组件，无需逐层传递（记得修正驼峰命名）。

## 相关文档

- [状态管理完整教程](../llms/origin/state.md)
