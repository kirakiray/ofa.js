# wrap



`wrap` 메서드는 대상 요소의 외부에 한 겹의 요소를 감싸는 데 사용됩니다. `wrap` 작업을 수행하기 전에 자동으로 [$ 메서드](../instance/dollar.md)의 초기화 작업이 실행되므로 구체적인 요소 문자열이나 객체를 바로 입력할 수 있습니다.

<o-playground name="wrap - 요소 감싸기" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div>
        <div>나는 1입니다</div>
        <div id="target">나는 2입니다</div>
        <div>나는 3입니다</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').wrap(`<div style="border-color:red;">wrap</div>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

대상 요소는 **부모 노드가 반드시 있어야** 하며, 그렇지 않으면 래핑 작업이 실패합니다.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.wrap("<div>new div</div>"); // 오류, 부모 요소가 없어 감쌀 수 없음
$el.$('#target').wrap("<div>new div</div>"); // 정상, 부모 요소가 있음
```

**o-fill 또는 o-if 등 템플릿 컴포넌트 내에서 조작하지 마십시오.**