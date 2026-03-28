# shadow



`shadow` 属性を使用すると、要素のシャドウルートノードインスタンスを取得できます。

<o-playground name="shadow - シャドウノード" style="--editor-height: 400px">
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

注意すべき点として、テンプレート構文を持つ要素内でシャドウノード内の要素を直接変更することは避け、操作の一貫性と保守性を確保する必要があります。

## 外部からコンポーネントのシャドウ要素内の要素インスタンスを取得する

外部からカスタム要素のインスタンスを取得し、`shadow`プロパティを使用してシャドウノード内の要素にアクセスすることもできます。以下のようになります：

```javascript
$("test-shadow").shadow.$('selector').method(xxx);
```

<o-playground name="shadow - 外部アクセス" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./test-shadow.html"></l-m>
      <test-shadow></test-shadow>
      <script>
        setTimeout(()=>{
          $("test-shadow").shadow.$("#target").text = 'change target from outside - ' + new Date();
        },1000);
      </script>
    </template>
  </code>
  <code path="test-shadow.html">
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

