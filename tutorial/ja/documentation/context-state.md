# コンテキスト状態

コンテキスト状態は、ofa.jsにおけるコンポーネント間データ共有のメカニズムです。プロバイダー（Provider）とコンシューマー（Consumer）のパターンを通じて、親子コンポーネントや階層をまたがるコンポーネント間でのデータ受け渡しを実現でき、propsを介した階層的な受け渡しの必要がなくなります。

## 核心概念

- **o-provider**: データプロバイダー、共有が必要なデータを定義する
- **o-consumer**: データコンシューマー、最も近いプロバイダーからデータを取得する
- **watch:xxx**: コンシューマーのデータ変更を監視し、コンポーネントまたはページモジュールのプロパティにバインドする

## o-provider 提供者

`o-provider` コンポーネントは共有データのプロバイダーを定義するために使用されます。`name` 属性を通じて自身の名前を識別し、属性（例：`custom-a="value"`）を通じて共有する必要のあるデータを定義します。

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  ...
</o-provider>
```

### 属性

- `name`: プロバイダーの一意の識別名。消費者が対応するプロバイダーを検索するために使用されます。

### 特徴

1. **自動属性伝達**: provider 上のすべての非予約属性は共有データとして渡される
2. **リアクティブ更新**: provider のデータが変化すると、その provider を name 指定で消費している consumer が自動的に更新される
3. **階層検索**: コンシューマーは最も近い上位の provider から対応する name のデータを検索する

## o-consumer 消費者

`o-consumer` コンポーネントは、プロバイダーのデータを消費（使用）するために使われます。`name` 属性によって消費するプロバイダーの名前を指定します。

```html
<o-consumer name="userInfo"></o-consumer>
```

### 属性

- `name`: 消費するプロバイダ名

### 特徴

1. **自動データ取得**: consumerは最近の上位provider内の対応するnameのデータを自動的に取得します  
2. **属性マージ**: 複数の同じnameを持つproviderが同じ属性を持つ場合、consumerに最も近いproviderの属性が優先されます  
3. **属性監視**: `watch:xxx`を使って特定の属性の変化を監視できます

## データ変更の監視

`watch:xxx` を使用してプロバイダーデータの変更を監視できます：

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## 基本の例

<o-playground name="基礎例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>ユーザーID: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      {{userId}}アバター
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      User-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider ルートプロバイダー

`o-root-provider` はルートレベルのグローバルプロバイダーであり、そのスコープはドキュメント全体です。親プロバイダーが存在しない場合でも、コンシューマーはルートプロバイダーのデータを取得できます。

```html
<!-- グローバルルートプロバイダーを定義 -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- ページのどこでも消費可能 -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### 特徴

1. **グローバルスコープ**: ルートプロバイダーのデータはページ全体で利用可能
2. **優先順位**: 同じ name を持つ provider と root-provider が同時に存在する場合、コンシューマーに最も近い provider が優先される
3. **削除可能**: root-provider を削除すると、コンシューマーは他の provider を探すようにフォールバックする

## root-provider の例

<o-playground name="root-provider サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>テーマ: {{theme}}</div>
        <div>言語: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      ヘッダー - テーマ: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      コンテンツ - 言語: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### 優先順位の例

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- ここ👇で取得されるcustom-valueは "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- ここ👇で取得されるcustom-valueは "root" -->
<o-consumer name="test"></o-consumer>

```

### 優先度の例示デモ

<o-playground name="優先度サンプルデモ" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>親 Provider の値: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>ルート Provider の値: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        子コンポーネントの値: {{customValue}} (最も近いのは {{customValue}} provider)
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## getProvider(name) メソッド

`getProvider(name)` はインスタンスメソッドで、対応する name のプロバイダー要素を取得するために使用されます。DOM 上を遡って最も近い上位の provider を探し、見つからなければ root-provider を返します。

### コンポーネントまたはページモジュール内で getProvider(name) メソッドを使用する

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "新しい値";
  }
}
...
</script>
```

## getProvider 例

<o-playground name="getProvider 示例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="张三" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Provider データを取得</button>
      <div>現在の名前: {{currentName}}</div>
      <div>現在の年齢: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Provider データを更新</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider が見つかりました:", provider);
                console.log("名前:", provider.customName);
                console.log("年齢:", provider.customAge);
                alert(`Provider データ: ${provider.customName}, ${provider.customAge}歳`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "李四";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### 要素からプロバイダーを取得する

```javascript
// 現在の要素の上位のプロバイダーを取得
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("プロバイダーを見つけました:", provider.customName);
}

// グローバル root-provider を直接取得
const globalProvider = $.getRootProvider("globalConfig");
```

### 使用シーン

1. **手動でデータを取得**: プロバイダーのデータに直接アクセスする必要があるシナリオで使用
2. **Shadow DOM を横断**: Shadow DOM 内で上位のプロバイダーを探す
3. **イベント処理**: イベントコールバックで対応するプロバイダーを取得

## dispatch イベントディスパッチ

provider は、それを消費するすべての consumer にイベントを配信できます：

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// イベントをディスパッチ
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## イベントディスパッチの例

<o-playground name="イベントディスパッチ例" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["チャットルームへようこそ"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>チャットルーム</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="メッセージを入力...">
      <button on:click="sendMessage">送信</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## ベストプラクティス

1. **合理的な命名**: provider と consumer に意味のある name を付け、追跡と保守を容易にする  
2. **過度な使用を避ける**: コンテキスト状態はコンポーネント間でデータを共有する場合に適しており、通常の親子コンポーネントには props の使用を推奨  
3. **ルートプロバイダーはグローバル設定に使用**: テーマ、言語、グローバル状態などは root-provider に適している  
4. **タイムリーなクリーンアップ**: provider が削除されると、consumer はデータを自動的にクリアするため、手動での処理は不要