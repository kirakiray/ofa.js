# 사용자 정의 이벤트

ofa.js에서는 내장된 DOM 이벤트 외에도 사용자 정의 이벤트를 생성하고 사용하여 구성 요소 간의 통신을 구현할 수 있습니다. 사용자 정의 이벤트는 구성 요소 개발에서 중요한 메커니즘으로, 이를 통해 구성 요소는 메시지나 상태 변경 사항을 위로 브로드캐스트할 수 있습니다.

## emit 메서드 - 사용자 정의 이벤트 트리거

`emit` 메서드는 사용자 정의 이벤트를 발생시켜 컴포넌트 내부의 상태 변화나 사용자 조작을 외부 리스너에게 알리는 데 사용됩니다.

### 기본 사용법

```javascript
// 간단한 사용자 정의 이벤트 발생시키기
this.emit('custom-event');

// 데이터가 포함된 사용자 정의 이벤트 발생시키기
this.emit('data-changed', {
  data: {
    // 사용자 정의 데이터, 요구 사항에 따라 임의의 구조 가능
    newValue: 100,
    oldValue: 50
  }
});
```

### emit 메서드 매개변수

`emit` 메서드는 두 개의 인자를 받습니다：

1. **이벤트 이름**: 문자열, 트리거할 이벤트 이름을 나타냄
2. **옵션 객체** (선택): 이벤트 구성 옵션을 포함
   - `data`: 전달할 데이터
   - `bubbles`: 불리언, 이벤트가 버블링되는지 제어 (기본값 true)
   - `composed`: 불리언, 이벤트가 Shadow DOM 경계를 통과할 수 있는지 제어
   - `cancelable`: 불리언, 이벤트를 취소할 수 있는지 제어

그러면 상위 요소는 `on` 메서드 [(이벤트 바인딩)](./event-binding.md)를 사용하여 이 사용자 정의 이벤트를 수신할 수 있습니다.

### emit 사용 예시

<o-playground name="emit 사용 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">클릭하여 이벤트 발생</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: '버튼이 클릭되었습니다',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - 이벤트 버블링 메커니즘

`bubbles` 속성은 이벤트가 부모 요소로 위로 버블링되는지 여부를 제어합니다. `true`로 설정하면 이벤트가 DOM 트리를 따라 위로 전파됩니다. 기본값은 `true`입니다. `false`로 설정하면 이벤트는 버블링되지 않습니다.

### 버블링 메커니즘 상세 설명

- **기본 동작**: `emit`을 사용하여 발생시킨 이벤트는 기본적으로 버블링이 활성화됨(`bubbles: true`)
- **버블링 경로**: 이벤트는 트리거된 요소에서 시작하여 상위 요소로 단계적으로 전파됨
- **버블링 방지**: 이벤트 핸들러에서 `event.stopPropagation()`을 호출하여 버블링을 방지할 수 있음

### 버블 정렬 예시

<o-playground name="커스텀 이벤트 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>외부 컨테이너（버블 이벤트 감지）: {{bubbledEventCount}} 회</p>
      <p>내부 컴포넌트（직접 이벤트 감지）: {{directEventCount}} 회</p>
      <p>받은 데이터: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">비버블 이벤트 트리거</button>
      <button on:click="triggerBubblingEvent">버블 이벤트 트리거</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // 비버블 이벤트, 직접 감지자만 캐치
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: '비버블 이벤트 트리거됨', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // 버블 이벤트, 상위 요소로 전파
                this.emit('child-event', {
                  data: { type: 'bubbling', message: '버블 이벤트 트리거됨', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Shadow DOM 경계 침투

`composed` 속성은 이벤트가 Shadow DOM 경계를 통과할 수 있는지를 제어합니다. 이는 Web Components 개발에서 특히 중요하며, 기본값은 `false`입니다.

### 관통 메커니즘 상세 설명

- **Shadow DOM 격리**: 기본적으로 이벤트는 Shadow DOM 경계를 넘을 수 없습니다
- **투과 활성화**: `composed: true`를 설정하면 이벤트가 Shadow DOM 경계를 관통할 수 있습니다
- **사용 시나리오**: 컴포넌트가 호스트 환경에 이벤트를 보낼 때 `composed: true`를 설정해야 합니다

### 관통 예시

<o-playground name="사용자 정의 이벤트 데이터 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>이벤트 수신: {{bubbledEventCount}} 회</p>
      <p>수신된 데이터: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>이벤트 수신: {{bubbledEventCount}} 회</p>
      <p>수신된 데이터: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">비투과 이벤트 트리거</button>
      <button on:click="triggerComposedEvent">투과 이벤트 트리거</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // 비투과 이벤트, 직접 수신자만 캡처 가능
                this.emit('child-event', {
                  data: { type: 'non-composed', message: '비투과 이벤트 트리거', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // 투과 이벤트, Shadow DOM 경계를 넘어 전파됨
                this.emit('child-event', {
                  data: { type: 'composed', message: '투과 이벤트 트리거', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

