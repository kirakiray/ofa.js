# State Management

## Create Reactive State
```javascript
const store = $.stanz({
  count: 0,
  user: { name: "John" }
});
```

## Use in Component
```javascript
export default {
  data: { store: {} },
  attached() {
    this.store = store;
  },
  detached() {
    this.store = {};
  }
};
```

## Direct Property Access
```javascript
store.count++;
store.user.name = "Jane";
```

## Module-level State
```javascript
// data.js
export const cartStore = $.stanz({ total: 0 });

// In component
const { cartStore } = await load("./data.js");
```

## Computed Properties (getter/setter)
```javascript
export default {
  data: { count: 1 },
  proto: {
    get doubled() {
      return this.count * 2;
    },
    set doubled(val) {
      this.count = val / 2;
    }
  }
};
```

```html
<p>{{doubled}}</p>
<button on:click="doubled = 10">Set doubled to 10</button>
```

## Watchers
```javascript
export default {
  data: { count: 0 },
  watch: {
    count(newVal) {
      console.log('count changed to:', newVal);
    }
  }
};
```

## Key Points
- `$.stanz()` creates reactive state objects
- Always cleanup state references in `detached`
- Use getters/setters for computed properties
- Watchers auto-trigger on dependency changes
