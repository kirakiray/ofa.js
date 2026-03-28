# 비명시적 컴포넌트

ofa.js는 두 가지 비명시적 컴포넌트를 내장하고 있습니다:

* 조건부 렌더링 컴포넌트: `x-if`, `x-else-if`, `x-else`
* 채우기 컴포넌트: `x-fill`

이 두 컴포넌트의 기능은 각각 `o-if` 및 `o-fill` 컴포넌트와 동일하지만, 자체적으로는 실제로 DOM에 렌더링되지 않고 내부 요소를 해당 영역에 직접 렌더링합니다.

예를 들어:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- 스타일이 빨간색이 아닙니다. 왜냐하면 o-if 컴포넌트 자체가 DOM에 존재하기 때문입니다. -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- 스타일이 빨간색입니다. 왜냐하면 x-if 컴포넌트는 DOM에 렌더링되지 않기 때문입니다. -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="비명시적 컴포넌트" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* 자식 레벨의 .item 요소를 빨간색으로 선택 */
            color:red;
        }
        /* o-if 컴포넌트 내부의 .item 요소를 선택해야 함 */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- o-if 컴포넌트가 DOM에 존재하므로 스타일이 빨간색이 아님 -->
                <div class="item">빨간색으로 표시되지 않음</div>
            </o-if>
            <x-if :value="true">
                <!-- x-if 컴포넌트는 DOM에 렌더링되지 않으므로 스타일이 빨간색임 -->
                <div class="item">빨간색으로 표시됨</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if 조건 렌더링 컴포넌트

`x-if` 와 [o-if](./conditional-rendering.md) 의 기능은 완전히 동일하며, 조건식의 참/거짓 값에 따라 콘텐츠를 렌더링할지 결정하는 데 사용됩니다. 차이점은 `x-if` 자체는 DOM 요소로 존재하지 않으며, 그 내부 콘텐츠가 부모 컨테이너에 직접 렌더링된다는 점입니다.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>돌아오신 것을 환영합니다, 사용자님!</p>
    </x-if>
</div>
```

`x-if`는 `x-else-if`와 `x-else`와 함께 사용할 수도 있습니다:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>관리자 패널</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>사용자 센터</p>
    </x-else-if>
    <x-else>
        <p>로그인하세요</p>
    </x-else>
</div>
```

## x-fill 채우기 컴포넌트

`x-fill`는 [o-fill](./list-rendering.md)과 완전히 동일한 기능을 가지며, 배열 데이터를 여러 개의 DOM 요소로 렌더링하는 데 사용됩니다. `x-if`와 마찬가지로, `x-fill` 자체는 DOM에 렌더링되지 않으며, 내부 템플릿은 상위 컨테이너에 직접 렌더링됩니다.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

명명된 템플릿 사용 예시：

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## 성능 설명

기능적 차이 외에도, 비명시적 컴포넌트의 렌더링 성능은 명시적 컴포넌트(`o-if`, `o-fill`)보다 **훨씬 떨어집니다**. 비명시적 컴포넌트는 실제로 DOM에 렌더링되지 않으며, 내부 요소의 위치 지정과 업데이트를 처리하기 위해 추가적인 시뮬레이션 렌더링 로직이 필요하기 때문입니다.

또한, 비명시적 컴포넌트는 일부 발견하기 어려운 버그를引发할 수 있습니다. 이러한 컴포넌트는 실제로 DOM에 들어가지 않기 때문에, DOM 구조에 의존하는 작업(예: 이벤트 바인딩, 스타일 계산 또는 서드파티 라이브러리 쿼리)은 작동하지 않거나 비정상적으로 동작할 수 있습니다.

따라서, **명시적 컴포넌트**(`o-if`, `o-else-if`, `o-else`, `o-fill`)를 우선 사용하고, 특정 상황에서만 비명시적 컴포넌트를 사용하는 것을 권장합니다.

## 사용 시나리오

비명시적 컴포넌트는 성능이 떨어지지만, 다음과 같은 상황에서 사용될 수 있습니다:

1. **추가 DOM 계층 구조 방지**: `o-if` 또는 `o-fill` 요소가 DOM 구조의 일부가 되지 않도록 할 때
2. **스타일 상속**: 내부 요소가 중간 컴포넌트 요소의 영향을 받지 않고 부모 컨테이너의 스타일을 직접 상속받아야 할 때
3. **CSS 선택자 제한**: 부모의 직접 자식 선택자(예: `.container > .item`)를 사용하여 스타일을 정밀하게 제어해야 하지만 중간에 추가적인 래퍼 요소가 없기를 원할 때