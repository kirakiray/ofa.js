# Custom Events

In ofa.js, in addition to built-in DOM events, you can also create and use custom events to implement communication between components. Custom events are an important mechanism in component-based development, allowing components to broadcast messages or state changes upward.

## emit Method - Triggering Custom Events

The `emit` method is used to trigger custom events, notifying external listeners of state changes or user operations within the component.

### Basic Usage

```javascript
// Trigger a simple custom event
this.emit('custom-event');

// Trigger a custom event with data
this.emit('data-changed', {
  data: {
    // Custom data, can be any structure as needed
    newValue: 100,
    oldValue: 50
  }
});
```

### emit Method Parameters

The `emit` method accepts two parameters:

1. **Event Name**: String, representing the event name to trigger
2. **Options Object** (optional): Contains event configuration options
   - `data`: Data to pass
   - `bubbles`: Boolean, controls whether the event bubbles (default is true)
   - `composed`: Boolean, controls whether the event can cross Shadow DOM boundaries
   - `cancelable`: Boolean, controls whether the event can be canceled

Then the upper layer element can listen to this custom event using the `on` method.

## bubbles - Event Bubbling Mechanism

The `bubbles` property controls whether the event will bubble up to parent elements. When set to `true`, the event will propagate up the DOM tree. The default value is `true`. If set to `false`, the event will not bubble.

### Bubbling Mechanism Details

- **Default Behavior**: Events emitted using `emit` have bubbling enabled by default (`bubbles: true`)
- **Bubbling Path**: Events propagate upward from the triggering element, level by level
- **Stop Bubbling**: Call `event.stopPropagation()` in the event handler to stop bubbling

## composed - Penetrating Shadow DOM Boundaries

The `composed` property controls whether the event can cross Shadow DOM boundaries. This is particularly important for Web Components development, with a default value of `false`.

### Penetration Mechanism Details

- **Shadow DOM Isolation**: By default, events cannot cross Shadow DOM boundaries
- **Enable Penetration**: Setting `composed: true` allows events to cross Shadow DOM boundaries
- **Use Cases**: When a component needs to send events to the host environment, `composed: true` must be set

## Key Points

- **emit Method**: Triggers custom events, supports passing data
- **Event Parameters**: Event name, data, bubbles, composed, cancelable
- **Bubbling Mechanism**: `bubbles: true` allows events to bubble up
- **Penetrating Shadow DOM**: `composed: true` allows events to cross Shadow DOM boundaries
- **Listening to Events**: Use `on:eventName` to listen to custom events
