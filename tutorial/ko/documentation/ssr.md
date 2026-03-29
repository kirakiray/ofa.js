# SSR와 동형 렌더링

> SSR이 무엇인지 모르신다면, 현재는 필요하지 않다는 뜻이므로 이 장을 건너뛰고 나중에 필요할 때 다시 돌아와 학습하셔도 됩니다.

## 동일 구조 렌더링

CSR의 부드러운 사용자 경험, 더 나은 머신 크롤러 인식(SEO), 그리고 더 자유로운 백엔드 개발 언어 선택을 동시에 유지하기 위해, ofa.js는 독특한 동형 렌더링(Symphony Client-Server Rendering) 모드를 제공합니다.

> CSR / SSR / SSG의 구체적인 정의와 차이점을 알고 싶다면, 이 글의 마지막 장을 직접 읽어보세요.

동일 구조 렌더링의 핵심 개념은:- 서버 측에서 초기 페이지 콘텐츠를 렌더링하여 SEO와 첫 화면 로딩 속도 보장
- 클라이언트에서 라우팅 처리를 이어받아 CSR의 부드러운 사용자 경험 유지
- 모든 서버 환경에 적용 가능, 진정한 동형 렌더링 구현

### 동일 구조 렌더링 구현 원리

ofa.js의 동형 렌더링 모드는 다음 메커니즘을 기반으로 합니다:

1. 서버 측에서 공통 실행 구조를 포함한 완전한 HTML 페이지 생성
2. 클라이언트가 CSR 실행 엔진 로드
3. 현재 실행 환경을 자동으로 식별하여 렌더링 전략 결정

### 동일 구조 렌더링 코드 구조

**원본 CSR 페이지 모듈:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>나는 Page입니다</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**동형 렌더링 캡슐화 후의 완전한 페이지:**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 페이지 모듈 콘텐츠 삽입 위치 ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

따라서 개발 언어(Go, Java, PHP, Nodejs, Python 등)나 백엔드 템플릿 렌더링 엔진(Go의 `html/template`, PHP의 Smarty/Twig/Blade 등)을 아무거나 선택해, ofa.js의 동형 렌더링 코드 구조를 템플릿에 삽입하면 SSR을 구현할 수 있습니다.

* [Nodejs SSR 예제](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR 예제](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR 예제](https://github.com/ofajs/ofa.js/tree/main/test/ssr-case/go)

### 동일 구조 렌더링 템플릿 구조

동형 렌더링 모드를 구현하려면 서버 측에서 다음과 같은 범용 템플릿 구조를 사용하면 됩니다:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>페이지 제목</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 동적으로 해당 페이지 모듈 콘텐츠 삽입 -->
  </o-app>
</body>

</html>
```

**주의:** 서버에서 반환하는 HTML은 올바른 HTTP 헤더를 설정해야 합니다: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs`는 ofa.js가 제공하는 동형 렌더링 엔진으로, 현재 페이지의 실행 상태에 따라 렌더링 전략을 자동으로 판단하여 어떤 환경에서도 최상의 사용자 경험을 제공합니다.

마찬가지로, SSG도 이 구조를 적용해 정적 사이트 생성을 구현할 수 있다.

## ofa.js와 SSR 및 기타 프론트엔드 프레임워크의 차이점

ofa.js의 Symphony Client-Server Rendering(이하 SCSR)은 본질적으로도 SSR 방식이다.

Vue, React, Angular와 같은 기존 프론트엔드 프레임워크의 SSR 솔루션과 비교했을 때, ofa.js의 가장 큰 장점은 **Node.js에 강제로 바인딩할 필요가 없다**는 점입니다. 이는 PHP의 Smarty, Python의 Jinja2, Java의 Thymeleaf 등 모든 백엔드 템플릿 렌더링 엔진이 ofa.js를 쉽게 통합하여 SSR을 구현할 수 있음을 의미합니다.

## 웹페이지 렌더링 방식 개요

현대 웹 애플리케이션에는 주로 네 가지 렌더링 방식이 있습니다: 전통적인 서버 측 템플릿 엔진 렌더링, CSR(Client Side Rendering, 클라이언트 측 렌더링), SSR(Server Side Rendering, 서버 측 렌더링)과 SSG(Static Site Generation, 정적 사이트 생성). 각 방식은 각각의 장점과 적용 시나리오를 가지고 있습니다.

### 전통적인 서버 사이드 템플릿 엔진 렌더링

수많은 Web 제품에서 서버 측 템플릿 엔진은 여전히 가장 주요한 페이지 렌더링 수단이다. Go, PHP 등 백엔드 언어는 내장 또는 서드파티 템플릿 엔진(예: Go의 `html/template`, PHP의 Smarty/Twig/Blade 등)을 이용해 동적 데이터를 HTML 템플릿에 주입하고, 완전한 HTML 페이지를 한 번에 생성하여 클라이언트에 반환한다.

**장점：**- SEO 친화적, 첫 화면 로딩 속도 빠름
- 서버 측 제어, 보안성 높음
- 팀 기술 스택 요구 수준 낮음, 백엔드 개발자만으로도 독립 개발 가능

**단점:**- 사용자 경험이 떨어지며, 상호작용할 때마다 페이지 새로고침이 필요함
- 서버 쪽 부담이 큼
- 프론트엔드와 백엔드의 결합도가 높아 업무 분담 및 협업에 불리함

### CSR（클라이언트 사이드 렌더링）

CSR 모드에서는 페이지 콘텐츠가 브라우저 측 JavaScript에 의해 완전히 렌더링되며, ofa.js의 [싱글 페이지 애플리케이션](./routes.md)이 전형적인 CSR 구현입니다. 이 방식은 부드러운 사용자 경험을 제공하며, 페이지 이동 없이 모든 상호작용을 완료할 수 있습니다. React나 Vue와 이에 대응하는 라우팅 라이브러리(예: React Router 또는 Vue Router)를 함께 사용하여 개발한 싱글 페이지 애플리케이션(SPA)은 모두 전형적인 CSR 구현입니다.

**장점：**- 사용자 경험이 원활하며 페이지 전환이 새로고침 없이 이루어짐
- 클라이언트 처리 능력이 강력하며 응답이 신속함

**단점:**- SEO에 불리하고, 검색 엔진이 콘텐츠를 색인하기 어려움

### SSR（서버 사이드 렌더링）

CSR의 원활한 경험을 유지하면서 서버에서 페이지를 실시간으로 렌더링하도록 변경: 사용자가 요청을 보낼 때 서버가 즉시 완전한 HTML을 생성하여 반환하여 진정한 서버 측 렌더링을 구현합니다.

**장점：**- SEO 친화적, 첫 화면 로딩 빠름
- 동적 콘텐츠 지원

**단점:**- 서버 부담이 큼
- 일반적으로 Node.js 환경을 런타임으로 필요로 하거나, 적어도 한 단계의 Node.js 미들웨어가 필요함
- 여전히 이후 클라이언트 활성화를 통해 완전한 상호작용이 가능해짐

### SSG(정적 사이트 생성)

빌드 단계에서 모든 페이지를 정적 HTML 파일로 사전 렌더링하고, 배포 후 서버에서 사용자에게 직접 반환할 수 있습니다.

**장점：**- 최초 로딩 속도가 빠르고 SEO에 친화적
- 서버 부하가 낮고 성능이 안정적
- 보안성이 높음

**단점:**- 동적 콘텐츠 업데이트 어려움
- 빌드 시간이 페이지 수 증가에 따라 증가