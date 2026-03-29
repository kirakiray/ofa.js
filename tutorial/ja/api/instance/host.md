# host



`host` 属性を使用すると、要素のホストコンポーネントインスタンスを取得できます。これは、コンポーネント内部からそのホストコンポーネントのデータやメソッドにアクセスするのに非常に便利です。

以下は、`host` 属性を使用してホストコンポーネントのインスタンスを取得する方法を示す例です：

<o-playground name="host - ホストを取得" style="--editor-height: 700px">
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
</o-playground>

この例では、カスタムコンポーネント `user-card` を作成し、コンポーネント内部で `this.host` を通じてホストコンポーネント（ページ）のメソッド `sayHi` にアクセスすることで、コンポーネントとホスト間の相互作用を実現しています。

要素がコンポーネントまたはページモジュール内にない場合、`host` の値は `null` になります。例：

<o-playground name="host - ホストなしの場合" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          私はターゲットです
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
</o-playground>

この例では、`#target` 要素は body の下にあり、どのコンポーネントやページ内にもないため、`$("#target").host` の値は `null` になります。