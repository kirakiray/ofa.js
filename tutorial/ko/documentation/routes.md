# 싱글 페이지 애플리케이션

싱글 페이지 애플리케이션은 `o-app` 컴포넌트를 브라우저 주소 표시줄에 바인딩하여 웹 페이지 URL과 애플리케이션 내부의 페이지 경로를 동기화합니다. 싱글 페이지 애플리케이션을 활성화하면:

- 웹페이지를 새로 고침하면 현재의 라우팅 상태를 유지할 수 있습니다
- 주소창의 URL을 복사하여 다른 브라우저나 탭에서 열면, 동일하게 애플리케이션 상태를 복원할 수 있습니다
- 브라우저의 앞으로/뒤로 버튼을 정상적으로 사용할 수 있습니다

## 기본 사용법

공식 `o-router` 컴포넌트로 `o-app` 컴포넌트를 감싸면 단일 페이지 애플리케이션을 구현할 수 있습니다.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>router test</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## fix-body 속성

`fix-body` 속성을 추가하면 `o-router`가 자동으로 `html`과 `body`의 스타일을 재설정하여 기본 margin과 padding을 제거합니다.

```html
<o-router fix-body>
  <o-app src="./app-config.js"></o-app>
</o-router>
```

이것은 다음 시나리오에서 특히 유용합니다：- `o-app`이 뷰포트를 완전히 채워야 합니다
- 애플리케이션이 페이지의 유일한 콘텐츠일 때

## 예시

<o-playground name="싱글 페이지 애플리케이션 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
      <o-router fix-body>
        <o-app src="./app-config.js"></o-app>
      </o-router>
    </template>
  </code>
  <code path="app-config.js">
    // 애플리케이션 홈페이지 주소
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
    export const loading = () => {
  const loadingEl = $({
    tag: "div",
    css: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1000,
    },
    html: `
      <div style="transition: all 10s cubic-bezier(0, 0, 0.22, 0.84) 0s; height: 2px;width: 0;background-color: rgb(0, 161, 46);"></div>
    `,
  });
  setTimeout(() => (loadingEl[0].style.width = "98%"));
  loadingEl.remove = () => {
    loadingEl[0].style["transition-duration"] = "0.1s";
    loadingEl[0].style.width = "100%";
    setTimeout(() => {
      \$.fn.remove.call(loadingEl);
    }, 200);
  };
  return loadingEl;
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
      <a href="./about.html" olink>About으로 이동</a>
      <br>
      <br>
      <button on:click="gotoAbout">About으로 이동 버튼</button>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
            proto:{
                gotoAbout(){
                    this.goto("./about.html");
                }
            }
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
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
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
</o-playground>

## 작동 원리

싱글 페이지 애플리케이션은 브라우저의 Hash 모드를 기반으로 구현됩니다:

1. 앱 내에서 페이지 전환이 발생할 때, `o-router`는 주소 표시줄의 해시 값(예: `#/about.html`)을 자동으로 업데이트합니다.
2. 사용자가 페이지를 새로고침하거나 URL로 접근할 때, `o-router`는 해시 값을 읽어 해당 페이지를 로드합니다.
3. 브라우저의 앞/뒤 버튼은 해시 변경을 트리거하여 앱의 페이지 탐색을 제어합니다.

## URL 변경 예시

애플리케이션에 `home.html`과 `about.html` 두 개의 페이지가 있다고 가정합니다:

| 사용자 작업 | 주소 표시줄 변화 |
|---------|-----------|
| 앱 열기 | `index.html` → `index.html#/home.html` |
| 소개 페이지로 이동 | `index.html#/home.html` → `index.html#/about.html` |
| 뒤로 가기 클릭 | `index.html#/about.html` → `index.html#/home.html` |
| 페이지 새로고침 | 현재 hash 유지 |## 사용 제한

- 단일 페이지 애플리케이션은 **하나**의 `o-app` 컴포넌트와만 함께 사용할 수 있습니다