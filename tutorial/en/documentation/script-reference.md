# Script Introduction

ofa.js can be used directly via a script tag. Just add the following code to the `<head>` or `<body>` section of your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Basic Usage

After the script is loaded, ofa.js creates a `$` variable in the global scope, and all core functionality is provided through this object. You can access the various methods and properties of ofa.js via this object. Subsequent tutorials will detail its specific usage.

## Debug Mode

During development, you can enable debug mode by appending the `#debug` parameter to the script URL.

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

Debug mode enables the source map feature, allowing you to view and debug the original source code directly in the browser developer tools, thereby greatly improving development efficiency.

## ESM Modules

ofa.js also supports importing via ESM modules. You can use the `import` statement in your project to bring in ofa.js:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

When using ESM modules, you can directly use the `$` variable in your code without accessing it through the global scope.