# is

用于检测元素是否符合表达式；

<html-viewer>

```html
<!-- 引入 ofa.js 到你的项目 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li id="target">I am target</li>
    <li>I am 3</li>
</ul>
<div id="logger">logger</div>

<script>
  setTimeout(() => {
    const target = $("#target");
    $("#logger").html = `
    Is li: ${target.is('li')} <br>
    Is div: ${target.is('div')} <br>
    Have id: ${target.is('[id]')} <br>
    Have class: ${target.is('[class]')} <br>
    `;
  }, 500);
</script>
```

</html-viewer>
