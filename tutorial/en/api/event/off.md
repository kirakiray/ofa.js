# off

Using the `off` method can unregister an event handler that has been registered, thereby canceling the listening to the event.

Below is an example demonstrating how to use the `off` method to remove an event listener:

<o-playground name="off - Remove Event Listener" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

In this example, we registered a click event handler `f`. When the button is clicked, the event handler displays the click count in `#logger`. Using the `off` method, we removed the event listener when the click count reaches 3.