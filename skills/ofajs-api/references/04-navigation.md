# DOM Navigation

## Siblings
```javascript
$("#target").prev        // Previous sibling
$("#target").next        // Next sibling
$("#target").siblings    // All siblings (array)
```

## Parent
```javascript
$("#target").parent      // Direct parent
$("#target").parents     // All ancestors (array)
```

## Examples
```javascript
// Change previous element
$('#target').prev.text = "changed";

// Get all siblings
$('#target').siblings.forEach(e => e.text = 'changed');

// Navigate to parent
$('#target').parent.css.color = 'blue';
```

## Children
```javascript
$("ul")[0]        // First child
$("ul")[1]        // Second child
$("ul").length    // Number of children
```
