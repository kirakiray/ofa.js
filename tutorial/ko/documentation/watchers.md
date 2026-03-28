# 리스너

감시자(Watcher)는 ofa.js에서 데이터 변경을 감지하고 해당 로직을 실행하는 기능입니다. 반응형 데이터가 변경되면 감시자가 자동으로 콜백 함수를 트리거하여 데이터 변환, 부작용 작업 또는 비동기 처리 등의 작업을 수행할 수 있게 해줍니다.

## 기본 사용법

리스너는 컴포넌트의 `watch` 객체에 정의되며, 키 이름은 감시할 데이터 속성 이름에 해당하고, 값은 데이터가 변경될 때 실행되는 콜백 함수입니다.

<o-playground name="watchers - 기본 사용법" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 콜백 함수 매개변수

리스너 콜백 함수는 두 개의 매개변수를 수신합니다:- `newValue`：변화 이후의 새로운 값
- `{watchers}`：현재 컴포넌트의 모든 감시자 객체

데이터 변경 후 디바운스 처리를 먼저 수행한 다음 `watch`의 콜백을 실행합니다; `watchers` 매개변수는 이번 디바운스 주기 내에 병합된 모든 변경 집합입니다.

`watch`의 함수는 컴포넌트 초기화 완료 후 즉시 호출되어 데이터 감시를 설정하는 데 사용됩니다. watchers의 길이로 최초 호출인지를 구분할 수 있습니다.

<o-playground name="watchers - 콜백 매개변수" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>이름: {{name}}</p>
      <p>나이: {{age}}</p>
      <input sync:value="name" placeholder="이름 입력" />
      <input sync:value="age" type="number" placeholder="나이 입력" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "장삼",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 하나 가져오기
                this.log += `속성 "${watcher.name}"이(가) "${watcher.oldValue}"에서 "${watcher.value}"로 변경됨\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 하나 가져오기
                this.log += `속성 "${watcher.name}"이(가) "${watcher.oldValue}"에서 "${watcher.value}"로 변경됨\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 깊은 감시

객체나 배열 타입의 중첩된 데이터에 대해서는 watch 내부에서 자동으로 깊은 감시를 수행합니다.

<o-playground name="watchers - 깊은 감시" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>사용자 정보:</p>
        <p>이름: {{user.name}}</p>
        <p>나이: {{user.age}}</p>
        <p>취미: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">이름 수정</button>
        <button on:click="updateAge">나이 수정</button>
        <button on:click="addHobby">취미 추가</button>
        <button on:click="updateHobby">취미 수정</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "张三",
                age: 25,
                hobbies: ["篮球", "足球"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 하나 가져오기
                console.log("수정: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `값 수정-> 속성 "${watcher.name}"이(가) "${watcher.oldValue}"에서 "${watcher.value}"로 변경됨 <br>`;
                }else{
                  this.log += `메서드 실행${watcher.type}-> 함수명 "${watcher.name}"  인자 "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "李四";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("游泳");
              },
              updateHobby() {
                this.user.hobbies[0] = "羽毛球";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 다중 데이터 소스 모니터링

여러 데이터의 변화를 동시에 감시하고, 콜백 함수에서 여러 데이터의 변화에 따라 해당 로직을 실행할 수 있습니다.

<o-playground name="watchers - 다중 데이터 소스" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <p>너비: {{rectWidth}}</p>
      <p>높이: {{rectHeight}}</p>
      <p>면적: {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="너비" />
      <input sync:value="rectHeight" type="number" placeholder="높이" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              // "rectWidth,rectHeight"(){
              ["rectWidth,rectHeight"](){
                this.area = (this.rectWidth || 0) * (this.rectheight || 0);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 실제 적용 시나리오

### 1. 폼 검증

<o-playground name="watchers - 폼 검증" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="사용자명（3-10자）" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="이메일" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "사용자명은 3-10자여야 합니다";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "유효한 이메일 주소를 입력하세요";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. 테마 설정

<o-playground name="watchers - 테마 설정" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <p>설정: {{settings.theme}}</p>
      <p>저장 상태: {{saveStatus}}</p>
      <button on:click="setLight">라이트 테마</button>
      <button on:click="setDark">다크 테마</button>
      <button on:click="resetSettings">초기화</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "저장됨",
            },
            watch: {
              settings(){
                  this.saveStatus = "저장 중...";
                  setTimeout(() => {
                    this.saveStatus = "저장됨";
                    console.log("설정이 저장되었습니다:", this.settings);
                  }, 500);
              }
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

- **감시 중인 데이터 수정 피하기**: 감시자 콜백 안에서 감시 대상 데이터를 수정하면 무한 루프가 발생할 수 있습니다. 수정이 필요할 경우 적절한 조건 판단이 있는지 반드시 확인하십시오.
- **계산된 속성 사용 권장**: 여러 데이터의 변화에 따라 새로운 값을 계산해야 한다면 감시자보다는 [계산된 속성](./computed-properties.md)을 사용하는 것이 좋습니다.