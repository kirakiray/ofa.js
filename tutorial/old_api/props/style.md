# style

使用 [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) 属性和原生保持一致；

请注意，`style` 属性无法获取样式的实际值，而只能获取在 `style` 属性上设置的值。尽管 `style` 方法与 [css 方法](./css.md) 类似，但它无法进行全量样式覆盖。相较于 [css](./css.md)，`style` 方法的内部执行效率更高。

下面是一个示例，演示了如何使用 `style`：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target">origin text</div>
<br>
<h4>logger</h4>
<div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>

<script>
    $("#logger").text = $("#target").style.color;
    setTimeout(()=> {
        $('#target').style.color = 'red';
        $("#logger").text = $("#target").style.color;
    }, 1000);
</script>
```

</html-viewer>

请记住，`style` 方法只获取和设置 `style` 属性上的值，而不是实际的计算样式。