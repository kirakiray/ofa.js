# remove

删除目标节点；

**请注意，在具有模板语法的元素上不要操作元素。**

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li id="target">I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
        $('#target').remove();
    }, 500);
</script>
```

</html-viewer>