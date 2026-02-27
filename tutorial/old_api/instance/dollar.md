# $

`$` 方法 是 `ofa.js` 中的核心函数，用于操作 DOM 元素实例。下面将介绍 `$` 的主要作用：

## 获取元素实例

通过 `$` 方法，你可以获取页面上符合[css选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)的第一个元素实例，并对其进行操作。以下是一个示例：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target1">target 1 text</div>

<script>
  setTimeout(()=>{
    $("#target1").text = 'change target 1';
  },500);
</script>
```

</html-viewer>

在上面的示例中，我们使用 `$` 符号选择了具有 `id` 为 "target1" 的元素实例，并通过设置 `text` 属性来修改其文本内容。

## 查找子元素实例

实例也拥有 `$` 方法，可以通过实例上的 `$` 方法获取元素实例的第一个符合条件的子元素实例。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target1">
  <h3>target</h3>
  <p>I am target1</p>
</div>

<script>
  const tar = $("#target1");
  tar.$('h3').text = 'change target title';
</script>
```

</html-viewer>

## 元素实例特性

请不要将获取的元素实例直接插入到其他地方，这样的操作会导致原来的元素受到影响。如果需要创建一份副本，您可以使用 [clone](./clone.md) 方法。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="pos1" style="border:red solid 1px;">
  <h3>position 1</h3>
  <p id="target1" style="color:green">I am target1</p>
</div>

<div id="pos2" style="border:blue solid 1px;margin:8px;">
  <h3>position 2</h3>
</div>

<script>
  setTimeout(()=>{
    const tar = $("#target1");
    $("#pos2").push(tar);
  },500);
</script>
```

</html-viewer>

## 获取影子节点内的子元素

可以通过 [shadow](./shadow.md) 属性获取实例后，在通过 `$` 方法获取想要的元素；

```javascript
$('my-component').shadow.$("selector").method(xxx)
```
## 直接实例化元素

你可以通过以下方式直接将原生元素初始化为 `$` 实例对象：

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

这样，你可以方便地将现有的 HTML 元素转换为 `$` 实例，以便使用 `$` 提供的功能进行操作和处理。

## 生成元素实例

除了获取现有的元素实例，`$` 还可以用于创建新的元素实例，并将其添加到页面中。

### 通过字符串生成

你可以使用 `$` 函数通过字符串创建新元素实例，如下所示：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target1">
  <b>target1:</b>
</div>

<script>
  const newEl = $(`<div style="color:red">add target 1 text</div>`);
  $('#target1').push(newEl);
</script>
```

</html-viewer>

在这个示例中，我们使用 `$` 函数创建了一个具有指定样式和文本内容的新元素实例，并将其添加到具有 `id` 为 "target1" 的现有元素实例内。

### 通过对象生成

你还可以使用 `$` 函数通过对象的方式生成新元素实例，如下所示：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target1">
  <b>target1:</b>
</div>

<script>
  const newEl = $({
    tag: "div",
    text: "add target 1 text",
    css: {
      color: "red"
    }
  });

  $('#target1').push(newEl);
</script>
```

</html-viewer>

在这个示例中，我们使用 `$` 函数通过对象的方式定义了一个新元素实例，包括标签类型、文本内容和样式属性，并将其添加到具有 `id` 为 "target1" 的现有元素实例内。