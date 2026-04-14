# Switch Component - Complete Example

This is a complete example of building a reusable switch/toggle component with full features.

## Live Demo

Open `demo.html` in a static server to see the component in action:

```bash
# Using any static server, for example:
npx serve .
# Then open http://localhost:3000/demo.html
```

## Source Files

- [demo.html](./demo.html) - Entry point for the demo
- [page.html](./page.html) - Demo page with usage examples
- [switch.html](./switch.html) - The switch component itself

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
