# css



`css` メソッドは、ターゲット要素のスタイルを取得または設定するために使用されます。

## 直接使用

`css` メソッドを直接使用して要素のスタイルを取得または設定できます。

<o-playground name="css - 直接使用" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <div id="target">origin text</div>
      <br>
      <h4>logger</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = $("#target").css.color;
        setTimeout(()=> {
          $('#target').css.color = 'red';
          $("#logger").text = $("#target").css.color;
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

## 全量設定

取得した `css` オブジェクトを通じて、要素上の style 値を直接設定できます。

<o-playground name="css - 全量設定" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <div id="target" style="color:red">元のテキスト</div>
      <br>
      <h4>ロガー</h4>
      <div id="logger" style="border:#aaa solid 1px;padding:8px;"></div>
      <script>
        $("#logger").text = Object.keys($("#target").css);
        setTimeout(()=>{
          \$("#target").css = {
            color: "blue",
            lineHeight: "5em"
          };
          \$("#logger").text = Object.keys($("#target").css);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

`css` オブジェクトの特性を使用すると、ターゲット要素のスタイルを素早く調整できます。

## テンプレート構文方式での使用

あなたはテンプレート構文を使用してターゲット要素のスタイルを設定することもできます。

<o-playground name="css - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./css-demo.html"></l-m>
      <css-demo></css-demo>
      <script>
        setTimeout(()=>{
          \$("css-demo").txt = "blue";
        },1000);
      </script>
    </template>
  </code>
  <code path="css-demo.html" active>
    <template component>
      <div :css.color="txt">I am target</div>
      <script>
        export default {
          tag: "css-demo",
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

## CSSを設定するコツ

`$ele.css = {...$ele.css, color:'red'}` という方法で、要素の特定のスタイル属性を他のスタイル属性に影響を与えることなく変更できます。この方法により、スタイル全体を書き換えることなく、一部のプロパティだけを変更できます。

### 例

```javascript
const myElement = $("#myElement");

myElement.css = { ...myElement.css, color: 'red' };
```

上記の例では、`{ ...myElement.css, color: 'red' }` を使用することで、要素の色スタイルのみを変更し、他のスタイルプロパティはそのまま保持しました。これは要素のスタイルを柔軟に変更する際に非常に便利なテクニックです。