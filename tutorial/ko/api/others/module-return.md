# 모듈 반환 객체 속성

ofa.js에서 페이지 모듈이든 컴포넌트 모듈이든 모두 `export default async () => {}`를 통해 객체를 반환하여 모듈의 구성과 동작을 정의해야 합니다. 이 문서는 반환 객체에 포함될 수 있는 모든 속성을 정리하였습니다.

## 속성 개요

| 속성 | 타입 | 페이지 모듈 | 컴포넌트 모듈 | 설명 | 관련 문서 |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ 필수 | 컴포넌트 태그 이름 | [컴포넌트 생성](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | 반응형 데이터 객체 | [속성 반응](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | 컴포넌트 속성 정의 | [특성 속성 전달](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | 메서드와 계산된 속성 | [계산된 속성](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | 감시자 | [감시자](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | DOM 생성 완료 시 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | DOM에 마운트될 때 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | DOM에서 제거될 때 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | 완전히 로드 완료 시 호출 | [라이프사이클](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ 부모 페이지 | ❌ | 라우트 변경 시 호출 | [중첩 페이지/라우트](../../documentation/nested-routes.md) |> **특수 내보내기**: `export const parent = "./layout.html"` - 중첩 라우팅에 사용되며, 부모 페이지 경로를 지정합니다 (반환 객체에 포함되지 않음). 자세한 내용은 [중첩 페이지/라우팅](../../documentation/nested-routes.md)을 참조하세요.

## 핵심 속성

### tag



`tag`는 컴포넌트의 태그 이름이며, **컴포넌트 모듈은 반드시 이 속성을 정의해야 합니다**. 페이지 모듈은 `tag`를 정의할 필요가 없습니다.

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> 주의: `tag`의 값은 구성 요소를 사용할 때의 태그 이름과 일치해야 합니다.

### data



`data`는 반응형 데이터 객체로, 컴포넌트나 페이지의 상태 데이터를 저장하는 데 사용됩니다. 데이터가 변경되면 자동으로 뷰가 업데이트됩니다.

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "장삼",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> 주의: `data`는 함수가 아닌 객체이며, Vue 프레임워크와 다릅니다.

### attrs



`attrs`는 컴포넌트 속성을 정의하는 데 사용되며, 외부에서 전달된 데이터를 수신합니다. 컴포넌트 모듈만 `attrs`를 정의하면 됩니다.

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // 기본값 없음
      disabled: "",     // 기본값 있음
      size: "medium"    // 기본값 있음
    }
  };
};
```

컴포넌트 사용 시 속성 전달:

```html
<my-component title="제목" disabled size="large"></my-component>
```

> 중요 규칙:
> - 전달되는 attribute 값은 반드시 문자열이어야 하며, 문자열이 아닌 경우 자동으로 문자열로 변환됩니다.
> - 네이밍 변환: `fullName` → `full-name` (kebab-case 형식)
> - `attrs`와 `data`의 key는 중복될 수 없습니다.

### proto



`proto`는 메서드와 계산된 속성을 정의하는 데 사용됩니다. 계산된 속성은 JavaScript의 `get`과 `set` 키워드를 사용하여 정의됩니다.

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // 메서드 정의
      increment() {
        this.count++;
      },
      
      // 계산된 속성 (getter)
      get doubleCount() {
        return this.count * 2;
      },
      
      // 계산된 속성
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

참고: ofa.js는 Vue의 `computed` 옵션 대신 `get`/`set` 키워드를 사용하여 계산된 속성을 정의합니다.

### watch



`watch`는 감시자를 정의하는 데 사용되며, 데이터 변경을 모니터링하고 해당 로직을 실행합니다.

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // 단일 속성 감시
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // 여러 속성 감시
      "count,name"() {
        console.log('count 또는 name이 변경되었습니다');
      }
    }
  };
};
```

리스너 콜백 함수는 두 개의 매개변수를 받습니다:- `newValue`：변경된 새로운 값
- `{ watchers }`：현재 컴포넌트의 모든 감시자 객체

## 생명주기 훅

라이프사이클 훅을 사용하면 컴포넌트의 다양한 단계에서 특정 로직을 실행할 수 있습니다.

### ready



`ready` 훅은 컴포넌트가 준비될 때 호출되며, 이때 컴포넌트의 템플릿이 렌더링 완료되고 DOM 요소가 생성되었지만 아직 문서에 삽입되지 않았을 수 있습니다.

```javascript
ready() {
  console.log('DOM이 생성되었습니다');
  this.initDomElements();
}
```

### attached



`attached` 훅은 컴포넌트가 문서에 삽입될 때 호출되며, 컴포넌트가 페이지에 마운트되었음을 나타냅니다.

```javascript
attached() {
  console.log('DOM에 마운트됨');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached



`detached` 훅은 구성 요소가 문서에서 제거될 때 호출되며, 구성 요소가 곧 마운트 해제됨을 나타냅니다.

```javascript
detached() {
  console.log('DOM에서 제거됨');
  clearInterval(this._timer);
}
```

### loaded



`loaded` 훅은 컴포넌트와 모든 하위 컴포넌트, 비동기 리소스가 모두 로드된 후 트리거됩니다.

```javascript
loaded() {
  console.log('완전히 로드 완료');
}
```

### routerChange



`routerChange` 훅은 라우트 변경 시 호출되며, 부모 페이지에서 자식 페이지 전환을 감지하는 데만 사용됩니다.

```javascript
routerChange() {
  this.refreshActive();
}
```

## 생명 주기 실행 순서

```
ready → attached → loaded
                 ↓
              detached（분리 시）
```

## 특수 내보내기: parent

`parent`는 중첩 라우팅에 사용되며, 현재 페이지의 상위 페이지 경로를 지정합니다. 이는 독립적인 내보내기로, 반환 객체에 포함되지 않습니다.

```html
<template page>
  <style>:host { display: block; }</style>
  <div>하위 페이지 내용</div>
  <script>
    // 부모 페이지 지정
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## 전체 예시

### 컴포넌트 모듈

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>카운트: {{count}}</p>
    <p>두 배: {{doubleCount}}</p>
    <button on:click="increment">증가</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "기본 제목"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count 변경됨:', newVal);
          }
        },
        ready() {
          console.log('컴포넌트 준비 완료');
        },
        attached() {
          console.log('컴포넌트 마운트됨');
        },
        detached() {
          console.log('컴포넌트 언마운트됨');
        }
      };
    };
  </script>
</template>
```

### 페이지 모듈

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('페이지 준비 완료');
        },
        
        attached() {
          console.log('페이지가 마운트됨');
          console.log('쿼리 매개변수:', query);
        },
        
        detached() {
          console.log('페이지가 언마운트됨');
        }
      };
    };
  </script>
</template>
```

## 흔한 실수

### 1. attrs와 data의 키 중복

```javascript
// ❌ 오류
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // attrs와 중복됨
};

// ✅ 올바름
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // 다른 키 사용
};
```

### 2. Vue 스타일로 계산 속성 정의하기

```javascript
// ❌ 오류
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ 올바름
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data는 함수로 정의

```javascript
// ❌ 잘못됨
return {
  data() {
    return { count: 0 };
  }
};

// ✅ 올바름
return {
  data: {
    count: 0
  }
};
```

### 4. 메서드 정의 위치 오류

```javascript
// ❌ 오류
return {
  methods: {
    handleClick() {}
  }
};

// ✅ 올바름
return {
  proto: {
    handleClick() {}
  }
};
```