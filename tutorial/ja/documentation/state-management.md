# 状態管理

## 状態とは何か

ofa.jsでは、**状態**とはコンポーネントまたはページモジュール自身の `data` プロパティを指します。この状態は現在のコンポーネントでのみ使用でき、そのコンポーネントの内部データの保存と管理に使用されます。

当有多个组件或页面需要共享同一份数据时，传统的做法是通过事件传递或 props 层层传递，这种方式在复杂应用中会导致代码难以维护。因此需要**状态管理**——通过定义一个共享的状态对象，让多个组件或页面模块都可以访问和修改这份数据，从而实现状态的共享。

> **ヒント**：状態管理は、コンポーネントやページをまたいでデータを共有する必要があるシナリオに適しています。例えば、ユーザー情報、ショッピングカート、テーマ設定、グローバル設定などです。

## 生成状態オブジェクト

通过 `$.stanz({})` を使用して、リアクティブな状態オブジェクトを作成します。このメソッドは、初期データとして通常のオブジェクトを受け取り、リアクティブな状態プロキシを返します。

### 基本的な使い方

<o-playground name="状態管理サンプル" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // アプリのホームURL
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
        info: "毎日が新しい始まり、雨の後には必ず虹がかかる。",
    },{
        id: 10020,
        name: "マイク",
        info: "人生は海のようなもの、強い意志を持つ者だけが彼岸に辿り着ける。",
    },{
        id: 10030,
        name: "ジョン",
        info: "成功の秘訣は自分の夢を貫き、決して諦めないこと。",
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
      <h2>連絡先一覧</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Name: {{$data.name}} <button on:click="$host.gotoDetail($data)">詳細</button>
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
              this.list = []; // コンポーネント破棄時にマウント状態データをクリア
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
              this.userData = {}; // コンポーネント破棄時にマウント状態データをクリア
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 状態オブジェクトの特性

### 1. リアクティブ更新

`$.stanz()` で作成される状態オブジェクトはリアクティブです。状態データに変更が発生すると、そのデータを参照しているすべてのコンポーネントが自動的に更新されます。

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

状態オブジェクトは深いリアクティビティをサポートしており、ネストされたオブジェクトや配列の変更も監視されます。

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

// 修改嵌套属性也会触发更新
store.user.name = "李四";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "新任务" });
```

## ベストプラクティス

### 1. コンポーネントの attached フェーズでのマウント状態

コンポーネントの `attached` ライフサイクルで共有状態をマウントすることを推奨します：

```javascript
export default {
  data: {
    list: []
  },
  attached() {
    // 共有ステータスをコンポーネントの data にマウントする
    this.list = data.list;
  },
  detached() {
    // コンポーネント破棄時に、マウントしたステータスデータをクリアしてメモリリークを防ぐ
    this.list = [];
  }
};
```

### 2. 状態スコープの適切な管理

- **グローバル状態**：アプリケーション全体でアクセスが必要なデータ（ユーザー情報、グローバル設定など）に適しています
- **モジュール状態**：特定の機能モジュール内部で共有されるデータに適しています

```javascript
// グローバル呼び出し状態
export const globalStore = $.stanz({ user: null, theme: "light" });

// モジュール内で使用する状態
const cartStore = $.stanz({ total: 0 });
```

## モジュール内の状態管理

<o-playground name="モジュール内状態管理サンプル" style="--editor-height: 500px">
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
      <button on:click="addItem">アイテム追加</button>
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
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">合計追加</button>
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

1. **状態のクリーンアップ**：コンポーネントの `detached` ライフサイクルにおいて、状態データへの参照を速やかにクリーンアップし、メモリリークを回避する。

2. **循環依存を避ける**：状態オブジェクト間で循環参照を形成しないようにし、これによりリアクティブシステムに問題が生じる可能性がある。

3. **大規模データ構造**：大規模データ構造については、計算プロパティや分割管理を検討し、不要なパフォーマンスオーバーヘッドを回避する。

4. **状態の一貫性**：非同期操作において状態の一貫性に注意し、トランザクションやバッチ更新を用いてデータの整合性を保証できる。

