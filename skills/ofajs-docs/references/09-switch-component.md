# Switch Component - Complete Example

This is a complete example of building a reusable switch/toggle component with full features.

## Component File (switch.html)

```html
<template component>
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 22px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .switch.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .switch-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .switch-slider {
      position: absolute;
      cursor: inherit;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 22px;
    }

    .switch-slider::before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .switch.checked .switch-slider {
      background-color: #4caf50;
    }

    .switch.checked .switch-slider::before {
      transform: translateX(22px);
    }

    .switch-label {
      margin-left: 8px;
      vertical-align: middle;
      font-size: 14px;
      color: #333;
    }

    :host(:empty) .label {
      display: none;
    }
  </style>

  <div
    class="switch"
    class:disabled="disabled !== null"
    class:checked="checked"
    on:click="toggle"
  >
    <input
      type="checkbox"
      class="switch-input"
      :checked="checked"
      :disabled="disabled"
    />
    <span class="switch-slider"></span>
  </div>
  <o-if :value="label">
    <span class="switch-label">{{label}}</span>
  </o-if>
  <div class="label">
    <slot></slot>
  </div>

  <script>
    export default async () => {
      return {
        tag: "ofa-switch",
        attrs: {
          disabled: null,
          label: null,
        },
        data: {
          checked: false,
        },
        proto: {
          toggle() {
            if (this.disabled !== null) {
              return;
            }
            this.checked = this.checked ? null : true;
            this.emit("change", {
              data: { checked: this.checked },
              bubbles: true,
              composed: true,
            });
          },
        },
      };
    };
  </script>
</template>
```

## Usage in Page (page.html)

```html
<template page>
  <style>
    :host { display: block; }
    h2 { color: #333; margin-bottom: 20px; }
    .demo-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }
    .demo-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 15px;
    }
  </style>

  <h2>Switch 开关组件演示</h2>

  <!-- 引入组件 -->
  <l-m src="./switch.html"></l-m>

  <!-- 基础用法 -->
  <div class="demo-section">
    <ofa-switch></ofa-switch>
    <ofa-switch :checked="true"></ofa-switch>
  </div>

  <!-- 带标签 -->
  <div class="demo-section">
    <ofa-switch>启用通知</ofa-switch>
    <ofa-switch :checked="true">自动保存</ofa-switch>
  </div>

  <!-- 双向绑定 -->
  <div class="demo-section">
    <ofa-switch sync:checked="switchState"></ofa-switch>
    <span>当前状态: {{switchState ? '开启' : '关闭'}}</span>
  </div>

  <!-- 禁用状态 -->
  <div class="demo-section">
    <ofa-switch disabled></ofa-switch>
    <ofa-switch :checked="true" disabled></ofa-switch>
  </div>

  <!-- 事件监听 -->
  <div class="demo-section">
    <ofa-switch on:change="handleSwitchChange"></ofa-switch>
    <span>点击次数: {{clickCount}}</span>
  </div>

  <script>
    export default async () => {
      return {
        data: {
          switchState: false,
          clickCount: 0,
        },
        proto: {
          handleSwitchChange(e) {
            this.clickCount++;
            console.log("Switch changed:", e.data.checked);
          },
        },
      };
    };
  </script>
</template>
```

## Key Component Patterns

### 1. attrs vs data
- `attrs`:接收外部 HTML 属性（`disabled`, `label`）
- `data`: 内部状态（`checked`）

### 2. Boolean Attributes
```javascript
attrs: {
  disabled: null,  // null = 未设置
},
// 判断：this.disabled !== null 表示已设置
```

### 3. Emit Custom Events
```javascript
this.emit("change", {
  data: { checked: this.checked },
  bubbles: true,
  composed: true,  // 穿透 Shadow DOM
});
```

### 4. Slot Usage
```html
<ofa-switch>启用通知</ofa-switch>
<!-- 插槽内容渲染到 <slot></slot> 位置 -->

<ofa-switch label="xxx"></ofa-switch>
<!-- label 通过 attrs 传递 -->
```

### 5. Two-way Binding
```html
<ofa-switch sync:checked="switchState"></ofa-switch>
<!-- 组件内部 checked 变化会同步到 page 的 switchState -->
```
