# unwrap



`unwrap` 메서드는 대상 요소의 외부를 감싸고 있는 요소를 제거하는 데 사용됩니다.

<o-playground name="unwrap - 래핑 제거" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 주의사항

대상 요소는 **부모 노드를 반드시 가지고 있어야** 하며, 그렇지 않으면 unwrap 연산을 실행할 수 없습니다.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // 오류, 부모 요소가 없어서 unwrap할 수 없음
$el.$('#target').unwrap(); // 올바름, 감싸는 요소를 제거함
```

대상 요소에 다른 형제 요소가 있을 때는 unwrap을 실행할 수 없습니다.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // 오류, 인접한 다른 노드가 존재하기 때문
```

**请 주의하세요. o-fill 또는 o-if 같은 템플릿 컴포넌트 내부에서 조작하지 마세요.**