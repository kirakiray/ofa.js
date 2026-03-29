# next



`next` 속성을 사용하면 요소의 다음 인접 요소 인스턴스를 가져올 수 있습니다.

<o-playground name="next - 다음 요소" style="--editor-height: 320px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="first">나는 1입니다</li>
        <li id="target">나는 타겟입니다</li>
        <li>나는 3입니다</li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        setTimeout(()=>{
          \$('#target').next.text = "타겟 다음 요소 변경";
          \$("#logger1").text = \$('#first').next === $('#target')
        },500);
      </script>
    </template>
  </code>
</o-playground>

