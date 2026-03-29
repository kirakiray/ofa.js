# host



`host` 속성을 사용하면 요소의 호스트 컴포넌트 인스턴스를 가져올 수 있습니다. 이는 컴포넌트 내부에서 자신의 호스트 컴포넌트 데이터와 메서드에 접근할 때 유용합니다.

아래는 `host` 속성을 사용하여 호스트 컴포넌트의 인스턴스를 가져오는 예시입니다:

<o-playground name="host - 호스트 가져오기" style="--editor-height: 700px">
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
      <div>사용자 이름: {{username}}</div>
      <button on:click="onClick">안녕 말하기</button>
      <div>응답: {{response}}</div>
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
            console.log("호스트 메서드:", this.host.sayHi());
          },
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 사용자 지정 컴포넌트 `user-card`를 생성하고, 컴포넌트 내부에서 `this.host`를 통해 숙주 컴포넌트(페이지)의 메서드 `sayHi`에 접근하여 컴포넌트와 숙주 간의 상호 작용을 구현했습니다.

요소가 컴포넌트나 페이지 모듈 내에 있지 않으면, `host` 값은 `null`이 됩니다. 예를 들어:

<o-playground name="host - 호스트 없는 경우" style="--editor-height: 300px">
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
</o-playground>

이 예제에서 `#target` 요소는 body 바로 아래에 있으며 어떤 컴포넌트나 페이지 내부에 있지 않으므로 `$("#target").host` 값은 `null`입니다.