# クラスとスタイルのバインディング

ofa.jsでは、クラス名、スタイル、属性を動的にバインドすることで、柔軟なUI状態管理を実現できます。これにより、データの変化に応じてインターフェースの見た目が自動的に調整されます。

## クラスバインディング

クラスバインディングを使うと、データの状態に応じて CSS クラスを動的に追加・削除できます。`class:className="booleanExpression"` という構文を使って特定のクラスをバインドできます。

`booleanExpression` が `true` の場合、クラス名が要素に追加されます；`false` の場合、クラス名が要素から削除されます。

### 基本クラスバインディング

<o-playground name="基礎クラスバインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .hide {
          display: none;
        }
      </style>
      <button on:click="isHide = !isHide">表示切り替え</button>
      <p class="green" class:hide="isHide">{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 複数のクラスバインディング

複数のクラスを同時にバインドすることもでき、要素が異なる条件に応じて異なる見た目の状態を持つようにできます。

<o-playground name="複数クラスバインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .active {
          background-color: #e6f7ff;
          border: 2px solid #1890ff;
        }
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .highlight {
          font-weight: bold;
          color: #52c41a;
        }
      </style>
      <button on:click="toggleStates">Toggle States</button>
      <p class:active="isActive" class:disabled="isDisabled" class:highlight="isHighlighted">
        Current State - Active: {{isActive}}, Disabled: {{isDisabled}}, Highlighted: {{isHighlighted}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              isActive: false,
              isDisabled: false,
              isHighlighted: false,
            },
            proto: {
              toggleStates() {
                this.isActive = !this.isActive;
                this.isDisabled = !this.isDisabled;
                this.isHighlighted = !this.isHighlighted;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## スタイルバインディング

スタイルバインディングは、インラインスタイルの値を直接設定し、動的な更新をサポートします。ofa.jsは2種類のスタイルバインディング方法を提供しています：

### 単一スタイル属性バインディング

特定のスタイルプロパティをバインドするには、`:style.propertyName` 構文を使用します。

<o-playground name="単一スタイル属性バインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p class="green" :style.color="isGreen ? 'green' : 'red'">{{val}}</p>
      <button on:click="isGreen = !isGreen">Toggle Color</button>
      <script>
        export default async () => {
          return {
            data: {
              isGreen: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 多様なスタイル属性バインディング

あなたは一度に複数のスタイル属性をバインドすることもできます：

<o-playground name="多様なスタイル属性バインディング" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p :style.color="textColor" :style.fontSize="fontSize + 'px'" :style.backgroundColor="bgColor">
        動的スタイリングの例
      </p>
      <button on:click="changeStyles">スタイルを変更</button>
      <script>
        export default async () => {
          return {
            data: {
              textColor: 'blue',
              fontSize: 16,
              bgColor: '#f0f0f0'
            },
            proto: {
              changeStyles() {
                this.textColor = this.textColor === 'blue' ? 'red' : 'blue';
                this.fontSize = this.fontSize === 16 ? 20 : 16;
                this.bgColor = this.bgColor === '#f0f0f0' ? '#ffffcc' : '#f0f0f0';
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## プロパティバインディング

クラスとスタイルのバインディングに加えて、他のHTML属性を動的にバインディングすることもできます。ofa.jsは`attr:attributeName`構文を使用して属性バインディングを実装します。

### 基礎属性バインディング

<o-playground name="基本属性バインディング" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        [bg-color="red"]{
            background-color: red;
        }
        [bg-color="green"]{
            background-color: green;
        }
      </style>
      <p attr:bg-color="bgColor" attr:title="tooltipText">{{val}}</p>
      <button on:click="changeColor">色を変更</button>  
      <script>
        export default async () => {
          return {
            data: {
              bgColor: "green",
              tooltipText: "これはヒント情報です",
              val: "マウスを乗せてタイトルを表示",
            },
            proto: {
              changeColor() {
                this.bgColor = this.bgColor === "green" ? "red" : "green";
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### ブール属性の処理

ブール型の属性（例: `disabled`, `hidden`）については、ofa.jsはバインドされた値の真偽に基づいて、その属性を追加するかどうかを決定します。

<o-playground name="ブール属性処理" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <input type="text" attr:disabled="isDisabled" placeholder="Type here..." />
      <br /><br />
      <button attr:disabled="isButtonDisabled" on:click="handleButtonClick">Click Me</button>
      <br /><br />
      <label>
        <input type="checkbox" on:change="toggleAll" /> Toggle All States
      </label>
      <script>
        export default async () => {
          return {
            data: {
              isDisabled: false,
              isChecked: true,
              isButtonDisabled: false,
            },
            proto: {
              handleButtonClick() {
                alert('Button clicked!');
              },
              toggleAll(event) {
                const checked = event.target.checked;
                this.isDisabled = checked;
                this.isChecked = checked;
                this.isButtonDisabled = checked;
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## スタイルタグ内のデータ関数

スタイルで `data(xxx)` を使用してコンポーネントデータをバインドできます。これは、コンポーネントデータに基づいてスタイルを動的に変更する必要があるシナリオに非常に適しています。

<o-playground name="スタイルタグ内のデータ関数" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        p:hover{
          color:red;
        }
      </style>
      <style>
        p {
          font-size: data(size);
          color:green;
          transition: all data(time)s ease;
        }
      </style>
      FontSize: <input type="number" sync:value="size" placeholder="これは双方向バインディングの入力ボックスです" />
      <br />
      TransitionTime: <input type="number" step="0.3" min="0" sync:value="time" placeholder="これは双方向バインディングの入力ボックスです" />
      <p>{{val}} - size: {{size}}</p>
      <script>
        export default async () => {
          return {
            data: {
              size: 16,
              time: 0.3,
              val: "Hello ofa.js Demo Code",
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事項

`style` 内の `data(xxx)` は原理的には style の内容全体を置き換えるため、data に関連するスタイルのみを style 内に記述し、data を必要としないものは別の style に配置する方がパフォーマンスが向上します。

```html
<!-- ❌ data(xxx) を持たない p:hover も更新されます -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
  p:hover{
    color:red;
  }
</style>
``````html
<!-- ✅ data(xxx) のみを含むスタイルは再レンダリングされます -->
<style>
  p {
    font-size: data(size);
    color:green;
    transition: all data(time)s ease;
  }
</style>
<style>
  p:hover{
    color:red;
  }
</style>
```