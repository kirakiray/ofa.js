# Instance Data Characteristics

Instances obtained or created via `$` possess the full data capabilities of stanz, because the `$` instance inherits from stanz. This means you can use stanz’s data manipulation methods and features to operate on and observe the instance’s data.

> The following examples use regular elements because custom components typically come with pre-registered data, whereas regular elements usually contain only tag information, making them more suitable for demonstration purposes.

## watch

Instances can monitor value changes via the `watch` method; even if a nested property of an object is modified, the change is still detected in the object's `watch` method.

Here is an example demonstrating how to use the `$` instance and the `watch` method:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "I am bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "change bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first create a `$` instance named `target`, then use the `watch` method to observe its changes. Even when we modify a nested property such as `target.bbb.child.val`, the `watch` method detects the change and updates the content of the `logger` element. This demonstrates the powerful feature of the `$` instance, allowing you to effortlessly monitor object mutations.

## Watch Tick

`watchTick` behaves similarly to `watch`, but it internally throttles execution to once per single thread, making it more efficient for monitoring data changes in performance-critical scenarios.

Here is an example demonstrating how to use the `watchTick` method on a `$` instance:

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch runs: ' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick runs: ' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first create a `$` instance named `target`. Then we use the `watch` and `watchTick` methods to observe changes to the object. `watch` runs immediately when data changes, whereas `watchTick` executes once per tick under a single thread, thus throttling the frequency of observation. You can choose either `watch` or `watchTick` according to your needs.

## unwatch

The `unwatch` method is used to cancel data monitoring and can revoke previously registered `watch` or `watchTick` listeners.

Below is an example demonstrating how to use the `unwatch` method on a `$` instance:

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In this example, we first create a `$` instance object named `target`, then register two listeners using the `watch` and `watchTick` methods. Later, we revoke these two listeners by passing the previously saved listener return values `tid1` and `tid2` to the `unwatch` method. This means that the property change in the first `setTimeout` will not trigger any listener, because the listeners have been revoked.

## unmonitored values

In a `$` instance, property names that start with an underscore `_` indicate values that will not be observed by the `watch` or `watchTick` methods. This is useful for temporary or private properties, letting you change them freely without triggering any watchers.

Within templates, this is referred to as [non-reactive data](../../documentation/state-management.md).

Here's an example showing how to use underscore-prefixed property values to avoid being watched:

<o-playground name="stanz - non-reactive data" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

In this example, we create a `$` instance object named `target` and use the `watch` method to listen for changes in property values. Inside `setTimeout`, we attempt to modify the `_aaa` property, but this change does not trigger the listener. This is useful when you need to update a property without triggering the watch.

## Basic Features

Object data set on an instance will be converted to a Stanz instance, which allows listening.

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

We can also use `$.stanz` to create a Stanz data that is not bound to an instance.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

These examples demonstrate the basic characteristics of setting object data as Stanz instances for listening.

For more complete features, please refer to [stanz](https://github.com/ofajs/stanz).