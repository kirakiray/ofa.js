# 클래스와 스타일 바인딩

ofa.js에서 동적 클래스 이름, 스타일 및 속성 바인딩을 통해 유연한 UI 상태 관리를 구현할 수 있습니다. 이를 통해 인터페이스는 데이터 변화에 따라 자동으로 외관을 조정할 수 있습니다.

## 클래스 바인딩

클래스 바인딩을 통해 데이터 상태에 따라 CSS 클래스를 동적으로 추가하거나 제거할 수 있습니다. `class:className="booleanExpression"` 구문을 사용하여 특정 클래스를 바인딩할 수 있습니다.

`booleanExpression`이 `true`일 때 클래스명이 요소에 추가되고, `false`일 때 클래스명이 제거됩니다.

### 기본 클래스 바인딩

<o-playground name="기본 클래스 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">표시 전환</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "ofa.js 데모 코드 인사",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 여러 클래스 바인딩

여러 클래스를 동시에 바인딩하여 요소가 다양한 조건에 따라 다른 외관 상태를 가질 수 있습니다.

<o-playground name="여러 클래스 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 스타일 바인딩

스타일 바인딩을 통해 인라인 스타일 값을 직접 설정하고 동적으로 업데이트할 수 있습니다. ofa.js는 두 가지 스타일 바인딩 방식을 제공합니다:

### 단일 스타일 속성 바인딩

`:style.propertyName` 구문을 사용하여 특정 스타일 속성을 바인딩합니다.

<o-playground name="단일 스타일 속성 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Toggle Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 다양한 스타일 속성 바인딩

여러 스타일 속성을 한 번에 바인딩할 수도 있습니다:

<o-playground name="다양한 스타일 속성 바인딩" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        Dynamic Styling Example
      </p>
      <button on:click="changeStyles">Change Styles</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 속성 바인딩

클래스와 스타일 바인딩 외에도 다른 HTML 속성을 동적으로 바인딩할 수 있습니다. ofa.js는 속성 바인딩을 위해 `attr:attributeName` 문법을 사용합니다.

### 기본 속성 바인딩

<o-playground name="기본 속성 바인딩" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">색상 변경</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "이것은 툴팁 메시지입니다",
              val: "제목을 보려면 마우스를 올려주세요",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 부울 속성 처리

부울 타입의 속성(`disabled`, `hidden` 등)의 경우, ofa.js는 바인딩된 값의 참/거짓 여부에 따라 해당 속성을 추가할지 결정합니다.

<o-playground name="불린 속성 처리" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 스타일 태그 내의 데이터 함수

스타일에서 `data(xxx)`를 사용하여 컴포넌트 데이터를 바인딩할 수 있습니다. 이는 컴포넌트 데이터에 따라 동적으로 스타일을 변경해야 하는场景에 매우 적합합니다.

<o-playground name="스타일 태그 내의 데이터 함수" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p:hover{
          color:red;
        }
      </style>
      <style>
        p {
          font-size: data(size);
          color:green;
          transition: all data(time)s ease;
        }
      </style>
      FontSize: <input type="number" sync:value="size" placeholder="양방향 바인딩 입력란입니다" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="양방향 바인딩 입력란입니다" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

`style` 내의 `data(xxx)`는 원칙적으로 전체 style의 내용을 대체하므로, data와 관련된 스타일만 style 내에 작성하고 data가 필요 없는 것은 다른 style에 배치하는 것이 성능상 더 좋습니다.

```html
<!-- ❌ data(xxx)가 없는 p:hover도 새로고침됨 -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ data(xxx)만 있는 스타일이 다시 렌더링됩니다 -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```