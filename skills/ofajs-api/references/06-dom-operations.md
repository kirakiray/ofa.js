# DOM Operations

## Insert Elements
```javascript
// Insert before target
$("#target").before(`<li>new item</li>`);

// Insert after target
$("#target").after(`<li>new item</li>`);

// Append to target
$("#container").push(newElement);
```

## Remove Element
```javascript
$("#target").remove();
```

## Wrap Element
```javascript
// Wrap target with new element
$('#target').wrap(`<div style="border:red;">wrap</div>`);

// Target must have a parent node
```

## Template Syntax
```html
<!-- In o-fill/o-if, don't use these operations -->
```
