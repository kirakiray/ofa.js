# off



`off` メソッドを使用すると、登録済みのイベントハンドラを解除し、イベントのリスニングをキャンセルできます。

以下は、`off` メソッドを使用してイベントリスナーを解除する方法の例です：

<o-playground name="off - イベントリスナーの削除" style="--editor-height: 400px">
  <code path="demo.html">
    <template>
      <button id="target">カウントを追加</button>
      <br>
      <br>
      <div id="logger" style="border:red solid 1px;padding:8px;">-</div>
      <script>
        let count = 0;
        const f = ()=> {
          \$("#logger").text = count++;
          if(count === 3){
            \$("#target").off("click", f);
          }
        }
        \$("#target").on("click", f);
      </script>
    </template>
  </code>
</o-playground>

この例では、クリックイベントハンドラ `f` を登録し、ボタンがクリックされるとイベントハンドラが `#logger` にクリック回数を表示します。`off` メソッドを使って、クリック回数が3に達したときにイベントのリスニングを解除しました。