# style



`style` 属性はネイティブと一致するようにします。

ご注意ください、`style`属性は実際のスタイル値を取得することはできず、`style`属性に設定された値のみを取得します。`style`メソッドは[cssメソッド](./css.md)と似ていますが、全量のスタイルを上書きすることはできません。`css`と比較して、`style`メソッドの内部実行効率はより高くなっています。

以下は、`style`の使い方を示す例です：

<o-playground name="style - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">元のテキスト</div>
      <br>
      <h4>ロガー</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").style.color;
        setTimeout(()=> {
          $('#target').style.color = 'red';
          $("#logger").text = $("#target").style.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

覚えておいてください。`style` メソッドは `style` 属性の値のみを取得・設定し、実際の計算スタイルではありません。

## テンプレート構文方式での使用

あなたはテンプレート構文を使用してターゲット要素のスタイルを設定することもできます。

<o-playground name="style - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./style-demo.html"></l-m>
      <style-demo></style-demo>
      <script>
        setTimeout(()=>{
          \$("style-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="style-demo.html" active>
    <template component>
      <div :style.color="txt">I am target</div>
      <script>
        export default {
          tag: "style-demo",
          data: {
            txt: "red"
          },
          ready(){
            setTimeout(()=>{
              this.txt = "blue";
            }, 500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

