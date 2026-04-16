# ofa.js API 参考

本文档提供 ofa.js 的完整 API 参考。

## 1. 核心函数

### `$()`

```javascript
$("#target");
el.$("h3");
$('my-component').shadow.$("selector");
$(ele);
$("<div>hello</div>");
$({ tag: "div", text: "hello", css: { color: "red" } });
```

### `$.all()`

```javascript
$.all("li").forEach((item, index) => {
  item.text = `change item ${index}`;
});
$("#target").all("li");
```

## 2. 实例属性

### `ele` - 原生 DOM 元素

```javascript
$("#target").ele.innerHTML = '<b>change</b>';
```

### `tag` - 标签名

```javascript
$("#target").tag;
```

### `shadow` - Shadow DOM

```javascript
this.shadow.$("#target").text = 'change';
$("test-shadow").shadow.$("#target").text = 'change';
```

### `root` - 根节点

```javascript
$("#target").root.ele === document;
this.shadow.$("#target").root === this.shadow;
```

### `host` - 宿主组件

```javascript
this.host.sayHi();
$("#target").host;
```

### `hosts` - 所有宿主链

```javascript
$("#target").hosts;
```

### `parent` - 父元素

```javascript
$("#target").parent.css.color = 'blue';
```

### `parents` - 所有祖先元素

```javascript
$("#target").parents.forEach(el => console.log(el.tag));
```

### `parentsUntil(expr)` - 祖先元素直到条件

```javascript
$("#target").parentsUntil(".stop-container");
```

### `next` - 后一个兄弟

```javascript
$("#target").next.text = "next";
```

### `nexts` - 后面所有兄弟

```javascript
$("#target").nexts.forEach(el => el.css.color = 'blue');
```

### `prev` - 前一个兄弟

```javascript
$("#target").prev.text = "prev";
```

### `prevs` - 前面所有兄弟

```javascript
$("#target").prevs.forEach(el => el.css.color = 'red');
```

### `siblings` - 所有兄弟

```javascript
$("#target").siblings.forEach(e => e.text = 'change');
```

### `index` - 在父元素中的索引

```javascript
$("#target").index;
```

### `length` / `children` - 子元素数量

```javascript
$('ul').length;
$('ul')[1];
```

## 3. 节点操作

### `push` / `unshift` / `pop` / `shift` / `splice`

```javascript
$("ul").push("<li>new</li>");
$("ul").unshift("<li>first</li>");
$("ul").pop();
$("ul").shift();
$("ul").splice(1, 1, "<li>replace</li>");
```

### `before` / `after`

```javascript
$("#target").before("<div>before</div>");
$("#target").after("<div>after</div>");
```

### `remove`

```javascript
$("#target").remove();
```

### `wrap` / `unwrap`

```javascript
$("#target").wrap("<div class='wrap'></div>");
$("#target").unwrap();
```

### `clone(bool)`

```javascript
$("#target").clone();
```

### `is(expr)` - 检测选择器匹配

```javascript
$("#target").is('li');
$("#target").is('[class]');
```

### `contains(expr)` - 检测包含

```javascript
$("#target").contains('.child');
$("#target").contains(childEl);
```

### `composedPath()` - 组合路径

```javascript
$("#target").composedPath();
```

## 4. 文本、HTML、属性、样式

### `text`

```javascript
$("#target").text;
$("#target").text = "new text";
```

### `html`

```javascript
$("#target").html;
$("#target").html = "<b>hello</b>";
```

### `attr(name)` / `attr(name, val)`

```javascript
$("#target").attr('title');
$("#target").attr('title', 'tip');
```

### `css` - 计算样式

```javascript
$("#target").css.color;
$('#target').css.color = 'red';
$("#target").css = { color: "blue", lineHeight: "5em" };
```

### `style` - style 属性

```javascript
$("#target").style.color;
$('#target').style.color = 'red';
```

### `classList`

```javascript
$("#target").classList.add('active');
$("#target").classList.remove('t-red');
$("#target").classList.toggle('active');
```

### `data` - dataset

```javascript
$("#target").data.red;
$('#target').data.red = "1";
```

## 5. 事件

### `on(event, handler)`

```javascript
$("#target").on("click", handler);
```

### `one(event, handler)` - 一次性

```javascript
$("#target").one("click", () => console.log("once"));
```

### `emit(event, options)`

```javascript
$("#target").emit("custom", {
  data: { value: 1 },
  bubbles: true,
  composed: false,
});
```

### `off(event, handler)`

```javascript
$("#target").off("click", handler);
```

## 6. o-app / o-page

### o-app

```javascript
$("o-app").src;
$("o-app").current;
$("o-app").routers;
$("o-app").goto("/page2.html");
$("o-app").replace("/new-page.html");
$("o-app").back();
```

### o-page

```javascript
this.goto("./page2.html");
this.replace("./new-page.html");
this.back();
```

## 7. 表单

### `formData()`

```javascript
const formState = $("#myForm").formData();
formState.watch(() => console.log(formState.username));
formState.username = "Yao";
```

## 8. 响应式数据

### `$.stanz()`

```javascript
const store = $.stanz({ count: 0 });
store.watch(() => console.log(store.count));
store.count++;
```

### `watch` / `watchTick` / `unwatch`

```javascript
const tid = target.watch(() => {});
target.watchTick(() => {});
target.unwatch(tid);
```

### 非响应式 - `_` 前缀

```javascript
target._cache = { done: true };
```

## 9. 扩展

### `extend()`

```javascript
$("#target").extend({
  say() { return "hello"; },
});

$.fn.extend({
  get good() { return "good"; },
  say() { return 'hello'; }
});
```

## 10. 其他

### `refresh()`

```javascript
this.refresh();
```

### `version`

```javascript
ofa.version;
```
