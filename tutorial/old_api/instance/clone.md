# clone

使用 `clone` 方法可以克隆并生成一份元素实例；

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target" style="color:red;">I am target</div>

logger⬇️
<div id="logger"></div>

<script>
    setTimeout(()=>{
       const tar = $('#target').clone();
       $('#logger').push(tar);
    },500);
</script>
```

</html-viewer>