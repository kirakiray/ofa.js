# parents

使用 `parents` 属性，您能够轻松获取当前元素的所有父元素实例，这些元素将以数组的形式返回。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div>
    <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
    </ul>
</div>
<div>
    logger: <span id="logger"></span>
</div>
<script>
    setTimeout(()=>{
       $("#logger").text = $("#target").parents.map(e => e.tag);
    },500);
</script>
```

</html-viewer>