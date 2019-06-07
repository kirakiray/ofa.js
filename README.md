# XDFrame

No webpack,No nodejs,Let the front end go back to the purest web;

XDFrame，让前端回到最纯粹的web；没有nodejs，没有webpack，也能开发超大型应用；

## 为什么要用XDFrame？

使用 XDFrame封装的组件包，几乎不需要学习成本；

先给页面添加XDFrame；

### 如何给你的项目添加XDFrame

直接引用 `xdframe.js` 入 html 文件即可；

```html
<head>
    ...
    <!-- <script src="xdframe.js"></script> -->
    <!-- <script src="https://kirakiray.github.io/XDFrame/dist/xdframe.js"></script> -->
    <script src="https://kirakiray.github.io/XDFrame/dist/xdframe.min.js"></script>
    ...
</head>
```

### 如何使用XDFrame组件包

例如要使用 XDFrame 官方提供的组件包；

```html
<script>
    load("$/markdown -pack");
</script>

<body>
    <markdown xv-ele src="../README.md" style="padding:20px;">
        正在请求数据中；
    </markdown>
</body>
```

开发 **XDFrame组件包** 不需要学习 nodejs和webpack；

XDFrame的学习成本低，跳过了nodejs和webpack，开发web前端代码，仅需要升级浏览器即可；XDFrame已包含 `模块化`、`组件化`和`数据同步`的功能；

## 为什么叫XDFrame

因为是使用 [Xhear](https://github.com/kirakiray/Xhear) 和 [drill.js](https://github.com/kirakiray/drill.js) 构建的框架，所以取两个库的开头字母；

Xhear 负责视图和数据绑定；

drill.js 负责模块和资源管理；

打包起来，只有37kb (1.0.0 版)；

<img src="doc/sources/xdframe_fime_info.png" width="263" />

## 如何开发 XDFrame组件包？

再次重申，不需要使用第三方脚手架（没有 nodejs 和 webpack），只需要安装最新的浏览器(建议Chrome和Firefox)，只需要学会使用 `js`(推荐es7)、`html`和`css`即可；

## XDFrame 目前适合那些项目？

## 如何兼容旧版本浏览器？

当前推荐用 `babel`(还是需要学会使用 nodejs和npm)，使用 babel-cli编译成 es5 的版本；

XDFrame以后会推出工具软件（学习对象是微软，类似 vsstudio，全gui操作，无命令行），直接所见即所得的方式制作项目；

## 重定向XDFrame官方仓库

## XDFrame构成

## 案例

### [PageCreator](https://kirakiray.com/pageCreator/)

用于制作网页的工具；
