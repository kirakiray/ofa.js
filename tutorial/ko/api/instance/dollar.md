# $

`$` 메서드는 ofa.js의 핵심 함수로, DOM 요소 인스턴스를 가져오고 조작하는 데 사용됩니다. 아래에 `$`의 주요 기능을 자세히 소개합니다:

## 요소 인스턴스 가져오기

`$` 메서드를 통해 페이지에서 [CSS 선택자](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Selectors/Selector_list)에 일치하는 첫 번째 요소 인스턴스를 가져와 조작할 수 있습니다. 다음은 예시입니다:

<o-playground name="$ - 요소 가져오기">
  <code path="demo.html">
    <template>
      <div id="target1">target 1 text</div>
      <script>
        setTimeout(()=>{
          \$("#target1").text = 'change target 1';
        },500);
      </script>
    </template>
  </code>
</o-playground>

위의 예제에서, `$` 기호로 `id`가 "target1"인 요소 인스턴스를 선택하고, `text` 속성을 설정하여 텍스트 내용을 수정합니다.

## 자식 요소 인스턴스 찾기

인스턴스는 `$` 메소드를 가지고 있으며, 인스턴스의 `$` 메소드를 통해 요소 인스턴스의 첫 번째 조건에 맞는 자식 요소 인스턴스를 가져올 수 있습니다.

<o-playground name="$ - 하위 요소 찾기">
  <code path="demo.html">
    <template>
      <div id="target1">
        <h3>target</h3>
        <p>I am target1</p>
      </div>
      <script>
        const tar = $("#target1");
        tar.$('h3').text = 'change target title';
      </script>
    </template>
  </code>
</o-playground>

요소 인스턴스를 직접 다른 곳에 삽입하지 마세요. 이러한 작업은 원래 요소에 영향을 미칠 수 있습니다. 사본이 필요하다면 [clone](./clone.md) 메서드를 사용할 수 있습니다.

<o-playground name="$ - 인스턴스 특성" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="pos1" style="border:red solid 1px;">
        <h3>position 1</h3>
        <p id="target1" style="color:green">I am target1</p>
      </div>
      <div id="pos2" style="border:blue solid 1px;margin:8px;">
        <h3>position 2</h3>
      </div>
      <script>
        setTimeout(()=>{
          const tar = $("#target1");
          \$("#pos2").push(tar);
        },500);
      </script>
    </template>
  </code>
</o-playground>

## 그림자 노드 내의 자식 요소 가져오기

[shadow](./shadow.md) 속성을 통해 인스턴스를 가져온 후, `$` 메서드를 사용해 원하는 요소를 가져올 수 있습니다:

```javascript
$('my-component').shadow.$("selector").method(xxx)
```

## 요소를 직접 인스턴스화

다음과 같은 방식으로 네이티브 요소를 `$` 인스턴스 객체로 직접 초기화할 수 있습니다:

```javascript
const ele = document.createElement('div');
const $ele = $(ele);
```

```javascript
const ele = document.querySelector('#target');
const $ele = $(ele);
```

이렇게 하면 기존 HTML 요소를 손쉽게 `$` 인스턴스로 변환하여 `$` 가 제공하는 기능을 이용해 조작하고 처리할 수 있습니다.

## 요소 인스턴스 생성

또한, `$`는 기존 요소 인스턴스를 가져오는 것 외에도 새로운 요소 인스턴스를 생성하고 페이지에 추가하는 데에도 사용할 수 있습니다.

### 문자열로 생성하기

문자열을 통해 새로운 요소 인스턴스를 생성할 때 `$` 함수를 다음과 같이 사용할 수 있습니다:

<o-playground name="$ - 문자열 생성" style="--editor-height: 260px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $(`<div style="color:red">target 1 텍스트 추가</div>`);
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서 우리는 `$` 함수를 사용해 지정된 스타일과 텍스트 콘텐츠를 가진 새 요소 인스턴스를 만들고, 이를 `id`가 "target1"인 기존 요소 인스턴스 안에 추가했습니다.

### 객체를 통해 생성

`$` 함수를 통해 객체 방식으로 새로운 요소 인스턴스를 생성할 수도 있습니다. 다음과 같습니다:

<o-playground name="$ - 객체 생성" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <b>target1:</b>
      </div>
      <script>
        const newEl = $({
          tag: "div",
          text: "add target 1 text",
          css: {
            color: "red"
          }
        });
        \$('#target1').push(newEl);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 `$` 함수를 사용하여 객체 방식으로 새로운 요소 인스턴스를 정의하며, 여기에는 태그 유형, 텍스트 콘텐츠, 스타일 속성이 포함됩니다. 그런 다음 이를 `id`가 "target1"인 기존 요소 인스턴스 내에 추가합니다.