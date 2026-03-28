# app



`o-app` 안에 있는 요소들, `o-app` 안에 있는 `o-page`의 섀도 노드 안의 요소, 혹은 그 안의 하위 컴포넌트들의 `app` 속성은 모두 이 `o-app`의 요소 인스턴스를 가리킨다.

다음은 `o-app` 내의 요소에서 `app` 속성에 접근하는 방법을 보여주는 예시입니다:


<o-playground name="app - 앱 인스턴스 가져오기" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 앱 홈페이지 주소
    export const home = "./home.html";
    // 앱에서 사용 가능한 메서드
    export const proto = {
      getSomeData(){
        return "Hello ofa.js App Demo";
      }
    };
    // 페이지 전환 애니메이션 설정
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <l-m src="./test-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid gray;
        }
      </style>
      <p>{{val}}</p>
      <test-comp></test-comp>
      <script>
        export default async () => {
          return {
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="test-comp.html">
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 10px;
          border: 1px solid red;
        }
      </style>
      <p>✨ {{val}} ✨</p>
      <script>
        export default async () => {
          return {
            tag: "test-comp",
            data: {
              val: "-",
            },
            attached(){
              this.val = this.app.getSomeData();
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

