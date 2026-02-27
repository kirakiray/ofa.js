# html

设置目标内部的 html 代码；

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<div id="target1">
    <span style="color:green;">target 1</span>
</div>
<div id="target2">origin text</div>
<br>
<div id="logger" style="border:red solid 1px;padding:8px;"></div>

<script>
    setTimeout(()=> {
        $('#target2').html = `<b style="color:blue;">new text</b>`;

        console.log($("#target1").text) // => <span style="color:green;">target 1</span>;
        $("#logger").html = $("#target1").html;
    }, 500);
</script>
```

</html-viewer>

## 注意事项

html 是个比较危险的方法，被塞入 `script` 也会自动执行内部的 `javascript` 代码，使用时注意预防 [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)；

## 模板语法方式使用

你还可以在模板内使用 `:html` 属性来向目标元素设置对应的属性值。这在组件的渲染中特别有用。下面是一个示例：

<comp-viewer comp-name="html-demo">

```html
<template component>
  <div>Rendered html: 
    <span :html="txt" style="color:red;"></span>
  </div>
  <script>
    export default {
      tag: "html-demo",
      data: {
        txt: "I am txt"
      },
      ready(){
        setTimeout(()=>{
          this.txt = "<b style='color:blue;'>change txt</b>";
        }, 500);
      }
    };
  </script>
</template>
```

</comp-viewer>