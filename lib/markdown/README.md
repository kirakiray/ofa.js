# markdown

markdown支持库，依赖以下开源库；

[markedjs](https://github.com/markedjs/marked)

[hljs-dark](https://github.com/dracula/highlightjs)

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)

当前库采用MIT开源协议。

## 如何使用

XDFrame加载完成后，添加 `$/markdown` 库；

```html
<script src="xdframe.js"></script>
<script>
    // 加载markdown库
    load("$/markdown");
</script>
```

接下来就可以直接在html问价内使用了；

```html
<markdown xv-ele>
    # 我是markdown标题

    ## 二级标题
</markdown>
```

在html内使用时，请不要直接添加 element 标签的展示代码；

可以采用外部资源方式添加；

```html
<markdown xv-ele src="README.md">
    正在请求数据中；
</markdown>
```

主体数据在实例化对象的 `mdData`内；

```javascript
$('markdown').mdData  // => 得到标签的markdown原始文本

$('markdown').mdData = `# title ...`; // => 直接设置 markdown 的内部文本
```
