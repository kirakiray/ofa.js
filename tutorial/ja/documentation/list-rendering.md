# リストレンダリング

ofa.jsでは、`o-fill`コンポーネントは強力なリストレンダリング機能を提供し、配列データを複数の類似した要素として効率的にレンダリングできます。直接レンダリングとテンプレートレンダリングという2つの主要な使用方法をサポートしています。

## o-fill コンポーネント紹介

`o-fill` は ofa.js におけるリストレンダリングのコアコンポーネントであり、配列型の `value` 属性を受け取り、配列内の各項目に対応する DOM 要素を生成します。レンダリングプロセスにおいて、ofa.js は自動的に配列の変更を追跡し、効率的に DOM を更新します。

### 主な機能：

- **効率的な更新**：キー値による配列変更の追跡により、変更が必要な部分のみを更新
- **インデックスアクセス**：`$index` を通じて現在の項目のインデックスにアクセス
- **データアクセス**：`$data` を通じて現在の項目のデータにアクセス
- **ホストアクセス**：`$host` を通じて現在のコンポーネントインスタンスにアクセスし、コンポーネントメソッドの呼び出しやコンポーネントデータへのアクセスが可能
- **テンプレート再利用**：名前付きテンプレートを使用した複雑なリストレンダリングをサポート

## 直接レンダリング

直接レンダリングは最もシンプルな使用方式で、テンプレートの内容を `o-fill` タグの内部に直接記述します。配列が変化すると、`o-fill` は各データ項目に対応する要素を自動的に作成します。

<o-playground name="o-fill - 直接レンダリング" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>フルーツリスト</h3>
      <button on:click="addItem">フルーツを追加</button>
      <button on:click="removeItem">最後を削除</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - 価格: ¥{{$data.price}} <button on:click="$host.removeItem($index)">削除</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 りんご", price: 5 },
              { name: "🍊 オレンジ", price: 6 },
              { name: "🍌 バナナ", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 ぶどう", "🍓 いちご", "🥝 キウイ", "🍑 もも", "🥭 マンゴー"];
              const name = fruitNames[this.fruitIndex % fruitNames.length];
              this.fruits.push({ 
                name: name, 
                price: Math.floor(Math.random() * 10) + 1 
              });
              this.fruitIndex++;
            },
            removeItem(index) {
              if (index >= 0 && index < this.fruits.length) {
                this.fruits.splice(index, 1);
                return;
              }
              this.fruits.length && this.fruits.pop();
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

この例では、次のことがわかります：- `$index` は現在の項目のインデックスを表します（0から開始）
- `$data` は現在の項目のデータオブジェクトを表します
- `$host` は現在のコンポーネントインスタンスを表し、コンポーネントメソッドの呼び出しやコンポーネントデータへのアクセスに使用できます
- 配列が変更されると、リストは自動的に更新されます

## テンプレートレンダリング

より複雑なリスト項目の構造には、名前付きテンプレートの方法を使用できます。テンプレートを `template` タグ内に定義し、`o-fill` 内で `name` 属性を通じて参照します。

<o-playground name="o-fill - テンプレートレンダリング" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>商品リスト</h3>
      <button on:click="addProduct">商品を追加</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>番号: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "高性能ノートパソコン、プロフェッショナルワークに適しています" },
              { name: "iPhone 15", price: 5999, description: "最新モデルのスマートフォン、写真撮影効果が優れています" },
              { name: "AirPods Pro", price: 1999, description: "ワイヤレスノイズキャンセリングイヤホン、音質優秀" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["軽量で携帯性に優れたタブレット", "スマートウォッチ、健康モニタリング", "人間工学に基づいたデザインのマウス", "プロフェッショナルグレードのディスプレイ"];
              const name = productNames[this.productIndex % productNames.length];
              const desc = productDescs[this.productIndex % productDescs.length];
              this.products.push({
                name: name,
                price: Math.floor(Math.random() * 5000) + 1000,
                description: desc
              });
              this.productIndex++;
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

## ネストされたリストのレンダリング

`o-fill` はネストして使用することができ、ツリーメニューやカテゴリリストなどの複雑な階層データ構造を扱うことができます。

<o-playground name="o-fill - ネストされたリストレンダリング" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .category {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin: 10px 0;
        }
        .subcategory {
          border-left: 2px solid #9b59b6;
          padding-left: 15px;
          margin: 8px 0;
        }
        .item {
          padding: 5px 0;
          margin: 5px 0;
          color: #2c3e50;
        }
        h4 {
          margin: 10px 0 5px 0;
          color: #34495e;
        }
      </style>
      <h3>商品カテゴリナビゲーション</h3>
      <div class="navigation">
        <o-fill :value="categories" name="category-template"></o-fill>
      </div>
      <template name="category-template">
        <div class="category">
          <h4> {{$data.name}} </h4>
          <o-fill :value="$data.subcategories" name="subcategory-template"></o-fill>
        </div>
      </template>
      <template name="subcategory-template">
        <div class="subcategory">
          <strong>{{$data.name}}</strong>
          <o-fill :value="$data.items">
            <div class="item"> • {{$data}} </div>
          </o-fill>
        </div>
      </template>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "電子製品",
                  subcategories: [
                    {
                      name: "スマートフォン",
                      items: ["iPhone", "Androidスマートフォン", "フィーチャーフォン"]
                    },
                    {
                      name: "パソコン",
                      items: ["ノートPC", "デスクトップPC", "タブレット"]
                    }
                  ]
                },
                {
                  name: "家庭用品",
                  subcategories: [
                    {
                      name: "キッチン用品",
                      items: ["鍋", "食器", "小型家電"]
                    },
                    {
                      name: "ベッドルーム用品",
                      items: ["寝具", "ワードローブ", "装飾品"]
                    }
                  ]
                },
                {
                  name: "ファッション・アクセサリー",
                  subcategories: [
                    {
                      name: "メンズファッション",
                      items: ["Tシャツ", "シャツ", "アウター"]
                    },
                    {
                      name: "レディースファッション",
                      items: ["ワンピース", "ズボン", "アクセサリー"]
                    }
                  ]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## パフォーマンス最適化とキー値管理

頻繁に更新する必要があるリストについては、`fill-key` 属性を使用して一意の識別子を指定することで、レンダリングパフォーマンスを向上させることができます。

```html
<!-- カスタムキーを使用してパフォーマンスを向上 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

上の例では、`fill-key="id"` が ofa.js に各データ項目の `id` 属性を一意の識別子として使用するように指示しています。これにより、配列の順序が変更された場合でも、対応する要素を正しく識別して更新することができます。

## リストレンダリングのベストプラクティス

1. **イベント処理**：リスト項目でイベントを使用する場合、`$host`は現在のコンポーネントインスタンスを指し、`$data`は現在の項目データを指すことに注意
2. **適切なレンダリング方法の選択**：シンプルなリストは直接レンダリングを使用し、複雑な構造はテンプレートレンダリングを使用する
3. **パフォーマンスの考慮**：大きなリストや頻繁に更新されるリストの場合、`fill-key`を使用してキー値を指定する
4. **データ構造**：配列内の各項目が有効なデータオブジェクトであることを確認する
5. **深いネストの回避**：ネストはサポートされているが、過度に深いネストレベルは避けるべき