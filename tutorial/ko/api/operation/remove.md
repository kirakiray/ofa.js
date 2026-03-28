# remove



`remove` 메서드는 대상 노드를 삭제하는 데 사용됩니다.

**o-fill 또는 o-if 등의 템플릿 컴포넌트 내에서 조작하지 마십시오.**

<o-playground name="remove - 노드 삭제" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>나는 1입니다</li>
        <li id="target">나는 2입니다</li>
        <li>나는 3입니다</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').remove();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

