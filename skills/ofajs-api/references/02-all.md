# all - Get All Matching Elements

## Get All Elements
```javascript
$("selector").all("li")
```

## Examples
```javascript
// Get all li elements
$("ul").all("li").forEach((item, index) => {
  item.text = `item ${index}`;
});

// Multiple selectors
$.all("div, p, span")
```

## Return Value
Returns an array of element instances.
