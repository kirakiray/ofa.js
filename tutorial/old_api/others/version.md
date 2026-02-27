# version

通过 `ofa.version` 属性，你可以获取当前引入的 ofa.js 的版本号。

> **要求 ofa.js 版本 ≥ 4.3.40**

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="logger"></div>
<script>
    $("#logger").html = ofa.version;
</script>
```

</html-viewer>

这样，你就可以在页面上显示当前使用的 ofa.js 版本。