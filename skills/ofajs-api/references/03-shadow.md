# Shadow DOM Access

## Access Shadow Root
```javascript
$("my-component").shadow.$("selector")
```

## Examples
```javascript
// Inside component
this.shadow.$("#target").text = 'changed';

// From outside
$("test-shadow").shadow.$("#target").text = 'change from outside';

// Chain with other methods
$('my-component').shadow.$("selector").css.color = 'red'
```
