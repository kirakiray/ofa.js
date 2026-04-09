# 주입 숙주 스타일

Web Components에서 `slot`의 제약으로 인해 슬롯 내 다중 계층 요소의 스타일을 직접 설정할 수 없습니다. 이 문제를 해결하기 위해, ofa.js는 `<inject-host>` 컴포넌트를 제공하여 컴포넌트 내부에서 호스트 요소로 스타일을 주입할 수 있도록 하여, 슬롯 콘텐츠의 다중 계층 요소 스타일을 제어할 수 있게 합니다.

> 참고, 슬롯 콘텐츠의 스타일을 설정하려면 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 선택기를 우선 사용하는 것이 좋습니다. 요구를 충족할 수 없는 경우에만 `<inject-host>` 컴포넌트를 사용해야 합니다.

## 기본 사용법

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* 직접 하위 1단계 요소의 스타일 설정 */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* 다중 레벨 중첩 스타일도 설정 가능 */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## 사례

다음 예제는 `<inject-host>`를 사용하여 슬롯 내 중첩 요소의 스타일을 설정하는 방법을 보여줍니다. 두 개의 컴포넌트를 생성합니다: 목록 컨테이너 역할을 하는 `user-list` 컴포넌트와 목록 항목을 역할을 하는 `user-list-item` 컴포넌트입니다. `<inject-host>`를 통해 `user-list` 컴포넌트에서 `user-list-item` 및 그 내부 요소의 스타일을 설정할 수 있습니다.

<o-playground name="호스트 스타일 주입" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>장삼</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">이사</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        나이: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

실행 결과에서 볼 수 있습니다:- `user-list-item` 컴포넌트의 배경색은 aqua이며 (`user-list` 컴포넌트의 `<inject-host>`를 통해 설정됨)
- 이름의 글꼴 색상은 빨간색입니다 (`user-list` 컴포넌트의 `<inject-host>`를 통해 `user-list-item .item-name` 스타일 설정)

## 작동 원리

`<inject-host>` 컴포넌트는 내부에 포함된 `<style>` 태그의 내용을 컴포넌트의 호스트 요소에 주입합니다. 이렇게 하면 주입된 스타일 규칙이 컴포넌트 경계를 통과하여 slot 슬롯 내부의 요소에 적용될 수 있습니다.

이 방식을 통해， 다음을 할 수 있습니다：- 슬롯 콘텐츠 내 임의의 깊이에 있는 엘리먼트 스타일 설정
- 전체 선택자 경로를 사용하여 스타일이 대상 엘리먼트에만 적용되도록 보장
- 컴포넌트 스타일의 캡슐화를 유지하면서도 유연한 스타일 침투 구현

## 주의사항

⚠️ **스타일 오염 위험**: 주입된 스타일은 호스트 요소가 위치한 범위에 적용되므로, 다른 컴포넌트 내부의 요소에 영향을 미칠 수 있습니다. 사용 시 반드시 다음 원칙을 준수하세요:

1. **구체적인 선택자 사용**: 가능한 한 완전한 컴포넌트 태그 경로를 사용하고, 너무 포괄적인 선택자의 사용을 피하세요.
2. **네임스페이스 접두사 추가**: 스타일 클래스에 고유한 접두사를 추가하여 다른 컴포넌트와의 충돌 가능성을 줄이세요.
3. **범용 태그 선택자 사용 피하기**: 가능한 한 태그 선택자 대신 클래스명이나 속성 선택자를 사용하세요.
4. **컴포넌트 설계 반성**: `<inject-host>` 사용을 피하기 위해 컴포넌트 설계를 최적화할 수 있는지 고려하세요. 예를 들어, 하위 컴포넌트에서 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 선택자와 함께 사용하는 것이 더 우아한 경우가 많습니다.

```html
<!-- 추천 ✅: 구체적인 선택자 사용 -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- 비추천 ❌: 너무 일반적인 선택자 사용 -->
<inject-host>
    <style>
        .content {  /* 다른 컴포넌트와 충돌하기 쉬움 */
            color: red;
        }
    </style>
</inject-host>
```

### 성능 팁

`<inject-host>`는 호스트 스타일을 다시 주입하게 되어 컴포넌트의 리플로우 또는 리페인트를 일으킬 수 있으므로, 빈번하게 갱신되는 상황에서는 신중히 사용하십시오.  
슬롯 내 첫 번째 레벨 요소에만 스타일을 적용할 경우에는 [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted) 의사 클래스 선택자를 우선 사용하면 침투식 주입으로 인한 추가 렌더링 오버헤드를 피할 수 있어 더 나은 성능을 얻을 수 있습니다.