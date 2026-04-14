# Property Operations - text & html

## text
```javascript
// Get
$("#target").text

// Set
$("#target").text = "new text"

// Template syntax
<span :text="val"></span>
```

## html
```javascript
// Get inner HTML
$("#target").html

// Set inner HTML (careful with XSS!)
$("#target").html = `<b>bold</b>`

// Template syntax
<div :html="content"></div>
```

## Examples
```javascript
$("#target").text = "Hello";
$("#logger").text = $("#target1").text;
```
