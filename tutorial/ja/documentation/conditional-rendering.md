# 条件付きレンダリング

ofa.jsにおいて、条件レンダリングは重要な機能であり、データの状態に基づいて特定の要素やコンポーネントをレンダリングするかどうかを決定できる。ofa.jsはコンポーネントベースの条件レンダリングソリューションを提供し、`o-if`、`o-else-if`、および`o-else`コンポーネントによって実現される。

## o-if コンポーネント

`o-if` コンポーネントは、式の真偽値に基づいてその内容をレンダリングするかどうかを決定するために使用されます。バインドされた `value` 属性が真値の場合、コンポーネント内の内容がレンダリングされます。それ以外の場合、内容は DOM に表示されません。

<o-playground name="o-if 動作原理示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">表示切替</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "ofa.jsデモコード",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### o-if の仕組み

`o-if` は条件が真の場合のみ内容を DOM にレンダリングし、条件が偽の場合、o-if 内の DOM 要素は完全に削除されます。この実装方法は、条件の変化があまり頻繁でない場合に適しています。なぜなら、DOM の作成と破棄が関わるからです。

## o-else-if と o-else コンポーネント

複数の条件分岐が必要な場合、`o-else-if` と `o-else` コンポーネントを `o-if` と組み合わせて使用することで、多分岐条件レンダリングを実現できます。

- `o-if`：必須の最初の条件コンポーネント
- `o-else-if`：オプションの中間条件コンポーネントで、複数存在可能
- `o-else`：オプションのデフォルト条件コンポーネントで、最後に配置

<o-playground name="多分岐条件レンダリングの例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">表示を切り替え - {{num}}</button>
      <!-- num を 3 で割った余りの結果に基づいて、異なる内容を表示 -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 実際の応用シーン例

### ユーザー権限管理

<o-playground name="ユーザー権限制御の例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">ユーザーロールを切り替える</button>
        <p>現在のロール: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>管理者パネル</h3>
            <button>ユーザー管理</button>
            <button>システム設定</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>ユーザー情報</h3>
            <p>ようこそ {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>コンテンツを表示するにはログインしてください</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'ゲスト'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = '張三';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### フォーム検証ステータス表示

<o-playground name="フォーム検証ステータス表示示例" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <div>
        <h3>メールアドレス検証示例</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="メールアドレスを入力">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ メールアドレスの形式が正しいです</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ メールアドレスの形式が正しくありません</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">検証のためにメールアドレスを入力してください</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 条件レンダリングのベストプラクティス

1. **使用シーン**：要素が異なる条件下でめったに切り替わらない場合、`o-if` を使用する方が適しています。不要な要素を完全に削除できるため、メモリを節約できます。

2. **パフォーマンスの考慮**：頻繁に切り替わる要素は、条件付きレンダリングよりもクラスバインディング（例：`class:hide`）の方が適しています。条件付きレンダリングは DOM の作成と破棄を伴うためです。

3. **構造の明確さ**：条件付きレンダリングは、異なる構造を持つコンテンツの切り替え、例えばタブやステップガイドなどに特に適しています。