# ofa.js

[Official Documentation / 官方文档 / 官方文檔](https://ofajs.com)

## 什么是 ofa.js？

ofa.js 是用于构建 Web 界面和应用的库。通过将 `script` 标签引入到 HTML 中，就可以立即开始开发。是目前替代 jQuery 最佳的解决方案之一。

ofa.js 可以像 jQuery 一样作为库使用，也能像 React、Vue 和 Angular 一样用于开发大型 Web 应用。它的出现彻底摆脱了与界面开发无关的 npm、Node.js 和 webpack 这些工具，使界面开发变得更加简单和高效。

## 如何使用

要开始使用 ofa.js，只需将 ofa.js 的引用添加到 HTML 文件中即可。

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.5.28/dist/ofa.min.js"></script>
```

## 使用体验

您可以在[此处](https://ofajs.com/en/cases/index.html)尝试具体的使用体验。

ofa.js 的核心理念在于简化 Web Components 的封装过程。传统的 Web Components 封装需要掌握大量知识，导致 Web Components 的发展相对缓慢，以至于 Web Components  v1 标准从 2018 年开始得到支持，至今仍未广泛采用。

然而，使用 ofa.js，您只需创建一个 HTML 文件，即可快速创建一个组件。其他人可以通过一个简单的标签引用这个组件，无需预先打包过程，大大降低了学习成本，让您能够专注于应用需求。

```html
<!-- my-component.html -->
<!-- 封装的组件代码，写在 html 文件上 -->
<template component>
    ...
</template>
```

```html
<!-- 使用封装好的组件 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.5.28/dist/ofa.min.js"></script>
<l-m src="./my-component.html"></l-m>
<my-component>
    ...
</my-component>
```

除此之外，ofa.js 还引入了类似 Angular 和 Vue 的模板语法糖，使您在开发 Web Components 时能够更高效地工作。

## 为什么开发 ofa.js？

ofa.js 的开发初衷在于消除 npm、Node.js 和 webpack 对于前端开发的不必要干扰。这些工具增加了前端框架和组件的使用门槛，导致前端开发变得复杂化。如果您要开发较复杂的前端应用，大量时间和精力将花费在学习和解决 nodejs 和 webpack 问题上。

> 作者已用 Vue 和 React 工作多年，最初认为自己对这些框架不够熟悉，才会觉得它们不够方便。然而，随着多年的工作经验，作者渐渐认识到，它们是真的不好用。

例如，对于后端开发人员来说，如果他们只想创建一个简洁美观的表单页面，却不得不先掌握一些前端基础知识（如npm/nodejs/webpack/create-app-cli），才能开始使用React、Angular或Vue等框架来构建组件。这时，他们可能会感到沮丧，问道："我只是想要一个漂亮的页面，为什么要学这么多新东西？" 或者在摸索npm/nodejs/webpack的过程中遇到错误，然后回到之前使用过的jQuery表单。而现在，有ofa.js可供使用，它能很好地替代jQuery，满足这种简单的页面需求。

作者认为 Angular.js（v1）和 jQuery 的初衷才是正确的，因为它们降低了使用门槛。但随着 Node.js 的崛起，预编译模式的引入让前端走偏了。作者认为前端开发应该保持 JavaScript 的即时运行特性，而不是过度依赖预编译。他也感谢 Node.js 对社区的贡献，它推动了 JavaScript 的快速发展。

ofa.js 还是天生的微前端框架，如果您使用过，就会了解这一点。

## 许可证

ofa.js 采用 [MIT 协议](https://github.com/kirakiray/ofa.js/blob/main/LICENSE)。