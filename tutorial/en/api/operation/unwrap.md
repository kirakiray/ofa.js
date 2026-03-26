# unwrap

The `unwrap` method is used to remove the outer wrapper element of the target element.

<o-playground name="unwrap - remove wrapper" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>## Notes

The target element **must have a parent node**, otherwise the unwrap operation cannot be performed.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // Error, no parent element, cannot unwrap
$el.$('#target').unwrap(); // Correct, remove the wrapping element
```

When the target element has sibling elements, unwrap cannot be performed either.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // Error, because it has adjacent siblings
```

Please note, do not operate within template components such as o-fill or o-if.