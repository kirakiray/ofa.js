# Stanz - Reactive Data Features

Instance from `$()` has Stanz features built-in.

## watch
```javascript
const instance = $("#target");
instance.watch(() => {
  console.log("data changed!");
});

// Returns watcher ID
const tid = instance.watch(() => {});
```

## watchTick (Throttled)
```javascript
instance.watchTick(() => {
  console.log("throttled updates");
});
```

## unwatch
```javascript
const tid = instance.watch(() => {});
instance.unwatch(tid);
```

## Non-reactive Properties (underscore)
```javascript
instance._privateVar = "not watched";
instance._tempData = { foo: "bar" };
```

## Direct Stanz Creation
```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```
