# shadow



`shadow` 속성을 사용하면 요소의 섀도우 루트 노드 인스턴스를 가져올 수 있습니다.

<o-playground name="shadow - 그림자 노드" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
    </template>
  </code>
  <code path="test-shadow.html" active>
    <template component>
      <ul>
        <li>item 1</li>
        <li id="target">item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = 'change target';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

주의할 점은, 템플릿 구문이 있는 요소 내에서 그림자 노드의 요소를 직접 수정하는 것을 피해 일관성과 유지보수성을 보장해야 한다는 것입니다.

## 외부에서 컴포넌트 Shadow 요소 내부의 요소 인스턴스 가져오기

또한 외부에서 사용자 정의 요소 인스턴스를 가져와 `shadow` 속성을 통해 섀도우 노드 내부의 요소에 접근할 수 있습니다. 예를 들면 다음과 같습니다:

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - 외부 접근" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = '외부에서 타겟 변경 - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
    <template component>
      <ul>
        <li>항목 1</li>
        <li id="target">항목 2</li>
        <li>항목 3</li>
      </ul>
      <script>
        export default {
          tag:"test-shadow",
          ready(){
            setTimeout(()=>{
              this.shadow.$("#target").text = '타겟 변경';
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

