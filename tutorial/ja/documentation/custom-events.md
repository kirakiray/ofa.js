# カスタムイベント

ofa.jsでは、組み込みのDOMイベントに加えて、カスタムイベントを作成して使用し、コンポーネント間の通信を実現することができます。カスタムイベントはコンポーネント開発における重要なメカニズムであり、コンポーネントが上位にメッセージや状態変化をブロードキャストすることを可能にします。

## emit メソッド - カスタムイベントをトリガーする

`emit` メソッドはカスタムイベントを発行し、コンポーネント内部の状態変化やユーザー操作を外部のリスナーに通知するために使用されます。

### 基本的な使い方

```javascript
// シンプルなカスタムイベントをトリガーする
this.emit('custom-event');

// データ付きのカスタムイベントをトリガーする
this.emit('data-changed', {
  data: {
    // カスタムデータ、必要に応じて任意の構造で設定可能
    newValue: 100,
    oldValue: 50
  }
});
```

### emit メソッドの引数

`emit` メソッドは2つの引数を受け取ります：

1. **イベント名**：文字列、トリガーするイベントの名前を表す
2. **オプションオブジェクト**（任意）：イベント設定オプションを含む
   - `data`：渡すデータ
   - `bubbles`：ブール値、イベントをバブリングさせるかどうか（デフォルトは true）
   - `composed`：ブール値、イベントが Shadow DOM の境界を越えられるかどうかを制御する
   - `cancelable`：ブール値、イベントをキャンセル可能にするかどうかを制御する

そして上位要素は`on`メソッド [（イベントバインディング）](./event-binding.md) を使用してこのカスタムイベントを監視できます。

### emit 使用例

<o-playground name="emit 使用示例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./my-component.html"></l-m>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <h3 style="color:blue;">{{val}}</h3>
      <my-component on:button-clicked="handleButtonClick"></my-component>
      <script>
        export default async () => {
          return {
            data: {
              val: "ofajs",
            },
            proto: {
              handleButtonClick(event) {
                this.val = JSON.stringify(event.data);
              }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="my-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
        }
      </style>
      <button on:click="handleClick">クリックしてイベントをトリガー</button>
      <script>
        export default async () => {
          return {
            tag: "my-component",
            proto: {
              handleClick() {
                this.emit('button-clicked', {
                  data: {
                    message: 'ボタンがクリックされました',
                    timestamp: Date.now()
                  },
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## bubbles - イベントバブリングメカニズム

`bubbles` 属性は、イベントが親要素にバブルアップするかどうかを制御します。`true` に設定すると、イベントは DOM ツリーを上方向に伝播します。デフォルト値は `true` です。`false` に設定すると、イベントはバブルしません。

### バブルメカニズムの詳細解説

- **デフォルト動作**：`emit`で発行されるイベントはデフォルトでバブリングが有効（`bubbles: true`）
- **バブリング経路**：イベントはトリガー要素から始まり、段階的に上位へ伝播します
- **バブリングの停止**：イベントハンドラ内で`event.stopPropagation()`を呼び出すとバブリングを停止できます

### バブルソートの例

<o-playground name="カスタムイベント例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component on:child-event="handleDirectChildEvent"></bubble-component>
      </div>
      <p>外側コンテナ（バブリングイベントを監視）: {{bubbledEventCount}} 回</p>
      <p>内側コンポーネント（直接イベントを監視）: {{directEventCount}} 回</p>
      <p>受信したデータ: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
              directEventCount: 0
            },
            proto: {
              handleDirectChildEvent(event) {
                this.directEventCount++;
                this.result = event.data;
              },
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonBubblingEvent">非バブリングイベントをトリガー</button>
      <button on:click="triggerBubblingEvent">バブリングイベントをトリガー</button>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            proto: {
              triggerNonBubblingEvent() {
                // 非バブリングイベント、直接リスナーのみがキャッチ
                this.emit('child-event', {
                  data: { type: 'non-bubbling', message: '非バブリングイベントがトリガーされました', timestamp: Date.now() },
                  bubbles: false
                });
              },
              triggerBubblingEvent() {
                // バブリングイベント、親要素へ伝播
                this.emit('child-event', {
                  data: { type: 'bubbling', message: 'バブリングイベントがトリガーされました', timestamp: Date.now() },
                  bubbles: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## composed - Shadow DOM の境界を貫通する

`composed` プロパティは、イベントが Shadow DOM の境界を通過できるかどうかを制御します。これは Web Components の開発において特に重要であり、デフォルト値は `false` です。

### 貫通メカニズム詳解

- **Shadow DOM 隔離**：デフォルトでは、イベントは Shadow DOM の境界を越えられない
- **透過を有効化**：`composed: true` を設定すると、イベントが Shadow DOM の境界を越えて伝播される
- **使用シーン**：コンポーネントがホスト環境にイベントを送信する必要がある場合、`composed: true` を設定する必要がある

### 透過サンプル

<o-playground name="データ付きカスタムイベントの例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./bubble-component.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid blue;
        }
      </style>
      <div on:child-event="handleChildEventFromComponent">
        <bubble-component></bubble-component>
      </div>
      <p>イベント監視: {{bubbledEventCount}} 回</p>
      <p>受信したデータ: <span style="color:red;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="bubble-component.html">
    <template component>
      <l-m src="./child-component.html"></l-m>
      <style>
        :host{
          display: block;
          padding: 15px;
          border: 1px solid gray;
        }
      </style>
      <child-component on:child-event="handleChildEventFromComponent"></child-component>
      <p>イベント監視: {{bubbledEventCount}} 回</p>
      <p>受信したデータ: <span style="color:pink;">{{result}}</span></p>
      <script>
        export default async () => {
          return {
            tag: "bubble-component",
            data: {
              result:"-",
              bubbledEventCount: 0,
            },
            proto: {
              handleChildEventFromComponent(event) {
                this.bubbledEventCount++;
                this.result = event.data;
              },
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="child-component.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid green;
        }
      </style>
      <button on:click="triggerNonComposedEvent">非透過イベントをトリガー</button>
      <button on:click="triggerComposedEvent">透過イベントをトリガー</button>
      <script>
        export default async () => {
          return {
            tag: "child-component",
            proto: {
              triggerNonComposedEvent() {
                // 非透過イベント、直接の監視者のみがキャプチャします
                this.emit('child-event', {
                  data: { type: 'non-composed', message: '非透過イベントトリガー', timestamp: Date.now() },
                  composed: false
                });
              },
              triggerComposedEvent() {
                // 透過イベント、Shadow DOM の境界を越えます
                this.emit('child-event', {
                  data: { type: 'composed', message: '透過イベントトリガー', timestamp: Date.now() },
                  composed: true
                });
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

