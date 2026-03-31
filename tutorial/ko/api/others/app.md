# o-app 컴포넌트

`o-app`는 ofa.js의 핵심 구성 요소 중 하나로, 전체 애플리케이션의 설정과 관리에 사용됩니다. 다음은 app의 주요 속성과 메서드입니다:

## src



`src` 속성은 애플리케이션 매개변수 구성 모듈의 구체적인 주소를 지정하는 데 사용됩니다.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



`current` 속성은 표시 중인 페이지 인스턴스를 가져오는 데 사용됩니다. 이는 현재 표시되는 페이지에 접근하고 조작하는 데 도움이 될 수 있습니다. 예를 들어 해당 내용을 업데이트하거나 특정 작업을 실행할 수 있습니다.

```javascript
const currentPage = app.current;
```

## goto



`goto` 메서드는 지정된 페이지로 이동하는 데 사용됩니다. 대상 페이지의 주소를 전달할 수 있으며, 애플리케이션이 해당 페이지를 로드하여 표시합니다. 이는 애플리케이션 내비게이션의 중요한 방법입니다.

```javascript
app.goto("/page2.html");
```

## replace



`replace` 메서드는 `goto`와 유사하지만, 현재 페이지를 교체하는 용도로 사용되며 스택에 새 페이지를 추가하지 않습니다. 이는 스택 네비게이션이 아닌 페이지 교체를 구현하는 데 사용될 수 있습니다.

```javascript
app.replace("/new-page.html");
```

## back



`back` 메서드는 이전 페이지로 돌아가며, 페이지 탐색의 뒤로 가기 작업을 구현합니다. 이를 통해 사용자를 이전 페이지로 탐색합니다.

```javascript
app.back();
```

## routers



`routers` 속성은 애플리케이션의 라우팅 구성 정보를 포함합니다. 이는 중요한 속성으로, 애플리케이션 내 각 페이지의 라우팅 규칙과 매핑을 정의합니다. 라우팅 구성은 페이지 간의 탐색과 URL 처리 방식을 결정합니다.

```javascript
const routeConfig = app.routers;
```