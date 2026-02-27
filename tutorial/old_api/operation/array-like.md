# 添加或删除子元素

元素实例拥有类似数组的特性，添加或删除节点只需要使用数组那几个操作方法即可；其中使用 `push`、`unshift`、`pop`、`shift`、`splice` 方法时，内部会自动执行 [$ 方法](../instance/dollar.md) 的初始化操作，所以可以直接填写具体的元素字符串或对象。

同样的，您也可以使用其他数组方法，例如 `forEach`、`map`、`some` 等等。

**请注意，在具有模板语法的元素上不要添加或删除子元素。**

## push

从末尾添加子元素。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
        $("ul").push(`<li style="color:red;">new li</li>`);
    }, 500);
</script>
```

</html-viewer>

## unshift

在数组的开头添加子元素。下面是一个示例：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
        $("ul").unshift(`<li style="color:blue;">new li</li>`);
    }, 500);
</script>
```

</html-viewer>

## pop

从末尾删除子元素。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
        $("ul").pop();
    }, 500);
</script>
```

</html-viewer>

## shift

在数组的开头删除子元素。

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
        $("ul").shift();
    }, 500);
</script>
```

</html-viewer>

## splice

可以删除或替换现有子元素，也可以添加新子元素。其使用方式与数组的 `splice` 方法相似。下面是一个示例：

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li>I am 2</li>
    <li>I am 3</li>
</ul>

<script>
    setTimeout(()=>{
$("ul").splice(1, 2, `<li style="color:green;">new li 1</li>`, `<li style="color:green;">new li 2</li>`);
    }, 500);
</script>
```

</html-viewer>