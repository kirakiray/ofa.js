# Computed Properties

Computed properties derive new values from reactive data and auto-update when dependencies change. They are defined in `proto` using JavaScript `get`/`set` keywords.

## Features

- **Caching**: Results are cached until dependencies change
- **Reactive**: Auto-updates when dependencies change
- **Declarative**: Clear dependency relationships

## get Computed Property

```javascript
export default async () => ({
  data: { count: 1 },
  proto: {
    get countDouble() {
      return this.count * 2;
    }
  }
});
```

Usage in template:
```html
<p>Count: {{count}}</p>
<p>Double: {{countDouble}}</p>
<button on:click="count++">+1</button>
```

## set Computed Property

```javascript
export default async () => ({
  data: { count: 1 },
  proto: {
    get countDouble() {
      return this.count * 2;
    },
    set countDouble(val) {
      this.count = Math.max(0, val / 2);
    }
  }
});
```

Usage:
```html
<button on:click="countDouble = 10">Set Double to 10</button>
```

## Practical Examples

### Filter List with Computed Property

```javascript
export default async () => ({
  data: {
    filterText: '',
    names: ['张3', '李4', '王54']
  },
  proto: {
    get filteredNames() {
      if (!this.filterText) return this.names;
      return this.names.filter(name =>
        name.includes(this.filterText)
      );
    }
  }
});
```

### Form Validation

```javascript
export default async () => ({
  data: { username: '' },
  proto: {
    get isValid() {
      return this.username.length >= 3;
    },
    get statusMessage() {
      return this.isValid ? '有效' : '长度不足';
    }
  }
});
```

```html
<input sync:value="username" placeholder="输入用户名" />
<p class:valid="isValid" class:invalid="!isValid">
  {{statusMessage}}
</p>
```

## Computed vs Methods

| Feature | Computed | Method |
|---------|----------|--------|
| Caching | Yes - cached until deps change | No - runs every call |
| Usage | {{fullName}} | {{fullName()}} |
| Best for | Derived values | Actions |

```javascript
// Computed (recommended) - cached
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Method - runs every time
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Notes

1. **No async**: Keep computed properties synchronous without side effects
2. **Only reactive deps**: Only depend on reactive data, or updates won't work predictably
3. **Avoid circular deps**: May cause infinite loops or rendering failures
4. **Use for derived data**: Use methods for actions that modify state
