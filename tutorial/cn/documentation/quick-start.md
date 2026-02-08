# 快速上手

这里会告诉你最开始的准备文件，后续的教程中，我们会忽略这个index.html准备文件的步骤，只显示页面模块文件的代码，你直接按照模版渲染的代码来进行。

## 准备文件

最开始需要创建两个文件，一个是入口的index.html文件，一个是页面模块文件。

- index.html: 页面入口文件
- demo-page.html: 页面模块文件

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.mjs" type="module"></script>
</head>
<body>
    <o-page src="./demo-page.html"></o-page>
</body>
</html>
```

```html
<!-- demo-page.html -->
<template page>
    <style>
        :host{
            display: block;
        }
    </style>
    <p>{{val}}</p>
    <script>
        export default async ()=>{
            return {
                data:{
                    val:"Hello NoneOS Demo Code"
                }
            };
        }
    </script>
</template>
```

## 预览

<l-m src="https://playground.ofajs.com/comps/o-playground/o-playground.html"></l-m>

<o-playground style="--editor-height: 500px">
  <template page>
      <style>
          :host{
              display: block;
          }
      </style>
      <p>{{val}}</p>
      <script>
          export default async ()=>{
              return {
                  data:{
                      val:"Hello NoneOS Demo Code"
                  }
              };
          }
      </script>
  </template>
</o-playground>
