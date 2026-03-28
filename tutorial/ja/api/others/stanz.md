# インスタンスデータの特徴

`$` によって取得または作成されたインスタンスオブジェクトは、完全な stanz データ特性を持っている。なぜなら `$` インスタンスは stanz を継承しているからである。これは、`stanz` が提供するデータ操作メソッドと特性を利用して、インスタンスオブジェクトのデータを操作・監視できることを意味する。

> 以下の例では通常の要素を使用しています。カスタムコンポーネントは通常登録済みのデータを持っていますが、通常の要素は通常タグ情報のみを含んでいるため、デモンストレーションにより適しています。

## watch



インスタンスは`watch`メソッドを通じて値の変更を監視できます。オブジェクトの子オブジェクトの値を変更した場合でも、オブジェクトの`watch`メソッドで変更を検知できます。

以下は、`$`インスタンスと`watch`メソッドの使い方を示す例です：

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "I am bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "change bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playplayground>

この例では、まず `$` インスタンスオブジェクト `target` を作成し、次に `watch` メソッドを使用してその変更を監視します。たとえオブジェクトの子オブジェクトの値、例えば `target.bbb.child.val` の値を変更しても、`watch` メソッド内でこれらの変更を監視し、`logger` 要素の内容を更新することができます。これは `$` インスタンスオブジェクトの強力な特性を示しており、オブジェクトの変化を簡単に監視できるようにします。

## watchTick



`watchTick`と`watch`メソッドは機能が似ていますが、`watchTick`の内部にはスロットリング処理があり、単一スレッドで1回実行されるため、パフォーマンスがより要求されるシナリオでデータの変更をより効率的に監視できます。

以下は、`$` インスタンスの `watchTick` メソッドの使用方法を示す例です：

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch 実行回数：' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick 実行回数：' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

この例では、まず `$` インスタンスオブジェクト `target` を作成します。次に、`watch` メソッドと `watchTick` メソッドを使用してオブジェクトの変更を監視します。`watch` メソッドはデータが変更されたときに即座に実行されますが、`watchTick` メソッドは単一のスレッドで一度だけ実行されるため、監視操作の頻度を制限することができます。必要に応じて、データの変更を監視するために `watch` または `watchTick` メソッドを選択できます。

## unwatch



`unwatch` メソッドはデータのリスニングをキャンセルするために使用され、以前に登録した `watch` または `watchTick` のリスニングを取り消すことができます。

以下は、 `$` インスタンスの `unwatch` メソッドの使用例です：

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

この例では、まず `$` インスタンスオブジェクト `target` を作成し、次に `watch` メソッドと `watchTick` メソッドを使用してそれぞれ2つのリスナーを登録しました。その後、`unwatch` メソッドに以前保存したリスナーの戻り値 `tid1` と `tid2` を渡して、これら2つのリスナーを解除しました。これは、最初の `setTimeout` 内でのプロパティ変更がリスナーをトリガーしないことを意味します。なぜなら、リスナーは既に解除されているからです。

## 監視されない値

`$` インスタンスでは、アンダースコア `_` で始まるプロパティ名は、`watch` や `watchTick` メソッドによって監視されないことを示します。これは、一時的またはプライベートなプロパティに非常に便利です。監視をトリガーせずに自由に変更できます。

テンプレート内では、これは[非リアクティブデータ](../../documentation/state-management.md)と呼ばれます。

以下は、アンダースコアで始まるプロパティ値を使用して監視を回避する方法を示す例です：

<o-playground name="stanz - 非応答性データ" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "I am aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "change aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

この例では、`$` インスタンスオブジェクト `target` を作成し、`watch` メソッドを使ってプロパティ値の変更を監視します。`setTimeout` の中で `_aaa` プロパティ値を変更しようとしますが、この変更は監視をトリガーしません。これは、監視をトリガーせずにプロパティ値を更新する必要がある場合に非常に便利です。

## 基本特徴

インスタンスに設定されたオブジェクトデータは、Stanzインスタンスに変換されます。このStanzインスタンスでは、リスニング（監視）が可能になります。

```javascript
const obj = {
  val: "私はobjです"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

私たちは `$.stanz` を使って、インスタンスにバインドされていない Stanz データを作成することもできます。

```javascript
const data = $.stanz({
  val: "I am val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "change val";
```

これらの例は、監視のためにオブジェクトデータをStanzインスタンスに設定する基本的な特徴を示しています。

より完全な機能については [stanz](https://github.com/ofajs/stanz) をご覧ください。