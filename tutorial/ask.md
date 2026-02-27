帮我把旧文档 tutorial/old_api/SUMMARY.md 转换为新文档 tutorial/cn/api/_config.yaml，先只转换 实例相关的内容

将 tutorial/old_api/instance 目录下的所有文件转换为新文档 tutorial/cn/api/instance 目录下的文件，并优化润色相关描述

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