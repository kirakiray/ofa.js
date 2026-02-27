帮我把旧文档 tutorial/old_api/SUMMARY.md 转换为新文档 tutorial/cn/api/_config.yaml，先只转换 事件相关 的内容

将 tutorial/old_api/event 目录下的所有文件转换为新文档 tutorial/cn/api/event 目录下的文件，并优化润色相关描述

其中，将 html-view 组件转为 o-playground 组件，转换格式如下：

例如原内容:

<html-viewer>

```
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<div id="logger1" style="border:red solid 1px;padding:8px;">-</div>

<script>
    let count = 0;

    $('ul').on('custom-event',()=>{
        count++;
        $("#logger1").text = 'ul is triggered ' + count;
    });
</script>
```
</html-viewer>

转换为新内容（记得将换行的空格删除，$ 前添加反斜杠）：

<o-playground>
  <code path="demo.html">
    <template>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
            count++;
            \$("#logger1").text = 'ul is triggered ' + count;
        });
      </script>
    </template>
  </code>
</o-playground>

还有将 comp-viewer 组件转换为 o-playground 组件，转换格式如下：

例如原内容:

<comp-viewer comp-name="test-shadow">

```html
<template component>
    <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
    </ul>
    <script>
        export default {
            tag:"test-shadow",
            ready(){
                setTimeout(()=>{
                    this.shadow.$("#target").text = 'change target';
                },500);
            }
        };
    </script>
</template>
```

</comp-viewer>

转换为新内容（记得将换行的空格删除，$ 前添加反斜杠）：

<o-playground style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          \$("test-shadow").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>