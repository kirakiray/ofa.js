# ele

通过 `ele` 属性，你可以获取实例的实际元素，从而使用原生的属性或方法。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li id="target">I am target</li>
</ul>
<div id="logger" style="color:red;"></div>

<script>
    setTimeout(()=>{
       var ele = $("#target").ele;
       ele.innerHTML = '<b>change target</b>';
       $("#logger").text = ele.tagName;
    },500);
</script>
```

</html-viewer>

在上面的示例中，我们使用 `ele` 属性获取了一个元素，并修改了其内部的 HTML 内容，以及用于记录的元素的 [tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)。这使得你可以结合原生 JavaScript 方法对元素进行更复杂的操作。