# after



`after` 메서드는 대상 요소의 뒤에 요소를 추가하는 데 사용됩니다. `after` 작업을 실행하기 전에 자동으로 [$ 메서드](../instance/dollar.md)의 초기화 작업이 수행되므로 구체적인 요소 문자열이나 객체를 바로 입력할 수 있습니다.

**o-fill 또는 o-if 등의 템플릿 컴포넌트 내에서 조작하지 마십시오.**

<o-playground name="after - 뒤에 추가" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>나는 1입니다</li>
        <li id="target">나는 2입니다</li>
        <li>나는 3입니다</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$('#target').after(`<li style="color:red;">새로운 li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

