# nexts

使用 `nexts` 属性，您能够轻松获取当前元素后面的所有相邻元素实例，这些元素将以数组的形式返回。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li id="target">I am target</li>
    <li>I am 3</li>
    <li>I am 4</li>
</ul>

<script>
    setTimeout(()=>{
       $('#target').nexts.forEach(e => e.text = 'change text');
    },500);
</script>
```

</html-viewer>