# イベントバインディング

ofa.jsでは、イベントバインディングはユーザーインタラクションを実現する重要なメカニズムです。あなたは様々な方法で要素にイベントハンドラをバインドし、ユーザーの操作に応答することができます。

## proto からイベントをバインド

これは推奨されるイベントバインディングの方法で、複雑なイベント処理ロジックに適しています。イベント処理関数を `proto` オブジェクト内で定義することで、コードロジックをより良く整理でき、メンテナンスや再利用が容易になります。

<o-playground name="protoからのイベントバインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto:{
              clickMe(){
                this.count++;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 直接に関数を実行する

単純な操作（カウンタの増加や状態の切り替えなど）については、イベント属性に短い式を直接記述できます。この方法は簡潔で分かりやすく、単純なロジックの処理に適しています。

<o-playground name="直接実行関数" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="count++">Click Me - {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## サポートされるイベントタイプ

ofa.js は、以下を含むすべての標準 DOM イベントをサポートしています：

- マウスイベント：`click`、`dblclick`、`mousedown`、`mouseup`、`mouseover`、`mouseout` など
- キーボードイベント：`keydown`、`keyup`、`keypress` など
- フォームイベント：`submit`、`change`、`input`、`focus`、`blur` など
- タッチイベント：`touchstart`、`touchmove`、`touchend` など

ofa.jsでサポートされるイベントタイプは、ネイティブDOMイベントと完全に一致します。詳細については、[MDNイベントドキュメント](https://developer.mozilla.org/ja/docs/Web/API/Event)を参照してください。

## イベントハンドラへのパラメータ受け渡し

イベントハンドラに引数を渡すこともできます：

<o-playground name="イベントハンドラーへの引数渡し" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="addNumber(5)">5を加算 - 現在: {{count}}</button>
      <button on:click="addNumber(10)">10を加算 - 現在: {{count}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
            },
            proto: {
              addNumber(num) {
                this.count += num;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## イベントオブジェクトへのアクセス

イベントハンドラでは、`event` パラメータを通じてネイティブイベントオブジェクトにアクセスできます：

<o-playground name="イベントオブジェクトへのアクセス" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .container {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="container" on:click="handleClick">クリックして座標を表示</div>
      <p>X: {{x}}, Y: {{y}}</p>
      <script>
        export default async () => {
          return {
            data: {
              x: 0,
              y: 0,
            },
            proto: {
              handleClick(event) {
                this.x = event.clientX;
                this.y = event.clientY;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

また、`$event` パラメータを使用して式内でネイティブイベントオブジェクトにアクセスすることもできます。例えば、マウスクリックの座標を取得する場合：

```html
<div class="container" on:click="handleClick($event)">任意の場所をクリックして座標を表示</div>
```

## カスタムイベントのリスニング

ネイティブDOMイベントをリッスンするだけでなく、コンポーネントが発行するカスタムイベントも簡単にリッスンできます：

```html
<custom-comp on:custom-event="handleCustomEvent"></custom-comp>
```

カスタムイベントについて詳しく知りたい場合は、[カスタムイベント](custom-events.md)の章を参照してください。チュートリアルの順序に従って段階的に進めることをお勧めします。そうすれば、後の内容が自然に展開されます。もちろん、事前に理解を深めるためにいつでも参照することも歓迎します。