# ofa.js API 速查

本文档面向 AI 生成代码场景，只保留高频 API、常见写法和关键限制。

## 1. 选择元素

### `$()`

```javascript
const el = $("#target");
const child = el.$(".item");
const fromShadow = $("my-comp").shadow.$(".item");
const newEl = $("<div>hello</div>");
const objEl = $({ tag: "div", text: "hello" });
```

用途：

- 获取元素
- 在当前实例内继续查询子元素
- 包装原生元素
- 通过 HTML 字符串或对象创建元素

### `$.all()` / `all()`

```javascript
$.all("li").forEach((item) => {
  item.text = "changed";
});

$("#list").all("li").forEach((item) => {
  item.css.color = "red";
});
```

## 2. 常用实例属性

| 属性 | 作用 |
| --- | --- |
| `ele` | 原生 DOM 元素 |
| `shadow` | Shadow Root 实例 |
| `prev` / `next` | 前一个 / 后一个兄弟元素 |
| `prevs` / `nexts` | 前面 / 后面所有兄弟元素 |
| `parent` | 父元素 |
| `parents` | 所有祖先元素 |
| `siblings` | 所有兄弟元素 |
| `children` / `length` | 子元素集合 / 数量 |
| `root` | 根节点，可能是 `document` 或 `shadow root` |
| `host` | 所在宿主页面或组件 |
| `app` | 当前所属的 `o-app` |
| `tag` | 当前标签名，小写字符串 |
| `index` | 当前元素在父元素中的索引 |
| `PATH` | 当前页面或组件的文件路径 |

例子：

```javascript
console.log($("#target").tag);
console.log($("#target").parent);
console.log(this.shadow.$("#target").root);
console.log($("#target").host);
```

## 3. 节点操作

### 插入和删除子节点

```javascript
$("ul").push("<li>new</li>");
$("ul").unshift("<li>first</li>");
$("ul").pop();
$("ul").shift();
$("ul").splice(1, 1, "<li>replace</li>");
```

### 在目标前后插入

```javascript
$("#target").before("<div>before</div>");
$("#target").after("<div>after</div>");
```

### 其他操作

```javascript
$("#target").remove();
$("#target").wrap("<div class='wrap'></div>");
$("#target").unwrap();
const cloned = $("#target").clone();
```

关键限制：

- 不要在 `o-fill`、`o-if` 或其他模板控制区域内直接改子节点结构。
- `wrap()` / `unwrap()` 依赖父子结构，调用前要确认节点关系正确。

## 4. 文本、HTML、属性、样式

```javascript
$("#target").text = "new text";
$("#target").html = "<b>hello</b>";
$("#target").attr("title", "tip");
$("#target").css.color = "red";
$("#target").style.color = "blue";
$("#target").classList.add("active");
$("#target").data.role = "admin";
```

区别：

- `text`：纯文本。
- `html`：HTML 字符串，注意 XSS 风险。
- `attr()`：操作 HTML attribute。
- `css`：计算样式和样式赋值。
- `style`：只针对 `style` 属性本身。
- `classList`：与原生一致。
- `data`：对应 `dataset`。

模板对应写法：

```html
<span :text="txt"></span>
<span :html="htmlContent"></span>
<div attr:title="tip"></div>
<div :style.color="color"></div>
```

## 5. 事件

### 绑定与解绑

```javascript
const handler = (event) => console.log(event.type);
$("#target").on("click", handler);
$("#target").one("click", () => console.log("once"));
$("#target").off("click", handler);
```

模板事件：

```html
<button on:click="add"></button>
<button one:click="initOnce"></button>
```

### 自定义事件

```javascript
$("#target").emit("custom-event", {
  data: { value: 1 },
  bubbles: true,
  composed: false,
});
```

规则：

- 自定义数据放在 `data` 字段。
- 监听方从 `event.data` 读取。
- 组件对外通信优先用 `emit()`，不要手写不统一的事件对象结构。

## 6. `o-app` 与 `o-page`

### `o-app`

```javascript
const app = $("o-app");
console.log(app.src);
console.log(app.current);
console.log(app.routers);
app.goto("/page2.html");
app.replace("/new-page.html");
app.back();
```

### `o-page`

```javascript
const page = this;
console.log(page.src);
page.goto("./page2.html");
page.replace("./new-page.html");
page.back();
```

## 7. 表单数据

`formData()` 会生成与表单同步的数据对象：

```javascript
const formState = $("#myForm").formData();
formState.watch(() => {
  console.log(formState.username);
});
formState.username = "Yao";
```

在组件中常见写法：

```javascript
attached() {
  this.fdata = this.shadow.formData();
}
```

## 8. Stanz 数据能力

`ofa.js` 实例本身和 `$.stanz()` 创建的数据都支持 Stanz 能力。

### 监听

```javascript
const target = $("#target");
const tid = target.watch(() => {
  console.log("changed");
});
target.watchTick(() => {
  console.log("changed once per tick");
});
target.unwatch(tid);
```

### 非响应式字段

```javascript
target._cache = { done: true };
```

### 创建独立响应式对象

```javascript
const store = $.stanz({ count: 0 });
store.watch(() => {
  console.log(store.count);
});
store.count++;
```

## 9. 扩展实例能力

```javascript
const target = $("#target");
target.extend({
  say() {
    return "hello";
  },
});

$.fn.extend({
  say() {
    return "hello";
  },
});
```

也可以扩展模板指令：

```javascript
$.fn.extend({
  set red(bool) {
    this.css.color = bool ? "red" : "";
  },
});
```

模板里可写：

```html
<div :red="count % 2">text</div>
```

## 10. 其他常用方法

```javascript
$("#target").is("li");
this.refresh();
console.log(ofa.version);
```

含义：

- `is(selector)`：判断是否匹配选择器。
- `refresh()`：手动刷新视图，常用于非响应式数据。
- `version`：当前 `ofa.js` 版本号。

## 11. AI 生成代码时的 API 选择建议

1. 能用模板绑定解决，就不要先写 DOM API。
2. 在组件或页面内部查询元素，优先使用 `this.shadow.$()`。
3. 共享状态优先用 `$.stanz()`，不要手动做复杂同步。
4. 对外事件统一用 `emit()`，数据统一放 `event.data`。
