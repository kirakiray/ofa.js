# Lifecycle Hooks

## Lifecycle Order
1. `ready` - Component template rendered, DOM created
2. `attached` - Component added to DOM
3. `loaded` - Component and all children fully loaded

## Hooks Definition

```javascript
export default async () => {
  return {
    data: { count: 0 },
    ready() {
      console.log('Component ready, DOM created');
    },
    attached() {
      console.log('Component attached to DOM');
      this._timer = setInterval(() => {
        this.count++;
      }, 1000);
    },
    detached() {
      console.log('Component removed from DOM');
      clearInterval(this._timer);
    },
    loaded() {
      console.log('Component and children fully loaded');
    }
  };
};
```

## Common Use Cases

### Initialize with ready
```javascript
ready() {
  this.initDomElements();
}
```

### Start timers in attached
```javascript
attached() {
  this._timer = setInterval(() => {
    console.log('tick');
  }, 1000);
}
```

### Cleanup in detached
```javascript
detached() {
  clearInterval(this._timer);
}
```

## Key Points
- Use `ready` for DOM-dependent initialization
- Use `attached` for operations requiring visible component
- Always cleanup timers/intervals in `detached` to prevent memory leaks
