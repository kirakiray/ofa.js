# parents



`parents` 속성을 사용하면 현재 요소의 모든 부모 요소 인스턴스를 쉽게 가져올 수 있으며, 이 요소들은 배열 형태로 반환됩니다.

<o-playground name="parents - 부모 요소" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div>
        <ul>
          <li>나는 1입니다</li>
          <li id="target">나는 타겟입니다</li>
          <li>나는 3입니다</li>
        </ul>
      </div>
      <div>
        로거: <span id="logger"></span>
      </div>
      <script>
        setTimeout(()=>{
          $("#logger").text = $("#target").parents.map(e => e.tag);
        },500);
      </script>
    </template>
  </code>
</o-playground>

