# XDFrame

No webpack,No nodejs,Let the front end go back to the purest web;

XDFrame，让前端回归最纯粹的web；没有nodejs，没有webpack，也能开发超大型应用；

## 为什么要用XDFrame？

开发大型项目

相对前端三大栈，没有 nodejs 和 webpack 做运行时，门槛大幅度降低；开发中遇到报错，没有脚手架的问题；

使用 XDFrame封装的组件包，几乎不需要学习成本；

下面给页面 添加XDFrame支持 和 使用官方组件包；

### 给你的项目添加XDFrame

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

可以将xdframe下载下来放到你的cdn服务器上；

### 如何使用XDFrame组件包

例如要使用 XDFrame 官方提供的 `markdown组件包`；

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

[查看案例，打开后右键 显示网页源代码](https://kirakiray.github.io/XDFrame/demo/markdown_test.html)

下面有重定向官方包的方法；

开发 **XDFrame组件包** 不需要学习 nodejs和webpack；

XDFrame的学习成本低，跳过了nodejs和webpack，开发web前端代码，仅需要升级浏览器即可；XDFrame已集成 `模块化`、`组件化`和`数据同步`的方案；

## 为什么叫XDFrame

因为是使用 [Xhear](https://github.com/kirakiray/Xhear) 和 [drill.js](https://github.com/kirakiray/drill.js) 构建的框架，所以取两个库的开头字母；

Xhear 负责视图和数据绑定；

drill.js 负责模块和资源管理；

XDFrame只是把它们打包起来而已，只有37kb (1.0.0 版)；

<img src="doc/sources/xdframe_fime_info.png" width="263" />

## 如何开发 XDFrame组件包？

[点击这里进入XDFrame组件包开发文档](doc/README.md)；

[ToDoList项目实战](https://github.com/kirakiray/XDFrame/blob/master/doc/todolist.md)

XDFrame 是由 [Xhear](https://github.com/kirakiray/Xhear) 和 [drill.js](https://github.com/kirakiray/drill.js) 构成，能使用它们所有方法，细节可查看它们的文档；

## XDFrame 目前适合那些项目？

目前适合做工具类的项目（后台管理系统，Electron封装工具、Chrome(Firefox)扩展等）；XDFrame自带的 stanz库，提供强大的本地数据同步功能，非常适合工具类应用开发；并且工具类用户有很强的互联网属性，懂得升级和更换浏览器（目前的 XDFrame依赖es7，bable编译后需支持 Proxy 程度）；

后面会提供低版本浏览器起支持（目前 底层 stanz 6 和 Xhear 5 正在开发中，去除 Proxy delete操作，可完全babel操作），请持续关注XDFrame，非常欢迎你的star，你的star就是作者的动力；

## 如何兼容旧版本浏览器？

当前推荐用 `babel`(还是需要学会使用 nodejs和npm)，使用 babel-cli编译成 es5 的版本；

XDFrame以后会推出辅助工具软件（模仿对象是微软的vsstudio，全gui操作，无命令行）；

XDFrame展望的是未来，浏览器es7普及之时；

## 重定向XDFrame官方仓库

官方的组件库地址 [点击这里](https://github.com/kirakiray/XDFrame/tree/master/lib)，可以把组件包目录下载后，放到你的 `cdn` 服务器上，并在项目开始后立刻使用下面代码替换成 `cdn` 的地址；

```javascript
drill.config({
    paths: {
        "^\\$/": "https://your_cdn_url/lib/"
    }
});
```

欢迎提交 XDFrame组件包 到lib；

XDFrame官方仓库目前使用 `github.io` ，欢迎金主爸爸提供第三方稳定cdn空间；

## [XDFrame Q&A](doc/qanda.md)

## 成功案例

### [PageCreator](https://kirakiray.com/pageCreator/)

用于制作网页的工具；
