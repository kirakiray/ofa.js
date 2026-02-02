# 脚本引入

ofa.js 可以通过脚本引入的方式使用。你可以在 HTML 文件中添加如下代码：

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

## 使用

在引用资源后，ofa.js 将在全局作用域上设置一个 $ 属性，所有的功能都在 $ 上，后面的教程会详细讲解其用法；

## 调试模式

你可以通过在引用 ofa.js 的 script 标签上添加 debug hash 来开启调试模式。在调试模式下，加载的组件模块或页面模块将启用 sourceMap 功能，允许你直接从源文件进行调试。

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js#debug"></script>
```

开启调试模式后，你将能够更方便地追踪和调试你的组件代码。这对于开发过程中的错误排查和代码调试非常有帮助。