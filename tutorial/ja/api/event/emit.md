# emit



`emit` メソッドを使用すると、イベントを能動的にトリガーすることができ、トリガーされたイベントにはバブリング機構があります。バブリング機構とは、イベントが内部要素から外部要素へ、内側から外側の階層に向かってイベントがトリガーされることを意味します。

以下は、`emit` メソッドを使用してカスタムイベントをトリガーし、バブリング機構を利用してイベントを外部要素へ伝播させる方法を示す例です：

<o-playground name="emit - イベントの発火" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        \$('ul').on('custom-event',()=>{
          count++;
          \$("#logger1").text = 'ul is triggered ' + count;
        });
        \$('#target').on('custom-event',()=>{
          count++;
          \$("#logger2").text = 'target is triggered ' + count;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

この例では、`<ul>`要素と`<li>`要素にそれぞれ同じカスタムイベント`custom-event`のハンドラを登録しています。`emit`メソッドでイベントを発火させると、そのイベントは`<li>`要素から`<ul>`要素へバブリングし、両方のイベントハンドラが実行されます。

## カスタムデータ

`data` パラメータを指定することで、カスタムデータをイベントハンドラーに渡すことができます：

<o-playground name="emit - カスタムデータ" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',(event)=>{
          \$("#logger1").text = 'ul is triggered;  =>  ' + event.data;
        });
        \$('#target').on('custom-event',(event)=>{
          \$("#logger2").text = 'target is triggered;  =>  ' + event.data;
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{ 
            data:"I am data"
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

この例では、`data` パラメータを通じてカスタムデータをイベントハンドラに渡しています。イベントハンドラは `event.data` を通じて渡されたデータを取得できます。

## バブルしないイベントトリガー

イベントのバブリングを望まない場合は、イベントをトリガーする際に `bubbles: false` パラメータを指定できます：

<o-playground name="emit - バブリングしない" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li id="target">
          I am target
        </li>
      </ul>
      <div id="logger1" style="border:red solid 1px;padding:8px;">-</div>
      <div id="logger2" style="border:blue solid 1px;padding:8px;">-</div>
      <script>
        \$('ul').on('custom-event',()=>{
          \$("#logger1").text = 'ul is triggered';
        });
        \$('#target').on('custom-event',()=>{
          \$("#logger2").text = 'target is triggered';
        });
        setTimeout(()=>{
          \$("#target").emit("custom-event",{
            bubbles: false
          });
        },500);
      </script>
    </template>
  </code>
</o-playground>

この例では、`bubbles: false` パラメータを使用してカスタムイベントをトリガーしました。このイベントは親要素へバブリングしないため、`<li>` 要素のイベントハンドラのみが実行されます。

## ルートノードを貫通する

デフォルトでは、イベントはカスタムコンポーネントのシャドウDOMを通過しません。しかし、`composed: true` を設定することで、カスタムイベントがルートノードを通過し、ルートノードの外側の要素をトリガーできるようになります。

<o-playground name="emit - ペネトレートルートノード" style="--editor-height: 560px">
  <code path="demo.html" preview>
    <template>
      <div id="outer-logger"></div>
      <l-m src="./composed-test.html"></l-m>
      <composed-test></composed-test>
    </template>
  </code>
  <code path="composed-test.html" active>
    <template component>
      <style>
        :host{
          display:block;
          border:red solid 1px;
        }
      </style>
      <div id="logger">{{loggerText}}</div>
      <div id="target"></div>
      <script>
        export default {
          tag: "composed-test",
          data:{
            loggerText: ""
          },
          ready(){
            this.on("custom-event",(event)=>{
              this.loggerText = 'custom event is triggered;  =>  ' + event.data;
            });
            setTimeout(()=>{
              this.shadow.$("#target").emit("custom-event",{
                composed: true,
                data:"I am composed event"
              });
            },500);
          }
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、カスタムコンポーネント `composed-test` を作成しました。これは、シャドウ DOM 内の要素とイベントをトリガーするボタンを含んでいます。デフォルトでは、イベントはシャドウ DOM からルートノードに伝播しません。しかし、イベントをトリガーする際に `composed: true` パラメータを使用することで、イベントがルートノードに伝播し、ルートノード外の要素をトリガーしました。