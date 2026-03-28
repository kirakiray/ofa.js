# 인스턴스 데이터 특성

`$`로 가져오거나 생성한 인스턴스 객체는 완전한 stanz 데이터 특성을 갖추고 있는데, 이는 `$` 인스턴스가 stanz로부터 상속되었기 때문입니다. 이는 `stanz`가 제공하는 데이터 조작 메서드와 특성을 이용해 인스턴스 객체의 데이터를 조작하고 감시할 수 있음을 의미합니다.

> 아래 예시는 일반 요소를 사용합니다. 커스텀 컴포넌트는 보통 이미 등록된 데이터를 가지고 있지만, 일반 요소는 대부분 태그 정보만 포함하고 있어 데모에 더 적합하기 때문입니다.

## watch



인스턴스는 `watch` 메서드를 통해 값의 변경을 감지할 수 있습니다; 객체의 하위 객체 값을 변경하더라도 객체의 `watch` 메서드에서 변경을 감지할 수 있습니다.

아래는 `$` 인스턴스와 `watch` 메서드를 사용하는 예시입니다:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "I am bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "change bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

이 예시에서는 먼저 `$` 인스턴스 객체 `target`을 생성한 후, `watch` 메서드를 사용하여 그 변화를 감지합니다. 객체의 하위 객체 값을 변경하는 경우, 예를 들어 `target.bbb.child.val` 값을 변경하더라도, `watch` 메서드에서 이러한 변화를 감지하고 `logger` 요소의 내용을 업데이트할 수 있습니다. 이는 `$` 인스턴스 객체의 강력한 특성을 보여주며, 객체의 변화를 쉽게 모니터링할 수 있게 해줍니다.

## watchTick



`watchTick`와 `watch` 메서드의 기능은 유사하지만, `watchTick` 내부에는 스로틀(throttle) 조작이 있어 단일 스레드에서 한 번만 실행되므로, 일부 성능 요구사항이 더 높은 시나리오에서 데이터 변경을 더 효과적으로 감지할 수 있습니다.

다음은 `$` 인스턴스의 `watchTick` 메서드를 사용하는 방법을 보여주는 예시입니다：

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch 실행 횟수：' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick 실행 횟수：' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 먼저 `$` 인스턴스 객체 `target`을 생성합니다. 그런 다음 `watch` 메서드와 `watchTick` 메서드를 사용하여 객체의 변경 사항을 감시합니다. `watch` 메서드는 데이터가 변경될 때 즉시 실행되며, `watchTick` 메서드는 단일 스레드에서 한 번만 실행되므로 감시 작업의 빈도를 제한할 수 있습니다. 필요에 따라 `watch` 또는 `watchTick` 메서드를 선택하여 데이터 변경 사항을 감시할 수 있습니다.

## unwatch



`unwatch` 메소드는 데이터 감시를 취소하는 데 사용되며, 이전에 등록된 `watch` 또는 `watchTick` 감시를 취소할 수 있습니다.

다음은 $ 인스턴스의 `unwatch` 메서드를 사용하는 방법을 보여주는 예시입니다：

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 먼저 `$` 인스턴스 객체 `target`을 생성한 다음, `watch` 메서드와 `watchTick` 메서드를 각각 사용하여 두 개의 감시자를 등록합니다. 이후 `unwatch` 메서드에 이전에 저장해 둔 감시자 반환값 `tid1`과 `tid2`를 전달하여 두 감시자를 해제합니다. 이는 첫 번째 `setTimeout` 내의 속성 변경이 어떤 감시자도 트리거하지 않음을 의미하며, 그 이유는 감시자가 이미 해제되었기 때문입니다.

## 감시되지 않는 값

`$` 인스턴스에서 밑줄 `_`로 시작하는 속성 이름은 해당 값이 `watch` 또는 `watchTick` 메서드에 의해 감시되지 않음을 나타냅니다. 이는 일시적이거나 비공개인 속성에 매우 유용하며, 감시를 트리거하지 않고 자유롭게 변경할 수 있습니다.

템플릿 내에서 이것은 [비반응형 데이터](../../documentation/state-management.md)라고 합니다.

다음은 밑줄로 시작하는 속성 값을 사용하여 감시를 피하는 방법을 보여주는 예시입니다:

<o-playground name="stanz - 비반응형 데이터" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서 `$` 인스턴스 객체 `target`을 생성한 다음 `watch` 메서드를 사용하여 속성 값의 변동을 감시합니다. `setTimeout` 내에서 `_aaa` 속성 값을 변경하려고 하지만, 이 변경은 감시를 트리거하지 않습니다. 이것은 감시를 트리거하지 않고 속성 값을 업데이트해야 하는 상황에 매우 유용합니다.

## 기본 특징

인스턴스에 설정된 객체 데이터는 Stanz 인스턴스로 변환되며, 이러한 Stanz 인스턴스는 감시를 허용합니다.

```javascript
const obj = {
  val: "I am obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

우리는 또한 `$.stanz`를 사용하여 인스턴스에 바인딩되지 않은 Stanz 데이터를 생성할 수 있습니다.

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val"; // 값 할당
// 감시 트리거
```

이 예시들은 객체 데이터를 Stanz 인스턴스로 설정하여 리스닝하는 기본 특징을 보여줍니다.

보다 완전한 기능은 [stanz](https://github.com/ofajs/stanz)를 참조하세요.