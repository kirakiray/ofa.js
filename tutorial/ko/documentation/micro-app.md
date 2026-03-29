# 마이크로 앱

`o-app`을 사용하여 애플리케이션화를 수행하면, 이 태그는 하나의 마이크로 애플리케이션을 나타내며, `app-config.js` 설정 파일을 로드합니다. 이 파일은 애플리케이션의 홈페이지 주소와 페이지 전환 애니메이션 설정을 정의합니다.

```html
<o-app src="./app-config.js"></o-app>
```

```javascript
// app-config.js
// 애플리케이션 홈 페이지 주소
export const home = "./home.html";

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
```

<o-playground name="마이크로 앱 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 앱 홈 주소
    export const home = "./home.html";
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
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html?id=10010" olink>Go to About (10010)</a>
      <br>
      <br>
      <a href="./about.html?id=10030" olink>Go to About (10030)</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p>{{val}}</p>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async ({query}) => {
          return {
            data: {
              val: `Hello ofa.js App Demo (from ${query.id})`,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## home - 홈페이지 주소

애플리케이션 시작 시 로드할 홈 모듈 경로를 지정합니다. 상대 경로 및 절대 경로를 지원합니다.

```javascript
export const home = "./pages/home.html";
```

## pageAnime - 페이지 전환 애니메이션

페이지 전환 시의 전환 애니메이션 효과를 제어하며, 세 가지 상태를 포함합니다.

| 상태 | 설명 |
|------|------|
| `current` | 현재 페이지 애니메이션이 끝난 후의 스타일 |
| `next` | 새 페이지가 진입할 때의 시작 스타일 |
| `previous` | 이전 페이지가 떠날 때의 목표 스타일 |```javascript
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
```

## 파라미터 전달 방식

`o-app`에서 페이지 이동은 URL Query를 통해 매개변수를 전달하는 것을 지원하며, 대상 페이지는 모듈 함수의 `query` 매개변수를 통해 수신합니다.

## 페이지 탐색

o-app 내에서 각 페이지 모듈은 `olink` 속성이 있는 `<a>` 태그를 사용하여 페이지 전환을 할 수 있습니다. 이 태그는 전환 애니메이션과 함께 애플리케이션의 라우팅 전환을 트리거하며 전체 페이지를 새로고침하지 않습니다.

```html
<a href="./about.html" olink>소개 페이지로 이동</a>
```

페이지 컴포넌트에서 `back()` 메서드를 사용하여 이전 페이지로 돌아갈 수 있습니다：

```html
<template page>
  <button on:click="back()">돌아가기</button>
</template>
```