# プロパティレスポンス

前の [プロパティバインディング](./property-binding.md) では、シンプルなプロパティ応答メカニズム、つまりコンポーネントのプロパティ値をテキスト表示にレンダリングする方法について説明しました。

ofa.jsは、基本的なプロパティ値のリアクティブなサポートだけでなく、多層にネストされたオブジェクト内部のプロパティ値に対するリアクティブなレンダリングもサポートしています。

<o-playground name="非リアクティブデータの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">増加</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

ofa.js インスタンスオブジェクトにバインドされたすべてのデータは、自動的にリアクティブデータに変換されます。リアクティブデータは、文字列、数値、真偽値、配列、オブジェクトなどの基本データ型のみをサポートしています。関数やクラスインスタンスなどの複雑なデータ型については、**非リアクティブプロパティ**として保存する必要があり、これらのプロパティの変更はコンポーネントの再レンダリングをトリガーしません。

## 非レスポンシブデータ

時折、Promise インスタンス、正規表現オブジェクト、またはその他の複雑なオブジェクトなど、リアクティブな更新の必要がないデータを保存する必要があります。その場合は非リアクティブなプロパティを使用します。これらのプロパティの変更はコンポーネントの再レンダリングを引き起こさず、ビューと連動する必要がないデータの保存に適しています。

非応答性プロパティの命名は通常、プロパティ名の前にアンダースコア `_` を接頭辞として追加し、応答性プロパティとの区別を示します。

<o-playground name="非応答データの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue増加</button>
      <button on:click="_count2++">Green増加</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

`Green increments`ボタンをクリックすると、`_count2`の数値は実際には増加しているが、それは非リアクティブなプロパティであるためビューの更新がトリガーされず、インターフェース上の表示は変化しない。`Blue increases`ボタンをクリックすると、`count`はリアクティブなプロパティであるためコンポーネント全体の再レンダリングがトリガーされ、その際に初めてGreenの表示内容が同期して更新される。

非応答型のオブジェクトデータは、応答型のオブジェクトデータよりもパフォーマンスが優れています。なぜなら、非応答型データはコンポーネントの再レンダリングをトリガーしないからです。


