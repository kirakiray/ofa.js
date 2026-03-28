# refresh



`refresh` メソッドは、能動的にコンポーネントのレンダリングビューを更新するために使用されます。コンポーネント上のデータが更新されない場合、このメソッドを使用してコンポーネントのビューを更新することができます。

[非応答性データ](../../documentation/property-response.md)を手動で更新する必要があるシナリオに適用されます。

<o-playground name="refresh - ビューを更新" style="--editor-height: 400px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./refresh-demo.html"></l-m>
      <refresh-demo></refresh-demo>
    </template>
  </code>
  <code path="refresh-demo.html" active>
    <template component>
      <div>{{_count}}</div>
      <button on:click="refresh()">更新</button>
      <script>
        export default {
          tag: "refresh-demo",
          data: {
            _count: 0,
          },
          attached() {
            this._timer = setInterval(() => {
              this._count++;
            }, 200);
          },
        };
      </script>
    </template>
  </code>
</o-playground>

