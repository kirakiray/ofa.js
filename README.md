# ofa.js 
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kirakiray/ofa.js/blob/main/LICENSE)
[![GitHub license](https://img.shields.io/badge/Discussions-F7CB53)](https://github.com/ofajs/discussion/discussions)

[Official Documentation](https://ofajs.com/en/index.html) / [官方文档](https://ofajs.com/cn/index.html) / [官方文檔](https://ofajs.com/t-cn/index.html) / [Sitio oficial de documentación](https://ofajs.com/es/index.html) / [公式ドキュメントサイト](https://ofajs.com/ja/index.html) / [공식 문서 사이트](https://ofajs.com/ko/index.html)

The current official documentation may be delayed, but it is being actively updated.

## What is ofa.js?

ofa.js is a library for building web interfaces and applications. By integrating a `script` tag into your HTML, you can start developing immediately. It is one of the best alternatives to jQuery currently available.

ofa.js can be used as a library like jQuery, and it can also be used to develop large web applications like React, Vue, and Angular. Its emergence completely eliminates the need for tools such as npm, Node.js, and webpack, which are unrelated to interface development, making interface development simpler and more efficient.

## How to Use

To start using ofa.js, simply add a reference to ofa.js in your HTML file.

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.6.14/dist/ofa.min.js"></script>
```

### Debug Mode

To better facilitate development and debugging, ofa.js provides a debug mode feature. In debug mode, component templates will enable the sourcemap feature, allowing you to more easily locate and solve problems. Enabling debug mode is very simple; just add the `#debug` parameter to the ofa.js reference URL:

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.6.14/dist/ofa.js#debug"></script>
```

## Usage Experience

You can try the specific usage experience [here](https://ofajs.com/en/cases/index.html).

The core philosophy of ofa.js is to simplify the encapsulation process of Web Components. Traditional Web Component encapsulation requires a large amount of knowledge, which has led to the relatively slow development of Web Components. As a result, the Web Components v1 standard, which has been supported since 2018, has not yet been widely adopted.

However, with ofa.js, you can quickly create a component by simply creating an HTML file. Others can reference this component through a simple tag without a pre-compilation process, greatly reducing the learning curve and allowing you to focus on application requirements.

```html
<!-- my-component.html -->
<!-- Encapsulated component code, written in the HTML file -->
<template component>
    ...
</template>
```

```html
<!-- Using the encapsulated component -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@4.6.14/dist/ofa.min.js"></script>
<l-m src="./my-component.html"></l-m>
<my-component>
    ...
</my-component>
```

In addition, ofa.js introduces template syntax sugar similar to that of Angular and Vue, enabling you to work more efficiently when developing Web Components.

## Why Develop ofa.js?

The original intention behind the development of ofa.js was to eliminate the unnecessary interference of npm, Node.js, and webpack in front-end development. These tools increase the barrier to using front-end frameworks and components, making front-end development more complex. If you are developing a more complex front-end application, a significant amount of time and energy will be spent learning and solving nodejs and webpack issues.

> The author has worked with Vue and React for many years. Initially, they thought that their unfamiliarity with these frameworks was the reason they seemed inconvenient. However, with years of experience, the author gradually realized that they are truly not user-friendly.

For example, for back-end developers, if they just want to create a simple and beautiful form page, they have to first master some front-end basics (such as npm/nodejs/webpack/create-app-cli) before they can start using frameworks like React, Angular, or Vue to build components. At this point, they may feel frustrated and ask, "Why do I have to learn so many new things just to create a nice page?" Or they may encounter errors while exploring npm/nodejs/webpack and then revert to using jQuery forms that they have used before. Now, with ofa.js available, it can effectively replace jQuery and meet the needs of such simple page requirements.

The author believes that the original intentions of Angular.js (v1) and jQuery were correct because they lowered the barrier to use. However, with the rise of Node.js and the introduction of pre-compilation modes, front-end development has gone astray. The author believes that front-end development should maintain the immediate execution characteristics of JavaScript, rather than relying too much on pre-compilation. They also appreciate the contributions of Node.js to the community, which has driven the rapid development of JavaScript.

ofa.js is also a natural micro front-end framework, and you will understand this if you have used it.

## License

ofa.js is licensed under the [MIT License](https://github.com/kirakiray/ofa.js/blob/main/LICENSE).