# 算出プロパティ

計算プロパティは、リアクティブデータに基づいて新しいデータを派生させる方法であり、依存するデータの変化に応じて自動的に更新されます。ofa.jsでは、計算プロパティは`proto`オブジェクト内で定義される特別なメソッドであり、JavaScriptの`get`または`set`キーワードを使用して定義されます。

## 特徴と利点

- **キャッシュ性**：算出プロパティの結果はキャッシュされ、依存するデータが変化した場合にのみ再計算される
- **リアクティブ**：依存するデータが更新されると、算出プロパティは自動的に更新される
- **宣言的**：宣言的な方法で依存関係を作成し、コードをより明確かつ理解しやすくする

## get 計算プロパティ

get 算出プロパティは、リアクティブデータから新しい値を派生させるために使用され、引数を取らず、他のデータに基づいて計算された値のみを返します。

<o-playground name="get 計算プロパティの例" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>計算プロパティ countDouble の値は：{{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble がアクセスされました');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 実際の応用シーン例

算出プロパティは複雑なデータ変換ロジックの処理に一般的に使用され、例としては配列のフィルタリングや表示テキストの書式設定などが挙げられます。

<o-playground name="計算プロパティの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="名前でフィルタリング...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['張3', '李4', '王54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set 計算プロパティ

set 計算プロパティは、代入操作によって根本的なデータの状態を変更することを許可します。それは引数を一つ受け取り、通常、それに依存する元のデータを逆方向で更新するために使われます。

<o-playground name="set 計算プロパティの例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <div>
        <p>基礎値: {{count}}</p>
        <p>2倍値: {{countDouble}}</p>
        <button on:click="resetCount">カウントをリセット</button>
        <button on:click="setCountDouble">2倍値を10に設定</button>
        <button on:click="incrementCount">基礎値を増加</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // countが負数にならないようにする
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 計算プロパティ vs メソッド

メソッドでも同様の機能を実現できますが、算出プロパティはキャッシュ機能を持ち、依存するデータが変更されたときにのみ再評価されるため、パフォーマンスが優れています。

```javascript
// 計算プロパティを使用（推奨）- キャッシュあり
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// メソッドを使用 - 呼び出しごとに実行される
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## 注意事項

1. **非同期操作の回避**：算出プロパティは同期処理で副作用のない状態を保ち、非同期呼び出しやコンポーネント状態の直接変更を禁止します。  
2. **依存関係の追跡**：必ずリアクティブデータのみに依存し、そうでない場合、更新が予期せぬ動作を引き起こす可能性があります。  
3. **エラー対策**：算出プロパティ内部で循環依存や異常な代入が発生した場合、レンダリングの失敗や無限ループを引き起こす可能性があるため、事前に境界条件を設定し、適切な例外処理を行うことが必須です。

## 実際の応用例

以下に、算出プロパティの実用性を示すシンプルなフォーム検証の例を示します：

<o-playground name="フォーム検証サンプル" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>シンプルな検証サンプル</h3>
      <input type="text" sync:value="username" placeholder="ユーザー名を入力(最低3文字)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        ステータス: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'ユーザー名は有効です' : 'ユーザー名が短すぎます';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

