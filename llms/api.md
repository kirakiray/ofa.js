# ofa.js API 参考

本文档提供 ofa.js 的完整 API 参考，包括实例方法、节点操作、属性操作、事件处理等。

## 核心函数

### $(selector)

`$` 是 ofa.js 的核心函数，用于获取和操作 DOM 元素实例。

```javascript
// 获取元素
const el = $("#target");

// 查找子元素
const child = el.$("h3");

// 获取影子节点内的元素
$('my-component').shadow.$("selector");

// 直接实例化原生元素
const ele = document.createElement('div');
const $ele = $(ele);

// 通过字符串创建元素
const newEl = $(`<div style="color:red">new element</div>`);

// 通过对象创建元素
const newEl = $({
  tag: "div",
  text: "new element",
  css: { color: "red" }
});
```

### $.all(selector)

获取符合 CSS 选择器的所有元素，返回数组。

```javascript
// 获取所有 li 元素
$.all("li").forEach((item, index) => {
  item.text = `change item ${index}`;
});

// 获取子元素
const tar = $("#target");
tar.all("li").forEach((item) => {
  item.text = "changed";
});
```

## 实例属性

### ele

获取实例的实际 Element 元素，使用原生属性或方法。

```javascript
const ele = $("#target").ele;
ele.innerHTML = '<b>change target</b>';
console.log(ele.clientWidth);
```

### shadow

获取元素的影子根节点实例（Shadow DOM）。

```javascript
// 在组件内部访问
this.shadow.$("#target").text = 'change target';

// 从外部访问组件影子节点
$("test-shadow").shadow.$("#target").text = 'change from outside';
```

### prev / next

获取前一个/后一个相邻元素实例。

```javascript
$("#target").prev.text = "previous element";
$("#target").next.text = "next element";
```

### prevs / nexts

获取前面/后面所有相邻元素实例，返回数组。

```javascript
$("#target").prevs.forEach(el => el.css.color = 'red');
$("#target").nexts.forEach(el => el.css.color = 'blue');
```

### parent

获取父元素实例。

```javascript
$("#target").parent.css.color = 'blue';
```

### parents

获取所有父元素实例，返回数组。

```javascript
$("#target").parents.forEach(el => console.log(el.tag));
```

### siblings

获取所有相邻元素实例（不包括自身），返回数组。

```javascript
$("#target").siblings.forEach(e => e.text = 'change text');
```

### children / length

将实例当作数组，通过数字索引获取子元素实例。

```javascript
// 获取子元素数量
const count = $('ul').length;

// 通过索引获取子元素
const secondChild = $('ul')[1];
```

### root

获取元素的根节点。

```javascript
// 普通元素的根节点是 document
console.log($("#target").root.ele === document); // true

// 影子节点内的元素，root 是影子根节点
console.log(this.shadow.$("#target").root === this.shadow);
```

### host

获取元素的宿主组件实例。如果元素不在组件或页面模块内，返回 `null`。

```javascript
// 在组件内部访问宿主
this.response = this.host.sayHi();

// 检查是否有宿主
console.log($("#target").host); // null 或宿主实例
```

### app

在 `o-app` 内的元素，其 `app` 属性指向 `o-app` 元素实例。

```javascript
// 在页面或组件内访问
this.val = this.app.getSomeData();
```

### tag

获取元素的标签名（小写字符串）。

```javascript
console.log($("#target").tag); // "div"
```

### index

获取元素在其父元素下的位置（从0开始）。

```javascript
console.log($("#target").index); // 1
```

### PATH

获取组件或页面的文件地址。

```javascript
const componentPath = $("#myComponent").PATH;
```

## 节点操作

### push / unshift / pop / shift / splice

数组-like 方法，用于添加或删除子元素。

```javascript
// 末尾添加
$("ul").push(`<li style="color:red;">new li</li>`);

// 开头添加
$("ul").unshift(`<li style="color:blue;">new li</li>`);

// 末尾删除
$("ul").pop();

// 开头删除
$("ul").shift();

// 删除/替换/添加
$("ul").splice(1, 2, `<li>new 1</li>`, `<li>new 2</li>`);
```

**注意：在具有模板语法的元素上不要添加或删除子元素。**

### before / after

在目标元素的前面/后面添加元素。

```javascript
$("#target").before(`<li style="color:red;">new li</li>`);
$("#target").after(`<li style="color:red;">new li</li>`);
```

**注意：不要在 o-fill 或 o-if 等模板组件内操作。**

### remove

删除目标节点。

```javascript
$("#target").remove();
```

### wrap / unwrap

包裹/移除包裹元素。

```javascript
// 包裹元素（目标必须有父节点）
$("#target").wrap(`<div style="border-color:red;">wrap</div>`);

// 移除包裹（目标必须有父节点，且不能有其他兄弟元素）
$("#target").unwrap();
```

### clone

克隆元素实例。

```javascript
const tar = $('#target').clone();
$('#logger').push(tar);
```

## 属性操作

### text

获取或设置元素的文本内容。

```javascript
// 获取
console.log($("#target").text);

// 设置
$("#target").text = "new text";

// 模板语法
<span :text="txt"></span>
```

### html

获取或设置元素的 HTML 内容。

```javascript
// 获取
console.log($("#target").html);

// 设置（注意 XSS 风险）
$("#target").html = `<b style="color:blue;">new text</b>`;

// 模板语法
<span :html="htmlContent"></span>
```

### attr

获取或设置元素的 attributes。

