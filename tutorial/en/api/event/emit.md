# emit

Using the `emit` method, you can actively trigger events, and these events follow a bubbling mechanism. This means the event bubbles from inner elements to outer ones, firing from the innermost to the outermost layer.

Here is an example demonstrating how to use the `emit` method to trigger a custom event and leverage the bubbling mechanism to pass the event to external elements:

<o-playground name="emit - trigger event" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we registered the same custom event handler `custom-event` for both the `<ul>` element and the `<li>` element. When we trigger the event using the `emit` method, the event bubbles from the `<li>` element to the `<ul>` element, activating both event handlers.

## Custom Data

By including the `data` parameter, you can pass custom data to the event handler:

<o-playground name="emit - custom data" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we pass custom data to the event handler via the `data` parameter. The event handler can retrieve the passed data through `event.data`.

## Fire an event without bubbling

If you don’t want the event to bubble, you can pass `bubbles: false` when dispatching it.

<o-playground name="emit - no bubbling" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

In this example, we triggered a custom event using the `bubbles: false` parameter. This event will not bubble up to parent elements, so only the event handler of the `<li>` element is triggered.

## Penetrating the Root Node

By default, events do not penetrate the shadow DOM of a custom component. However, you can make custom events penetrate the root node and trigger elements outside of it by setting `composed: true`.

<o-playground name="emit - Penetrating Root Node" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

In this example, we create a custom element `composed-test` that contains an element inside its shadow DOM and a button that dispatches an event. By default, the event does not cross the shadow boundary to the root node. However, by setting `composed: true` when dispatching the event, we allow it to propagate through the shadow DOM and trigger elements outside the root node.