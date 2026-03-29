# index



`index` 속성은 요소가 부모 요소 내에서 차지하는 위치를 가져올 때 사용됩니다. 이 위치는 0부터 세며, 첫 번째 요소의 위치는 0, 두 번째는 1, 이런 식으로 계속됩니다.

아래 예제에서는 `index` 속성을 사용하여 요소가 부모 요소 아래에서의 위치를 가져오는 방법을 보여줍니다:

<o-playground name="index - 위치 가져오기" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger" style="color: green">로거</div>
      <script>
        setTimeout(() => {
          $("#logger").text = $("#target").index;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

이 예시에서는 먼저 `id`가 "target"인 `<li>` 요소를 선택합니다. 그런 다음 `index` 속성을 사용하여 해당 요소가 부모 요소 `<ul>` 아래에서의 위치, 즉 두 번째 요소를 가져오므로 `index` 값은 1입니다. 그런 다음 이 값을 `id`가 "logger"인 `<div>` 요소에 표시합니다.