# css

`css` 方法用于获取或设置目标元素的样式。

## 直接使用

你可以直接使用 `css` 方法来获取或设置元素的样式。下面是一个示例：

<html-viewer>

```
<!-- 引入 ofa.js 到你的项目 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<div id="target">origin text</div>
<br>
<h4>logger</h4>
<div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>

<script>
    $("#logger").text = $("#target").css.color;
    setTimeout(()=> {
        $('#target').css.color = 'red';
        $("#logger").text = $("#target").css.color;
    }, 1000);
</script>
```

</html-viewer>

## 全量设置

通过获取的 `css` 对象，你可以得到直接设置在元素上的 style 值。下面是一个示例：

<html-viewer>

```
<!-- 引入 ofa.js 到你的项目 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<div id="target" style="color:red">origin text</div>
<br>
<h4>logger</h4>
<div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>

<script>
    $("#logger").text = Object.keys($("#target").css);
   
    setTimeout(()=>{
        // 覆盖已有样式
        $("#target").css = {
            color: "blue",
            lineHeight: "5em"
        };
        $("#logger").text = Object.keys($("#target").css);
    }, 500);
</script>
```

</html-viewer>

使用 `css` 对象的特性，你可以快速地调整目标元素的样式。

## 模板语法方式使用

你还可以通过模板语法来设置目标元素的样式。下面是一个示例：

<comp-viewer comp-name="css-demo">

```html
<template component>
  <div :css.color="txt">I am target</div>
  <script>
    export default {
      tag: "css-demo",
      data: {
        txt: "red"
      },
      ready(){
        setTimeout(()=>{
          this.txt = "blue";
        }, 500);
      }
    };
  </script>
</template>
```

</comp-viewer>

## 设置 css 的技巧

你可以通过 `$ele.css = {...$ele.css, color:'red'}` 的方式来修改元素的某个样式属性，而不影响其他样式属性。这种方式可以在不重写整个样式的情况下，只修改其中一个属性。

### 示例

```html
<div id="myElement" style="color: blue; font-size: 18px;">Hello World</div>
<script>
  const myElement = $("#myElement");

  // 修改元素的颜色样式，同时保留其他样式属性不变
  myElement.css = { ...myElement.css, color: 'red' };
</script>
```

在上面的示例中，通过使用 `{ ...myElement.css, color: 'red' }`，我们只修改了元素的颜色样式，而将其他样式属性保持不变。这是一个很方便的技巧，可以灵活地修改元素的样式。