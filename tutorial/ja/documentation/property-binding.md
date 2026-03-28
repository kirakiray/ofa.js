# プロパティバインディング

ofa.js は、データを要素のインスタンス化後のオブジェクトのプロパティにバインドすることをサポートしています。例えば、input 要素の value や checked プロパティなどです。

## 一方向プロパティバインディング

単方向プロパティバインディングは `:toKey="fromKey"` という構文を使い、コンポーネントデータを「単方向」にDOM要素の属性に同期させる。コンポーネントデータが変化すると、要素属性は即座に更新されるが、要素自身の変化（ユーザー入力など）はコンポーネントに逆方向で書き戻されず、データフローを単一かつ制御可能に保つ。

<o-playground name="単方向属性バインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>現在の値: {{val}}</p>
      <input type="text" :value="val" placeholder="これは単方向バインディングの入力フィールドです">
      <p>注意：入力フィールドで直接内容を変更しても、上に表示される値は変わりません</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 双方向プロパティバインディング

双方向プロパティバインディングは `sync:xxx` 構文を採用し、コンポーネントデータとDOM要素の間で双方向の同期を実現します。コンポーネントデータが変化すると、DOM要素の属性が更新されます。DOM要素の属性が変化した場合（ユーザー入力など）、コンポーネントデータも同期して更新されます。

<o-playground name="双方向プロパティバインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>現在の値: {{val}}</p>
      <input type="text" sync:value="val" placeholder="これは双方向バインディングの入力フィールドです">
      <p>ヒント：入力フィールドの内容を変更すると、上に表示される値がリアルタイムで更新されます</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 双方向バインディングの特徴

- データフロー：コンポーネント ↔ DOM要素（双方向）
- コンポーネントのデータ変化 → DOM要素の更新
- DOM要素の変化 → コンポーネントのデータ更新
- ユーザー入力とデータの同期が必要なシーンに適しています

### 一般的な双方向バインディングシナリオ

<o-playground name="フォーム双方向バインディング例" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>フォーム双方向バインディング例</h3>
      <div class="form-group">
        <label>テキスト入力:</label>
        <input type="text" sync:value="textInput" placeholder="テキストを入力">
      </div>
      <div class="form-group">
        <label>数値入力:</label>
        <input type="number" sync:value="numberInput" placeholder="数値を入力">
      </div>
      <div class="form-group">
        <label>複数行テキスト:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="複数行テキストを入力"></textarea>
      </div>
      <div class="form-group">
        <label>選択ボックス:</label>
        <select sync:value="selectedOption">
          <option value="">選択してください...</option>
          <option value="option1">オプション1</option>
          <option value="option2">オプション2</option>
          <option value="option3">オプション3</option>
        </select>
      </div>
      <div class="form-group">
        <label>チェックボックス:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> 規約に同意します
        </label>
      </div>
      <div class="preview">
        <h4>リアルタイムプレビュー:</h4>
        <p>テキスト: {{textInput}}</p>
        <p>数値: {{numberInput}}</p>
        <p>複数行テキスト: {{textareaInput}}</p>
        <p>選択: {{selectedOption}}</p>
        <p>チェック状態: {{isChecked ? 'チェック済み' : '未チェック'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

1. **パフォーマンスの考慮**：双方向バインディングはデータリスナーを作成するため、大量に使用するとパフォーマンスに影響する可能性がある
2. **データの一貫性**：双方向バインディングはデータとビューの一貫性を保証するが、無限ループの更新を避けることに注意が必要
3. **初期値の設定**：バインドされるデータに適切な初期値を設定し、undefined の表示問題を回避する
4. **イベントの競合**：同一要素で双方向バインディングと手動のイベント処理を同時に使用しないよう注意し、競合を避ける