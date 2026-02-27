# root

使用 root 属性获取元素的根节点；

在页面上，普通元素的根节点都是 [document](https://developer.mozilla.org/en-US/docs/Web/API/Document) 实例；

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li id="target">I am target</li>
</ul>
<div id="logger" style="padding:16px;color:green;"></div>

<script>
    setTimeout(()=>{
        $('#logger').text = $("#target").root.ele === document;
    }, 500);
</script>
```

</html-viewer>

## 在影子节点内的元素

由于组件内元素，是与外部环境隔离的，影子节点内的元素的 `root` 属性就是影子根节点；

<comp-viewer comp-name="test-root">

```html
<template component>
    <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
    </ul>
    <h3>logger1:</h3>
    <div id="logger1" style="color:red;">{{l1}}</div>
    <h3>logger2:</h3>
    <div id="logger2" style="color:green;">{{l2}}</div>
    <script>
        export default {
            tag:"test-root",
            data:{
                l1:"",
                l2:""
            },
            ready(){
                this.l1 = this.shadow.$("#target").root === this.shadow;
                this.l2 = this.root.ele === document;
            }
        };
    </script>
</template>
```

</comp-viewer>

