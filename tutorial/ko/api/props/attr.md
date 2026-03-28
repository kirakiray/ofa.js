# attr



`attr` 메서드는 요소의 속성을 가져오거나 설정하는 데 사용됩니다.

## 직접 사용

`attr` 메서드를 사용하면 요소의 속성을 직접 가져오거나 설정할 수 있습니다.

<o-playground name="attr - 직접 사용" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div id="target1" test-attr="1">나는 타겟 1입니다</div>
      <div id="target2">나는 타겟 2입니다</div>
      <div id="logger" style="border:blue solid 1px;padding:8px;margin:8px;">로거</div>
      <script>
        $("#logger").text = $("#target1").attr('test-attr');
        setTimeout(()=> {
          $("#target1").attr('test-attr', '2')
          $("#logger").text = $("#target1").attr('test-attr');
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 템플릿 문법 방식 사용

`attr:aaa="bbb"` 방식을 사용하여 대상 요소의 **aaa** 속성을 컴포넌트 **bbb**의 값으로 설정할 수도 있습니다. 이 방법은 컴포넌트 렌더링에 특히 유용합니다.

<o-playground name="attr - 템플릿 문법" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./attr-demo.html"></l-m>
      <attr-demo></attr-demo>
      <script>
        setTimeout(()=>{
          \$("attr-demo").txt = "2";
        },1000);
      </script>
    </template>
  </code>
  <code path="attr-demo.html" active>
    <template component>
      <style>
        [test-attr="1"] {
          color: red;
        }
        [test-attr="2"]{
          color: green;
        }
      </style>
      <div attr:test-attr="txt">I am target</div>
      <script>
        export default {
          tag: "attr-demo",
          data: {
            txt: "1"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "2";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

