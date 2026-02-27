# text

`text` 方法用于获取或设置元素的文本内容。

## 直接使用

你可以直接获取或设置元素的文本内容。下面是一个示例：

<html-viewer>

```
<!-- Include ofa.js in your project -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<div id="target1">target 1</div>
<div id="target2">origin text</div>
<br>
<div id="logger" style="color:red;"></div>

<script>
    setTimeout(()=> {
        $('#target2').text = `<b style="color:blue;">new text</b>`; // 只能设置文本，如果想要标签生效，请设置 html 属性

        console.log($("#target1").text) // => 'target 1';
        $("#logger").text = $("#target1").text;
    }, 500);
</script>
```

</html-viewer>

## 模板语法方式使用

你还可以在模板内使用 `:text` 属性来向目标元素设置对应的属性值。这在组件的渲染中特别有用。下面是一个示例：

<comp-viewer comp-name="text-demo">

```html
<template component>
  <div>Rendered text: 
    <span :text="txt" style="color:red;"></span>
  </div>
  <script>
    export default {
      tag: "text-demo",
      data: {
        txt: "I am txt"
      },
      ready(){
        setTimeout(()=>{
          this.txt = "change txt";
        }, 500);
      }
    };
  </script>
</template>
```

</comp-viewer>