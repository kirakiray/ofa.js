# ライフサイクル

ofa.jsコンポーネントは完全なライフサイクルフック関数を備えており、コンポーネントの異なる段階で特定のロジックを実行できます。これらのフック関数により、コンポーネントの作成、マウント、更新、破棄などの重要なタイミングで介入し、対応する操作を実行することができます。

## ライフサイクルフック関数

ofa.js は以下の主要なライフサイクルフック関数を提供しており、一般的に使用される順に並べています：

### attached



`attached` フックは、コンポーネントがドキュメントに挿入されたときに呼び出され、コンポーネントがページにマウントされたことを示します。これは最もよく使用されるライフサイクルフックであり、通常、コンポーネントが実際にページ上に表示された後にのみ実行できる初期化操作を行うために使用され、コンポーネントが不可視の状態で不必要な計算を実行することを防ぎます。このフックは、コンポーネントがページにレンダリングされていることに依存する、要素サイズの測定やアニメーションの開始などの操作にも非常に適しています。

- **呼び出しタイミング**: コンポーネントが DOM ツリーに追加されたとき
- **主な用途**: タイマーの起動、イベントリスナーの追加、可視性を必要とする操作の実行

### detached



`detached` フックは、コンポーネントがドキュメントから削除される際に呼び出され、コンポーネントがまもなくアンロードされることを示します。このフックは、タイマーのクリアやイベントリスナーの削除など、リソースのクリーンアップに適しています。

- **呼び出しタイミング**: コンポーネントがDOMツリーから削除される時
- **主な用途**: リソースのクリーンアップ、サブスクリプションの解除、イベントリスナーの削除

### ready



`ready` フックはコンポーネントの準備が整ったときに呼び出され、この時点でコンポーネントのテンプレートはすでにレンダリングされ、DOM要素は作成されているが、まだ文書に挿入されていない可能性がある。このフックはDOM操作やサードパーティライブラリの初期化に適している。

- **呼び出しタイミング**: コンポーネントテンプレートのレンダリングが完了し、DOMが作成された時点
- **主な用途**: DOMに依存する初期化操作を実行する

### loaded



`loaded` フックは、コンポーネントとそのすべての子コンポーネント、非同期リソースがすべてロードされた後にトリガーされ、この時点でローディング状態を安全に削除したり、完全なコンポーネントツリーに依存する後続の操作を実行したりできます。依存がなければ、`ready` フックの後に呼び出されます。

- **呼び出しタイミング**: コンポーネントとその子コンポーネントが完全にロードされた時
- **主な用途**: 完全なコンポーネントツリーに依存する操作を実行する

## ライフサイクル実行順序

コンポーネントのライフサイクルフックは以下の順序で実行されます：

2. `ready` - コンポーネントが準備完了（DOMが作成済み）
3. `attached` - コンポーネントがDOMにマウントされる
4. `loaded` - コンポーネントが完全に読み込まれる

コンポーネントがDOMから削除されるとき、`detached`フックが呼び出されます。

## 使用例

以下の例は、コンポーネントでライフサイクルフック関数を使用する方法を示しています：

<o-playground name="ライフサイクル例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .counter {
          margin: 10px 0;
        }
        button {
          margin-right: 10px;
          padding: 5px 10px;
        }
      </style>
      <h3>ライフサイクルデモ</h3>
      <div class="counter">カウンタ: {{count}}</div>
      <button on:click="count += 10">10増加</button>
      <button on:click="removeSelf">コンポーネントを削除</button>
      <div class="log">
        <h4>ライフサイクルログ:</h4>
        <ul>
          <o-fill :value="logs">
            <li>{{$data}}</li>
          </o-fill>
        </ul>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              logs: [],
            },
            proto: {
              removeSelf() {
                this.remove(); // DOMから自身を削除してdetachedフックをトリガー
              },
              addLog(message) {
                this.logs = [...this.logs, `${new Date().toLocaleTimeString()} - ${message}`];
              }
            },
            ready() {
              this.addLog("ready: コンポーネントが準備完了、DOMが作成されました");
              console.log("コンポーネントが準備完了");
            },
            attached() {
              this.addLog("attached: コンポーネントがDOMにマウントされました");
              this._timer = setInterval(() => {
                this.count++;
              }, 1000);
              console.log("コンポーネントがマウントされました");
            },
            detached() {
              this.addLog("detached: コンポーネントがDOMから削除されました");
              // タイマーをクリアしてメモリリークを防ぐ
              clearInterval(this._timer); 
              console.log("コンポーネントがアンロードされました");
            },
            loaded() {
              this.addLog("loaded: コンポーネントが完全に読み込まれました");
              console.log("コンポーネントが完全に読み込まれました");
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、異なるライフサイクルフックの実行順序とタイミングを観察できます。「コンポーネントを削除」ボタンをクリックすると、`detached` フックがトリガーされることがわかります。

## 実際の応用シーン

### 初期化操作

`ready` フックでのデータ初期化：

```javascript
export default async () => {
  return {
    data: {
      items: []
    },
    ready() {
      // DOM操作
      this.initDomElements();
    }
  };
};
```

### リソース管理

`attached` フックでタイマーを起動し、`detached` フックでリソースをクリーンアップします：

```javascript
export default async () => {
  return {
    data: {
      timer: null
    },
    attached() {
      // タイマーを起動
      this.timer = setInterval(() => {
        console.log('定期タスク実行');
      }, 1000);
    },
    detached() {
      // タイマーをクリーンアップ
      if(this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };
};
```

ライフサイクルフック関数は ofa.js コンポーネント開発における重要な概念であり、これらを正しく使用することで、コンポーネントの状態とリソースをより適切に管理し、アプリケーションのパフォーマンスを向上させることができます。

