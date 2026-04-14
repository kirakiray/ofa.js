# Attributes & Data

## attr
```javascript
// Get attribute
$("#target").attr('test-attr')

// Set attribute
$("#target").attr('test-attr', '2')

// Template syntax
<div attr:test-attr="txt"></div>
```

## data
```javascript
// Get data attribute
$("#target").data.one

// Set data attribute
$('#target').data.red = "1"

// Same as native dataset
```

## classList
```javascript
$("#target").classList.add('class-name')
$("#target").classList.remove('class-name')
$("#target").classList.toggle('class-name')
```

## Examples
```javascript
$("#target").attr('disabled', 'true')
$("#target").data.userId = '123'
$("#target").classList.add('active')
```
