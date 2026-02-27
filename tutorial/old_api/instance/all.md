# all

使用 `all` 方法，你可以获取页面上符合 [CSS 选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) 的所有元素，并返回一个数组包含这些元素。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
        $.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
        });
    },500);
</script>
```

</html-viewer>

## 获取子元素

实例也拥有 `all` 方法，可以通过实例上的 `all` 方法选择并获取子元素。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target1">
  <ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
  </ul>
</div>

<script>
  const tar = $("#target1");
  tar.all("li").forEach((item,index)=>{
    item.text = `change item ${index}`;
  });
</script>
```

</html-viewer>