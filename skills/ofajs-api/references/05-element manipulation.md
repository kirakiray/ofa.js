# Element Creation & Manipulation

## clone
```javascript
const clone = $("#target").clone();
$("#container").push(clone);
```

## root
```javascript
$("#target").root     // document for normal elements
                       // shadow root for shadow DOM elements
```

## host
```javascript
$("#target").host      // Host component instance or null
```

## app
```javascript
$("#target").app       // o-app instance (in o-app context)
```

## ele
```javascript
$("#target").ele       // Native Element
const width = $("#target").ele.clientWidth;
```
