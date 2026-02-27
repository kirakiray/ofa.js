# classList

[classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) 属性和原生保持一致；

下面是一个示例，演示了如何使用 `classList`：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<style>
    .t-red{
        color: red;
        font-size: 14px;
    }
    .t-blue{
        color: blue;
        font-weight:bold;
        font-size:20px;
    }
</style>
<div id="target" class="t-red">origin text</div>

<script>
    setTimeout(()=> {
        $("#target").classList.remove('t-red');
        setTimeout(()=>{
            $("#target").classList.add('t-blue');
        },1000);
    }, 1000);
</script>
```

</html-viewer>

`classList` 属性允许你轻松地添加、删除和切换类名，以便动态更改元素的样式。有关更多操作方法，请查阅 [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)。