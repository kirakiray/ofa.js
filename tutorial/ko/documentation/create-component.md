# 컴포넌트 생성

ofa.js에서 컴포넌트는 페이지 재사용과 모듈화의 핵심 메커니즘입니다. 컴포넌트는 본질적으로 사용자 정의 Web Component로, 템플릿, 스타일 및 로직을 정의하여 재사용 가능한 UI 요소를 생성할 수 있습니다.

## 컴포넌트의 기본 구조

페이지 모듈과 달리, 컴포넌트 모듈의 `<template>` 요소는 `component` 속성을 사용하며, `tag` 속성을 선언하여 컴포넌트 태그 이름을 지정합니다.

컴포넌트를 사용해야 하는 위치에서 `l-m` 태그를 통해 컴포넌트 모듈을 비동기적으로 불러오면 시스템이 자동으로 등록을 완료합니다. 이후에는 일반 HTML 태그처럼 해당 컴포넌트를 바로 사용할 수 있습니다.

<o-playground name="컴포넌트 기본 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS 컴포넌트 예제",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 컴포넌트 핵심 개념

### tag - 컴포넌트 태그 이름

`tag`는 컴포넌트의 태그 이름으로, **반드시 컴포넌트 사용 시의 태그 이름과 일치해야 합니다**. 예를 들어, 컴포넌트의 `tag`를 `"demo-comp"`로 정의했다면, HTML에서 사용할 때는 반드시 `<demo-comp></demo-comp>`라고 작성해야 합니다.

### 컴포넌트 모듈 참조

`l-m` 태그를 통해 컴포넌트 모듈을 가져오면, 컴포넌트 모듈이 자동으로 컴포넌트를 등록합니다. 이는 `script` 태그를 사용하여 스크립트를 가져오는 것과 유사하지만, `l-m`은 컴포넌트 모듈의 로드 및 등록 전용입니다.

> 주의: `l-m` 참조 태그는 **비동기 참조**로, 페이지 로드 시 필요에 따라 컴포넌트를 로드하는 데 적합합니다.

## 동기화 참조 컴포넌트

특정 시나리오에서는 컴포넌트를 동기적으로 로드해야 할 수도 있습니다(예: 컴포넌트가 사용되기 전에 등록이 완료되도록 보장). 이때 `load` 메서드와 `await` 키워드를 함께 사용하여 동기 참조를 구현할 수 있습니다.

컴포넌트 모듈과 페이지 모듈에서는 개발자가 필요한 리소스를 동기적으로 로드할 수 있도록 `load` 함수가 자동으로 주입됩니다.

<o-playground name="동기식 컴포넌트 참조 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS 컴포넌트 예제",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 비동기 참조 vs 동기 참조

| 인용 방식 | 키워드 | 특징 |
|---------|-------|------|
| 비동기 인용 | `l-m` 태그 | 비차단 로딩, 필요에 따른 컴포넌트 로딩에 적합 |
| 동기 인용 | `load` 메서드와 `await` 키워드 조합 | 차단 로딩, 컴포넌트 사용 전 등록 보장 |`l-m` 태그 참조와 `load` 메서드는 모두 컴포넌트 모듈을 로드할 수 있으며, 일반적인 상황에서는 비동기 방식으로 컴포넌트를 참조하는 `l-m` 태그 사용을 권장하여 논블로킹 로딩과 온디맨드 로딩을 구현합니다.