# extend



`extend`는 인스턴스의 속성이나 메서드를 확장하는 고차 함수(메소드)입니다.

> 일반적으로 사용자가 인스턴스의 속성이나 메서드를 확장하는 것은 학습 비용을 증가시키기 때문에 권장하지 않습니다. 팀 내에 특별한 시나리오가 있어 인스턴스의 동작을 사용자 정의해야 하는 경우를 제외하고는 이렇게 하는 것을 권장하지 않습니다.

<o-playground name="extend - 확장 인스턴스" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 확장 $ 저수준

jQuery와 유사하게, fn.extend를 통해 기본 인스턴스의 속성이나 메서드를 확장할 수도 있습니다. fn에서 확장된 속성이나 메서드는 모든 인스턴스에 적용됩니다.

<o-playground name="extend - 하부 레이어 확장" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 확장 템플릿 문법

`extend`를 통해 속성이나 함수를 확장하면 템플릿 문법의 기능을 추가하거나 컴포넌트에 전용 템플릿 문법 설탕을 제공할 수 있습니다. 그러나 주의할 점은 **사용하지 않는 것이 좋습니다** 비공식 템플릿 문법을 사용하는 것은 사용자에게 일정한 학습 비용을 초래하며, 많은 비공식 템플릿 문법 설탕은 개발 경험을 저하시킬 수 있습니다.

### 확장 속성

확장 속성을 통해 템플릿에서 `:`를 사용하여 설정할 수 있습니다. 아래에서는 `red` 속성을 확장할 것이며, `red`가 `true`일 때 글자 색이 빨간색으로 변합니다:

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - 확장 속성" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">Add Count</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 템플릿 구문에 `red` 속성을 추가했으며, `count % 3`이 0이 아닐 때 글자 색이 빨간색으로 바뀝니다.

### 확장 메서드

또한 `extend` 확장 메서드를 통해 템플릿 구문에서 사용할 수 있도록 만들 수 있습니다. 메서드 이름은 콜론 앞 부분입니다. 여기서는 `color` 템플릿 구문을 확장했으며, 뒤에 오는 인수는 정의된 확장 메서드에 전달됩니다.

여기서는 `always` 속성을 `true`로 설정했는데, 이는 컴포넌트가 인터페이스를 새로고침해야 할 때마다 정의된 이 메서드가 호출됨을 의미합니다. `always`를 설정하지 않으면 이 템플릿 구문 함수는 한 번만 실행됩니다.

여기서, `options`는 더 많은 매개변수를 제공하여 보다 맞춤화된 템플릿 구문을 개발하는 데 도움을 줍니다:

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - 확장 메소드" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">카운트 추가</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## 템플릿 문법 원리

지금까지 당신은 ofa.js 의 많은 템플릿 문법이 실제로는 `extend` 를 통해 확장된 것이라는 점을 이해했을 것입니다.

- `class`、`attr` 메서드는 뷰를 새로고침할 때마다 실행됩니다
- `on`、`one` 같은 함수 바인딩은 한 번만 실행됩니다

아래 예시를 통해 ofa.js의 템플릿 렌더링 원리를 더 잘 이해할 수 있습니다:

<o-playground name="extend - 템플릿 문법 원리" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

