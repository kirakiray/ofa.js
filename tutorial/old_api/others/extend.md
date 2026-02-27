# extend

extend 是一个高阶方法，用于扩展实例的属性或方法；

<html-viewer>

```html
<!-- 引入 ofa.js 到你的项目 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li id="target">I am target</li>
    <li>I am 3</li>
</ul>
<div id="logger">logger</div>

<script>
  const target = $("#target");
  
  target.extend({
    get good(){
      return "ofa.js is good";
    },
    say(){
      return 'mother fxxker';
    }
  });
   
  setTimeout(() => {
    const target = $("#target");
    $("#logger").html = `
    good : ${target.good} <br>
    say() : ${target.say()}
    `;
  }, 500);
</script>
```

</html-viewer>

## 扩展 $ 底层

和 jQuery 类似，你也可以通过 fn.extend 扩展底层实例的属性或方法；从 fn 扩展的属性或方法会应用到所有实例上；

<html-viewer>

```html
<!-- 引入 ofa.js 到你的项目 -->
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js"></script>
```

```html
<ul>
    <li>I am 1</li>
    <li id="target">I am target</li>
    <li>I am 3</li>
</ul>
<div id="logger">logger</div>

<script>
  const target = $("#target");
  
  $.fn.extend({
    get good(){
      return "ofa.js is good";
    },
    say(){
      return 'mother fxxker';
    }
  });
   
  setTimeout(() => {
    $("#logger").html = `
    target good : ${$("#target").good} <br>
    logger say() : ${$("#logger").say()}
    `;
  }, 500);
</script>
```

</html-viewer>

## 扩展模板语法

通过 `extend` 扩展属性或函数，可以增加模板语法的功能，甚至为组件提供专属的模板语法糖。但需要注意的是，尽量**不要使用**非官方的模板语法，因为它们会给使用者带来一定的学习成本，并且大量非官方模板语法糖会降低开发体验。

### 扩展属性

你可以通过扩展属性，在模板中使用 `:` 来进行设置。下面我们将扩展一个 `red` 属性，当 `red` 为 `true` 时，字体颜色变为红色：

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<comp-viewer comp-name="temp-one">

```
<script>
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
</script>
<temp-one></temp-one>
```

```html
<template component>
  <button on:click="addCount">Add Count</button>
  <div :red="count % 3">{{count}}</div>
  <script>
    export default {
      tag: "temp-one",
      data: {
        count: 0
      },
      proto:{
        addCount(){
          this.count++;
        },
      }
    };
  </script>
</template>
```

</comp-viewer>

在这个示例中，我们为模板语法添加了一个 `red` 属性，当 `count % 3` 不为 0 时，字体颜色将变为红色。

### 扩展方法

你还可以通过 `extend` 扩展方法，使其在模板语法中可用。方法名称就是冒号前的部分。在这里，我们扩展了一个 `color` 模板语法，后面跟着的参数将被传递给定义的扩展方法。

此处设置了 `always` 属性为 `true`，表示在组件每次需要刷新界面的时机时，都会调用这个定义好的方法。如果不设置 `always`，那么这个模板语法函数只会运行一次。

其中，`options` 提供了更多的参数，可以帮助你开发更具定制性的模板语法；

```javascript
$.fn.extend({
  color(color, func, options){
    const bool = func();
    // console.log(bool,options);
    if(bool){
      this.css.color = color;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<comp-viewer comp-name="temp-two">

```
<script>
$.fn.extend({
  color(color, func, options){
    const bool = func();
    console.log(bool,options);
    if(bool){
      this.css.color = color;
    }else{
      this.css.color = '';
    }
  }
}); 

$.fn.color.always = true;
</script>
<temp-two></temp-two>
```

```html
<template component>
  <button on:click="addCount" color:blue="count % 3">Add Count</button>
  <div color:red="!(count % 3)">{{count}}</div>
  <script>
    export default {
      tag: "temp-two",
      data: {
        count: 0
      },
      proto:{
        addCount(){
          this.count++;
        },
      }
    };
  </script>
</template>
```

</comp-viewer>

## 模板语法原理

到目前为止，你应该已经能够理解，ofa.js 上的许多模板语法实际上是通过 `extend` 扩展出来的：

- `class`、`attr` 方法每次刷新视图都会运行
- `on`、`one` 这种函数绑定只会运行一次

你可以查看下面的示例来更好地理解 ofa.js 的模板渲染原理：

<comp-viewer comp-name="temp-three">

```html
<template component>
  <div>class always => {{classalways}}</div>
  <div>attr always => {{attralways}}</div>
  <div>on always => {{onalways}}</div>
  <script>
    export default {
      tag: "temp-three",
      data: {
        classalways:"",
        attralways:"",
        onalways:""
      },
      ready(){
        this.classalways = $.fn.class.always;
        this.attralways = $.fn.attr.always;
        this.onalways = !!$.fn.on.always;
      }
    };
  </script>
</template>
```

</comp-viewer>