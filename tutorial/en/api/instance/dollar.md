# $

`$` is the core function in ofa.js, used to get and manipulate DOM element instances. Below is a detailed introduction to the main features of `$`:

## Obtaining Element Instances

With the `$` method, you can retrieve the first element instance on the page that matches the [CSS selector](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list) and perform operations on it. Here’s an example:

<o-playground name="$ - Get element">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

In the example above, we used the `$` symbol to select the element instance with `id` "target1" and modified its text content by setting the `text` property.

## Find Child Element Instance

Instances also have the `$` method, which can be used to retrieve the first child element instance that meets the criteria from the instance.

<o-playground name="$ - Find child elements">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

Do not insert the obtained element instance directly elsewhere, as this will affect the original element. If you need to create a copy, use the [clone](./clone.md) method.

<o-playground name="$ - Instance Features" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## Get child elements within the shadow node

After obtaining the instance through the [shadow](./shadow.md) attribute, you can use the `$` method to get the desired element:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## Instantiating Elements Directly

You can directly initialize a native element as a `$` instance object in the following way:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

This way, you can conveniently convert existing HTML elements into `$` instances, enabling you to use the functionalities provided by `$` for manipulation and processing.

## Generate Element Instance

Besides, `$` can be used not only to obtain existing element instances but also to create new ones and add them to the page.

### Generate via String

You can create a new element instance from a string using the `$` function, as shown below:

<o-playground name="$ - String Generation" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">add target 1 text</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In this example, we use the `$` function to create a new element instance with specified styles and text content, and add it inside an existing element instance with the `id` "target1".

### Generate via object

You can also use the `$` function to generate new element instances in an object-oriented manner, as shown below:

<o-playground name="$ - Object Creation" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

In this example, we use the `$` function to define a new element instance in an object-oriented way, including the tag type, text content, and style attributes, and add it inside an existing element instance with an `id` of "target1".