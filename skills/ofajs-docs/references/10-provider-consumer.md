# Provider and Consumer - Context State

This document covers `o-provider`, `o-consumer`, and context state management in ofa.js.

## Core Concepts

- **o-provider**: Data provider that defines shared data
- **o-consumer**: Data consumer that receives data from the nearest parent provider
- **watch:xxx**: Bind consumer data to component/page properties

## Basic Provider-Consumer Pattern

### Provider

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  <my-component></my-component>
</o-provider>
```

All non-reserved attributes on `o-provider` become shared data.

### Consumer

```html
<o-consumer name="userInfo" watch:custom-name="userName" watch:custom-age="userAge"></o-consumer>

<script>
export default async () => {
  return {
    data: { userName: "", userAge: 0 },
  };
};
</script>
```

## Root Provider (Global)

`o-root-provider` provides data globally across the entire document:

```html
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Any consumer can access it -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

Priority: Nearest provider with matching name takes precedence.

## Complete Example

### data.js - Shared State Store
```javascript
export const userStore = $.stanz({
  name: "张三",
  level: "vip",
});
```

### parent.html - Provider Setup
```html
<template page>
  <style>:host { display: block; }</style>

  <o-provider name="userStore" :custom-name="userStore.name" :custom-level="userStore.level">
    <user-card></user-card>
    <user-stats></user-stats>
  </o-provider>

  <script>
    export default async ({ load }) => {
      const { userStore } = await load("./data.js");
      return {
        data: { userStore },
      };
    };
  </script>
</template>
```

### user-card.html - Consumer Component
```html
<template component>
  <div class="card">
    <h3>{{userName}}</h3>
    <p>Level: {{userLevel}}</p>
  </div>

  <o-consumer name="userStore" watch:custom-name="userName" watch:custom-level="userLevel"></o-consumer>

  <script>
    export default async () => ({
      tag: "user-card",
      data: { userName: "", userLevel: "" },
    });
  </script>
</template>
```

### user-stats.html - Another Consumer
```html
<template component>
  <div class="stats">
    <span>User: {{userName}}</span>
    <span>Level: {{userLevel}}</span>
  </div>

  <o-consumer name="userStore" watch:custom-name="userName" watch:custom-level="userLevel"></o-consumer>

  <script>
    export default async () => ({
      tag: "user-stats",
      data: { userName: "", userLevel: "" },
    });
  </script>
</template>
```

## getProvider(name) Method

Get provider element programmatically:

```javascript
// From component/page
const provider = this.getProvider("userInfo");

// From any element
const provider = $(".my-element").getProvider("userInfo");

// Change provider data
provider.customName = "New Name";
```

## Dispatch Events to Consumers

Provider can dispatch events to all its consumers:

```html
<o-provider name="chat" id="chatProvider" custom-messages='["欢迎"]'>
  <chat-list></chat-list>
</o-provider>
```

```javascript
// Dispatch event
$("#chatProvider").dispatch("new-message", {
  data: { text: "Hello!" }
});
```

```html
<!-- Consumer listens -->
<o-consumer name="chat" on:new-message="handleMessage"></o-consumer>

<script>
export default async () => ({
  proto: {
    handleMessage(event) {
      console.log(event.data.text);
    },
  },
});
</script>
```

## Styling with match-var

For CSS variable-based theming:

```html
<template component>
  <match-var theme="dark">
    <style>
      :host { background-color: #333; color: white; }
    </style>
  </match-var>
  <slot></slot>
</template>
```

```html
<!-- Usage -->
<theme-box theme="dark"></theme-box>
```

## Best Practices

1. **Clean up in detached**: Clear state references when component is destroyed
2. **Meaningful names**: Use descriptive names for providers (e.g., "userInfo" not "data")
3. **Appropriate scope**: Use Provider/Consumer for cross-component sharing; use `sync:` for direct parent-child
4. **Root provider for globals**: Theme, language, auth status suitable for `o-root-provider`
5. **Avoid overusing**: For simple parent-child props, prefer `sync:` and `attrs`

## Key Differences

| Feature | Provider/Consumer | $.stanz |
|---------|-------------------|---------|
| Use case | Context/ancestor data passing | Global/shared state |
| Setup | Declarative in template | Import and reference |
| Cleanup | Automatic | Manual in detached |
| Best for | Themes, settings, configs | Lists, user data, carts |
