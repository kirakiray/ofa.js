# all



`all` 메서드를 사용하면 CSS 선택자에 맞는 페이지의 모든 요소를 가져와서 이 요소 인스턴스들을 포함하는 배열을 반환합니다.

<o-playground name="all - 모든 요소 가져오기" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li>I am 2</li>
        <li>I am 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$.all("li").forEach((item,index)=>{
            item.text = `change item ${index}`;
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

## 자식 요소 가져오기

인스턴스도 `all` 메서드를 가지고 있으며, 인스턴스의 `all` 메서드를 통해 자식 요소를 선택하고 가져올 수 있습니다.

<o-playground name="all - 자식 요소 가져오기" style="--editor-height: 360px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <ul>
          <li>나는 1입니다</li>
          <li>나는 2입니다</li>
          <li>나는 3입니다</li>
        </ul>
      </div>
      <script>
        const tar = $("#target1");
        setTimeout(()=>{
          tar.all("li").forEach((item,index)=>{
            item.text = `변경된 항목 ${index}`;
          });
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