```javascript
// 获取
console.log($("#target").attr('test-attr'));

// 设置
$("#target").attr('test-attr', '2');

// 模板语法
<div attr:test-attr="txt"></div>
```

### css

获取或设置元素的样式（计算样式）。

```javascript
// 获取
console.log($("#target").css.color);

// 设置单个属性
$('#target').css.color = 'red';

// 全量设置
$("#target").css = { color: "blue", lineHeight: "5em" };

// 合并设置
myElement.css = { ...myElement.css, color: 'red' };

// 模板语法
<div :css.color="txt"></div>
```

### style

获取或设置元素的 style 属性（仅获取在 style 属性上设置的值）。

```javascript
// 获取
console.log($("#target").style.color);

// 设置
$('#target').style.color = 'red';

// 模板语法
<div :style.color="txt"></div>
```

### classList

操作元素的类名（与原生 classList 一致）。

```javascript
$("#target").classList.remove('t-red');
$("#target").classList.add('t-blue');
$("#target").classList.toggle('active');
```

### data

获取元素的 dataset（与原生 dataset 一致）。

```javascript
// 获取
console.log($("#target").data.one);

// 设置
$('#target').data.red = "1";
```

## 事件相关

### on(event, handler)

注册事件处理程序。

```javascript
$("#target").on("click", (event) => {
  console.log(event.type);
});

// 模板语法
<button on:click="addCount">Add Count</button>
```

### one(event, handler)

注册一次性事件处理程序（触发后自动解除绑定）。

```javascript
$("#target").one("click", () => {
  console.log("只会触发一次");
});

// 模板语法
<button one:click="addCount">Add Count</button>
```

### emit(event, options)

触发自定义事件。

```javascript
$("#target").emit("custom-event", {
  data: "I am data",        // 自定义数据
  bubbles: true,             // 是否冒泡（默认 true）
  composed: false,           // 是否穿透 Shadow DOM（默认 false）
});
```

### off(event, handler)

注销已注册的事件处理程序。

```javascript
const handler = () => console.log("clicked");
$("#target").on("click", handler);
$("#target").off("click", handler);
```

## o-app 组件

`o-app` 是 ofa.js 的核心组件，用于配置和管理整个应用程序。

```javascript
const app = $("o-app");

// 属性
console.log(app.src);           // 应用配置模块地址
console.log(app.current);       // 当前页面实例
console.log(app.routers);       // 路由配置信息

// 方法
app.goto("/page2.html");        // 跳转到指定页面
app.replace("/new-page.html");  // 替换当前页面
app.back();                     // 返回上一页
```

## o-page 组件

`o-page` 代表一个独立的页面或页面模块。

```javascript
const page = this; // 在页面模块内

// 属性
console.log(page.src);          // 页面模块地址

// 方法
page.goto("./page2.html");      // 跳转（支持相对地址）
page.replace("./new-page.html");// 替换当前页面
page.back();                    // 返回上一页
```

## 表单相关

### formData(selector)

生成与表单元素绑定的对象数据，实现双向数据绑定。

```javascript
// 绑定所有表单元素
const data = $("#myForm").formData();

// 监听变化
data.watch(() => {
  console.log(data);
});

// 反向绑定（修改数据会更新表单）
data.username = "Yao";
data.sex = "man";

// 只监听特定表单元素
const data = $("#myForm").formData(".use-it");

// 在组件内使用
attached(){
  this.fdata = this.shadow.formData();
}
```

## 实例数据特征（Stanz）

通过 `$` 获取的实例对象拥有完整的 stanz 数据特性。

### watch(callback)

监听值的变动（深度监听）。

```javascript
const target = $("#target");
target.watch(() => {
  console.log("数据发生变化");
});

target.aaa = "I am aaa";
target.bbb = { child: { val: "value" } };
target.bbb.child.val = "change val"; // 也能监听到
```

### watchTick(callback)

监听值的变动（带节流，单个线程下执行一次）。

```javascript
target.watchTick(() => {
  console.log("数据发生变化（节流）");
});
```

### unwatch(tid)

取消监听。

```javascript
const tid = target.watch(() => {});
target.unwatch(tid);
```

### 非响应式数据

使用下划线 `_` 开头的属性名不会被监听。

```javascript
target._aaa = "I am aaa"; // 不会触发 watch
```

### $.stanz(data)

创建独立的 Stanz 数据对象。

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

## 扩展

### extend(obj)

扩展实例的属性或方法。

```javascript
// 扩展单个实例
const target = $("#target");
target.extend({
  get good() { return "ofa.js is good"; },
  say() { return 'hello'; }
});

// 扩展底层（所有实例）
$.fn.extend({
  get good() { return "ofa.js is good"; },
  say() { return 'hello'; }
});

// 扩展模板语法属性
$.fn.extend({
  set red(bool) {
    this.css.color = bool ? "red" : '';
  }
});
// 使用: <div :red="count % 3">text</div>

// 扩展模板语法方法
$.fn.extend({
  color(color, func, options) {
    this.css.color = func() ? color : '';
  }
});
$.fn.color.always = true;
// 使用: <div color:red="!(count % 3)">text</div>
```

## 其他方法

### is(selector)

检测元素是否符合表达式。

```javascript
console.log(target.is('li'));      // true/false
console.log(target.is('div'));     // true/false
console.log(target.is('[id]'));    // true/false
console.log(target.is('[class]')); // true/false
```

### refresh()

主动刷新组件的渲染视图（适用于非响应式数据）。

```javascript
// 在组件内
this.refresh();
```

### version

获取 ofa.js 版本号。

```javascript
console.log(ofa.version); // "4.3.40"
```
