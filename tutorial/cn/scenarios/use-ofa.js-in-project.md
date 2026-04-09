# 在项目中使用ofa.js的AI提示词

由于 ofa.js 目前尚未成为广泛知名的框架，主流 AI 模型尚不具备直接使用 ofa.js 的能力。为此，我们精心准备了专用提示词，帮助 AI 学习和查阅 ofa.js 的使用方法。

我们提供了两个版本的提示词：

## 精简版提示词

这是经过浓缩优化的版本，旨在最小化前置 token 输入消耗，适用于大多数场景：

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/tiny/start.md
```

使用此提示词，AI 可以高效地开发 ofa.js 的组件或页面模块。

## 完整版提示词

如果您使用的 AI 模型相对不够智能，可以尝试使用未浓缩的完整版提示词。虽然初始化时会占用更多 token，但可能会获得更好的效果：

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/origin/start.md
```

通过提供这些提示词，我们希望帮助开发者更便捷地利用 AI 工具进行 ofa.js 项目的开发，提升开发效率。

