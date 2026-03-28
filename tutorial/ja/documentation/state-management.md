# 状態管理

## 状態とは何か

ofa.jsでは、**状態**とは、コンポーネントまたはページモジュール自身の `data` プロパティのことを指します。この状態は現在のコンポーネント上でのみ使用でき、当該コンポーネントの内部データを保存・管理します。

複数のコンポーネントやページで同じデータを共有する必要がある場合、従来の方法ではイベントの伝搬やpropsを階層的に渡していましたが、この方法は複雑なアプリケーションではコードの保守が困難になります。そのため、**状態管理**が必要となります――共有される状態オブジェクトを定義し、複数のコンポーネントやページモジュールがそのデータにアクセス・変更できるようにすることで、状態の共有を実現します。

> **ヒント**：状態管理は、ユーザー情報、ショッピングカート、テーマ設定、グローバル設定など、コンポーネントやページをまたいでデータを共有する必要があるシナリオに適しています。

## ステータスオブジェクトの生成

`$.stanz({})` を使ってリアクティブな状態オブジェクトを作成します。このメソッドは、通常のオブジェクトを初期データとして受け取り、リアクティブな状態プロキシを返します。

### 基本的な使い方

<o-playground name="状態管理の例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // アプリケーションのホームページアドレス
    export const home = "./list.html";
    // ページ切り替えアニメーション設定
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "ピート",
        info: "毎日が新しい始まり、雨の後には必ず太陽が輝く。",
    },{
        id: 10020,
        name: "マイク",
        info: "人生は海のようで、意志の強い人だけが対岸にたどり着ける。",
    },{
        id: 10030,
        name: "ジョン",
        info: "成功の秘訣は自分の夢を諦めずに貫き通すことにある。",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>アドレス帳</h2>
      <ul>
        <o-fill :value="list">
          <li>
          名前: {{$data.name}} <button on:click="$host.gotoDetail($data)">詳細</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // コンポーネント破棄時、マウントされた状態データをクリア
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">戻る</button> </div>
      <div class="user-info">
        <div class="avatar">アバター</div>
        <div style="font-size: 24px;">
        ユーザー名: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">ユーザーID: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // コンポーネント破棄時、マウントされた状態データをクリア
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 状態オブジェクトの特性

### 1. レスポンシブ更新

`$.stanz()` で作成された状態オブジェクトはリアクティブです。状態データが変更されたとき、そのデータを参照するすべてのコンポーネントは自動的に更新されます。

```javascript
const store = $.stanz({ count: 0 });

// コンポーネント内
export default {
  data: {
    store: {}
  },
  proto:{
    increment() {
        store.count++; // store.count を参照しているすべてのコンポーネントが自動的に更新される
    }
  },
  attached() {
    // 状態オブジェクトのプロパティを直接参照
    this.store = store;
  },
  detached(){
    this.store = {}; // コンポーネントが破棄される際、マウントされた状態データをクリア
  }
};
```

### 2. ディープリアクティビティ

ステートオブジェクトは深いリアクティビティをサポートしており、ネストされたオブジェクトや配列の変更も監視されます。

```javascript
const store = $.stanz({
  user: {
    name: "张三",
    settings: {
      theme: "dark"
    }
  },
  list: []
});

// ネストされたプロパティの変更も更新をトリガーする
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新しいタスク" });
```

## ベストプラクティス

### 1. コンポーネントのattached段階でステータスをマウントする

コンポーネントの`attached`ライフサイクルで共有状態をマウントすることをお勧めします：

```javascript
export default {
  data: {
    list: []
  },
  attached() {
    // 共有状態をコンポーネントの data にマウントする
    this.list = data.list;
  },
  detached() {
    // コンポーネント破棄時、マウントされた状態データをクリアし、メモリリークを防ぐ
    this.list = [];
  }
};
```

### 2. 状態のスコープを合理的に管理する

- **グローバル状態**：アプリ全体からアクセスする必要があるデータ（ユーザー情報、グローバル設定など）に適用
- **モジュール状態**：特定の機能モジュール内で共有するデータに適用

```javascript
// グローバル呼び出し状態
export const globalStore = $.stanz({ user: null, theme: "light" });

// モジュール内で使用する状態
const cartStore = $.stanz({ total: 0 });
```

## モジュール内状態管理

<o-playground name="モジュール内状態管理例" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">Add Item</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Add Store Total</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // コンポーネント破棄時、マウントされた状態データをクリア
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

1. **状態のクリーンアップ**：コンポーネントの `detached` ライフサイクルにおいて、状態データへの参照をタイムリーにクリーンアップし、メモリリークを回避する。

2. **循環依存を避ける**：状態オブジェクト間で循環参照を形成しないようにし、これがリアクティブシステムに問題を引き起こす可能性がある。

3. **大規模なデータ構造**：大規模なデータ構造については、算出プロパティや分割管理を検討し、不要なパフォーマンスオーバーヘッドを回避する。

4. **状態の一貫性**：非同期操作において状態の一貫性に注意し、トランザクションやバッチ更新を使用してデータの整合性を保証できる。

