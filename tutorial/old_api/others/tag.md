# tag

`tag` 属性用于获取元素的标签，返回一个小写字符串。

在下面的示例中，我们演示了如何使用 `tag` 方法来获取一个元素的标签：

<html-viewer>

```html
<!-- 引入 ofa.js 到你的项目 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<div id="logger">logger</div>
<script>
  setTimeout(() => {
    $("#logger").text = $("#logger").tag;
  }, 500);
</script>
```

</html-viewer>