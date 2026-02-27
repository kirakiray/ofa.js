# 盒模型

在网页开发中，元素的尺寸是一个重要的概念，它包括了内容区域、内边距、边框和外边距。以下是一些表示元素尺寸的相关属性：

## width

`width` 表示元素的内容区域的宽度，它不包括内边距、边框和外边距。

## height

`height` 表示元素的内容区域的高度，它不包括内边距、边框和外边距。

## clientWidth

`clientWidth` 表示元素的可见内容区域的宽度，包括内边距，但不包括边框和外边距。

## clientHeight

`clientHeight` 表示元素的可见内容区域的高度，包括内边距，但不包括边框和外边距。

## offsetWidth

`offsetWidth` 表示元素的整体宽度，包括内容区域、内边距、边框和外边距。

## offsetHeight

`offsetHeight` 表示元素的整体高度，包括内容区域、内边距、边框和外边距。

## outerWidth

`outerWidth` 表示元素的整体宽度，包括内容区

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.3.40/dist/ofa.min.js"></script>
```

```html
<style>
    #box {
      width: 150px;
      height: 100px;
      background-color: #f0f0f0;
      border: 2px solid #333;
      padding: 20px;
      margin: 30px;
    }
</style>
<div id="box">I am a div element.</div>

<div id="logger"></div>
<script>
    const box = $('#box');

    $("#logger").html = `
    width: ${box.width}px <br>
    height: ${box.height}px <br>
    clientWidth: ${box.clientWidth}px <br>
    clientHeight: ${box.clientHeight}px <br>
    offsetWidth: ${box.offsetWidth}px <br>
    offsetHeight: ${box.offsetHeight}px <br>
    outerWidth: ${box.outerWidth}px <br>
    outerHeight: ${box.outerHeight}px
    `;
</script>
```

</html-viewer>