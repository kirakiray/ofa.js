# host

Using the `host` property, you can obtain the instance of the element's host component. This is useful for accessing the data and methods of its host component from within the component.

Below is an example demonstrating how to use the `host` property to get an instance of the host component:

<o-playground name="host - Get Host" style="--editor-height: 700px">
  <code path="demo.html" preview>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./user-card.html"></l-m>
      <user-card username="tom"></user-card>
      <script>
        export default async function(){
          return {
            data: {
              greeting: "Hello"
            },
            proto: {
              sayHi(){
                return `${this.greeting}, I'm the host!`;
              }
            }
          };
        }
      </script>
    </template>
  </code>
  <code path="user-card.html" active>
    <template component>
      <style>
        :host{display:block;border:1px solid #ddd;padding:12px;margin:8px;border-radius:4px;}
      </style>
      <div>Username: {{username}}</div>
      <button on:click="onClick">Say Hi</button>
      <div>Response: {{response}}</div>
      <script>
        export default {
          tag: "user-card",
          attrs:{
            username: null
          },
          data: {
            response: "-"
          },
          proto: {
            onClick(){
              this.response = this.host.sayHi();
            }
          },
          ready(){
            console.log("Host method:", this.host.sayHi());
          },
        };
      </script>
    </template>
  </code>
</o-playground>In this example, we create a custom component `user-card`, and access the host component's (page's) method `sayHi` from within the component via `this.host`, achieving interaction between the component and the host.

If the element is not within a component or page module, the value of `host` will be `null`. For example:

<o-playground name="host - no host situation" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          $("#logger").text = String($("#target").host);
        },500);
      </script>
    </template>
  </code>
</o-playground>In this example, the `#target` element is under the body and not inside any component or page, so the value of `$("#target").host` is `null`.