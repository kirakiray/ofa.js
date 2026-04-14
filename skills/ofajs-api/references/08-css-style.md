# Style Operations - css & style

## css
```javascript
// Get single style
$("#target").css.color

// Set single style
$("#target").css.color = 'red'

// Get all styles as object
Object.keys($("#target").css)

// Set multiple styles (merge)
$("#target").css = { ...$("#target").css, color: 'blue', fontSize: '14px' }

// Template syntax
<div :css.color="txt"></div>
```

## style
```javascript
// Same API as native style
// Cannot get computed styles, only inline styles
$("#target").style.color = 'red';
$("#target").style.fontSize = '14px';
```

## Examples
```javascript
// Preserve existing styles when changing one
myElement.css = { ...myElement.css, color: 'red' };
```
