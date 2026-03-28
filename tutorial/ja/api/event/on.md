# on



`on` メソッドを使用すると、対象要素にイベントハンドラを登録できます。これにより、ユーザーのインタラクションを簡単にキャッチして応答できます。

以下は、ボタン要素にクリックイベントハンドラを登録するために `on` メソッドを使用する方法を示す例です：

<o-playground name="on - click イベント" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">add count</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", ()=> {
          \$("#logger").text = count++;
        });
      </script>
    </template>
  </code>
</o-playground>

この例では、`on` メソッドを使用してボタン要素にクリックイベントハンドラを追加しました。ユーザーがボタンをクリックすると、イベントハンドラがトリガーされ、カウンターが増加し、結果がページに表示されます。

## テンプレート構文方式での使用

テンプレート構文を使用して、ターゲット要素にメソッドをバインドすることもできます。

<o-playground name="on - テンプレート構文" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./on-demo.html"></l-m>
      <on-demo></on-demo>
    </template>
  </code>
  <code path="on-demo.html" active>
    <template component>
      <button on:click="addCount">カウントを追加</button>
      <div>{{count}}</div>
      <script>
        export default {
          tag: "on-demo",
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

この例では、ボタン要素に `on:click` を使って `addCount` というメソッドをバインドしています。ユーザーがボタンをクリックすると、このメソッドが呼び出され、カウンターの値が増加してページに表示されます。この方法により、イベントハンドラをコンポーネントのメソッドに関連付け、より複雑なインタラクションを実現できます。

## event



イベントを登録した後、トリガーされる関数には event が渡されます。これはネイティブと同様です：

<o-playground name="on - event 参数" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <button id="target">カウントを追加</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$("#target").on("click", (event)=> {
          \$("#logger").text = event.type;
        });
      </script>
    </template>
  </code>
</o-playground>

