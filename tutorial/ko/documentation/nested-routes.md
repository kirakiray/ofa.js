# 중첩 페이지/라우트

ofa.js에서 중첩 페이지(중첩 라우트라고도 함)는 강력한 기능으로, 부모-자식 계층 관계를 가진 페이지 구조를 만들 수 있게 해줍니다. 부모 페이지는 레이아웃 컨테이너 역할을 하며, `<slot>` 슬롯을 통해 자식 페이지의 콘텐츠를 렌더링합니다.

## 기본 개념

- **부모 페이지(Layout)** : 레이아웃 컨테이너 역할을 하는 페이지로, 네비게이션 바, 사이드바 등 공통 UI 요소를 포함합니다
- **자식 페이지** : 구체적인 비즈니스 페이지 콘텐츠로, 부모 페이지의 `<slot>` 슬롯 위치에 렌더링됩니다

## 상위 페이지 작성 방법

부모 페이지는 `<slot></slot>` 태그를 사용하여 자식 페이지에 렌더링할 위치를 예약해야 합니다.

```html
<!-- layout.html -->
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
    ...
  </style>
  ...
  <div class="content">
    <slot></slot>
  </div>
  ...
</template>
```

## 하위 페이지의 작성법

하위 페이지는 `parent` 속성을 내보내 상위 페이지 경로를 지정합니다.

```html
<template page>
  <style>
    :host {
      display: block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <p>{{val}}</p>
  <script>
    export const parent = 'layout.html'; // ⚠️ 关键代码

    export default async () => {
      return {
        data: {
          val: "Hello ofa.js Demo Code",
        },
      };
    };
  </script>
</template>
```

## 중첩 페이지 예시

다음은 루트 레이아웃, 부모 페이지 및 자식 페이지를 포함하는 완전한 중첩 라우팅 예시입니다:

<o-playground name="중첩 페이지 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 앱 홈페이지 주소
    export const home = "./sub-page01.html";
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
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>페이지1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>페이지2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>나는 하위 페이지 1</h1>
      <p>현재 라우트：{{src}}</p>
      <a href="./sub-page02.html" olink>페이지2로 이동</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>나는 하위 페이지 2</h1>
      <p>현재 라우트：{{src}}</p>
      <a href="./sub-page01.html" olink>페이지1로 이동</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 부모 페이지의 라우트 감시

부모 페이지는 `routerChange` 라이프사이클 훅을 통해 라우팅 변경을 감지할 수 있으며, 이는 현재 라우트에 따라 네비게이션 상태를 업데이트해야 할 때 매우 유용합니다.

```html
<template page>
  ...
  <script>
    export default () => {
      return {
        data: {
          active1: false,
          active2: false,
        },
        routerChange() {
          this.refreshActive();
        },
        ready() {
          this.refreshActive();
        },
        proto: {
          refreshActive() {
            const { current } = this.app;
            const path = new URL(current.src).pathname;
            
            this.active1 = path.includes('page1');
            this.active2 = path.includes('page2');
          },
        },
      };
    };
  </script>
</template>
```

## 주의사항

- `parent` 속성값은 상대 경로(예: `./layout.html`) 또는 절대 경로(예: `/pages/layout.html`)일 수 있습니다.
- 부모 페이지는 반드시 `<slot></slot>` 태그를 포함해야 하며, 그렇지 않으면 자식 페이지 콘텐츠가 표시되지 않습니다.
- 부모 페이지의 스타일이 자식 페이지에 상속되며, 자식 페이지도 자체 스타일을 정의할 수 있습니다.
- `routerChange` 훅을 사용하면 라우트 변경을 감지하여 내비게이션 하이라이트 등의 기능을 구현할 수 있습니다.

## 다단계 중첩

부모 페이지는 자체적으로 또 다른 부모 페이지를 가질 수 있어, 다단계 중첩 구조를 형성한다.

```html
<!-- 하위 페이지 -->
<template page>
  <p>하위 페이지 내용</p>
  <script>
    export const parent = './parent.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

```html
<!-- 부모 페이지 -->
<template page>
  <div class="layout">
    <nav>내비게이션 바</nav>
    <slot></slot>
  </div>
  <script>
    export const parent = './root-layout.html';
    export default () => {
      return { data: {} };
    };
  </script>
</template>
```

## 다단 중첩 예시

<o-playground name="중첩 라우트 완전한 예제" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js" style="height:96%;"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 애플리케이션 홈 페이지 주소
    export const home = "./sub-page01.html";
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
  <code path="root-layout.html">
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
          border: 1px dashed gray;
        }
        .root {
          height: 100%;
          word-break: break-word;
          padding: 10px;
        }
      </style>
      <div style="text-align: center;font-weight: bold;">루트 레이아웃</div>
      <div class="root">
        <slot></slot>
      </div>
      <script>
        export default () => {
          return { data: {} };
        };
      </script>
    </template>
  </code>
  <code path="layout.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px dashed green;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 200px;
        }
        header {
          padding: 10px;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        nav li {
          display: inline-block;
          padding: 5px 10px;
          margin-right: 20px;
          border-radius: 4px;
        }
        nav li.active {
          background-color: rgb(158, 4, 4);
        }
        nav li a {
          text-decoration: none;
        }
        .main {
          flex: 1;
          padding: 20px;
        }
      </style>
      <div class="container">
        <header>
          <nav>
            <ul>
              <li class:active="active1">
                <a href="./sub-page01.html" olink>페이지 1</a>
              </li>
              <li class:active="active2">
                <a href="./sub-page02.html" olink>페이지 2</a>
              </li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <slot></slot>
        </div>
      </div>
      <script>
        export const parent = "./root-layout.html";
        export default () => {
          return {
            data: {
              active1: false,
              active2: false,
            },
            routerChange() {
              this.refreshActive();
            },
            ready() {
              this.refreshActive();
            },
            proto: {
              refreshActive() {
                const { current } = this.app;
                const path = new URL(current.src).pathname;
                this.active1 = path.includes('sub-page01');
                this.active2 = path.includes('sub-page02');
              },
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page01.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid pink;
          padding: 10px;
        }
      </style>
      <h1>하위 페이지 1</h1>
      <p>현재 라우트：{{src}}</p>
      <a href="./sub-page02.html" olink>페이지 2로 이동</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="sub-page02.html">
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h1>하위 페이지 2</h1>
      <p>현재 라우트：{{src}}</p>
      <a href="./sub-page01.html" olink>페이지 1로 이동</a>
      <script>
        export const parent = "./layout.html";
        export default async () => {
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
</o-playground>

