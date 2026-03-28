# one



`one` メソッドを使用すると、対象要素に一度だけ実行されるイベントハンドラーを登録できます。つまり、イベントハンドラーは最初にトリガーされた後に自動的にバインドが解除され、再度トリガーされることはありません。

以下は、ボタン要素にクリックイベントハンドラを登録するために `one` メソッドを使用する方法の例です：

<o-playground name="ワンクリック ワンタイムイベント" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">カウントを追加</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").one("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

この例では、ボタン要素に `one` メソッドを使用してクリックイベントハンドラを追加しました。ユーザーがボタンをクリックすると、イベントハンドラがトリガーされますが、その後はバインドが解除されるため、再度トリガーされることはありません。

## テンプレート構文方式での使用

テンプレート構文を使用して、対象要素に一度だけ実行されるイベントハンドラをバインドすることもできます。

<o-playground name="one - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./one-demo.html"></l-m>
      <one-demo></one-demo>
    </template>
  </code>
  <code path="one-demo.html" active>
    <template component>
      <button one:click="addCount">カウントを追加</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "one-demo",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            }
          }
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、ボタン要素に `one:click` を使って `addCount` というメソッドをバインドしています。ユーザーがボタンをクリックするとこのメソッドが呼び出されますが、それ以降は再びトリガーされません。なぜなら、これは一度限りのイベントハンドラだからです。