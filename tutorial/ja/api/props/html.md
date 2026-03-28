# html



`html` メソッドは、対象要素の内部 HTML コードを取得または設定するために使用されます。

<o-playground name="html - 直接使用" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target1">
        <span style="color:green;">ターゲット 1</span>
      </div>
      <div id="target2">元のテキスト</div>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;"></div>
      <script>
        setTimeout(()=> {
          \$('#target2').html = `<b style="color:blue;">新しいテキスト</b>`;
          console.log($("#target1").text)
          \$("#logger").html = $("#target1").html;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

`html` は比較的危険なメソッドで、`script` が挿入されても内部の JavaScript コードが自動的に実行されてしまうため、使用時は XSS 対策に注意してください。

## テンプレート構文方式での使用

`:html` 属性を使って、対象要素に対応するHTML値を設定することもできます。これはコンポーネントのレンダリングにおいて特に便利です。

<o-playground name="html - テンプレート構文" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./html-demo.html"></l-m>
      <html-demo></html-demo>
      <script>
        setTimeout(()=>{
          \$("html-demo").txt = "<b style='color:blue;'>外部からtxtを変更</b>";
        },1000);
      </script>
    </template>
  </code>
  <code path="html-demo.html" active>
    <template component>
      <div>レンダリングされたhtml:
        <span :html="txt" style="color:red;"></span>
      </div>
      <script>
        export default {
          tag: "html-demo",
          data: {
            txt: "私はtxtです"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "<b style='color:blue;'>txtを変更</b>";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

