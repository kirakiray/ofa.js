# match-var 样式查询

`match-var` 适合根据 CSS 变量切换样式，常用于主题场景。

## 基本用法

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
  <match-var theme="light">
    <style>
      :host {
        background: #fff;
        color: #333;
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
  <button onclick="changeTheme">切换主题</button>
  <div class="wrap">
    <theme-box></theme-box>
  </div>
  <script>
    export default async () => ({
      data: { currentTheme: "light" },
      proto:{
        changeTheme(value){
          if(value && typeof value === "string"){
            this.currentTheme = value;
            return;
          }
          this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        }
      }
    });
  </script>
</template>
```

## 手动触发检测

Firefox 浏览器在某些情况下可能无法自动检测到 CSS 变量的变化，此时可手动调用以下方法触发样式更新：

## 使用建议

- 纯样式主题传递优先考虑 `match-var`
- 配合 CSS 变量实现动态主题切换