# extend



`extend` はインスタンスのプロパティやメソッドを拡張するための高階メソッドです。

> 通常、ユーザーがインスタンスのプロパティやメソッドを拡張することは推奨されません。これは学習コストを増加させるためです。チーム内でインスタンスの動作をカスタマイズする特別なシナリオがある場合を除き、このような行為は推奨されません。

<o-playground name="extend - 拡張インスタンス" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>私は1です</li>
        <li id="target">私はターゲットです</li>
        <li>私は3です</li>
      </ul>
      <div id="logger">ロガー</div>
      <script>
        const target = $("#target");
        target.extend({
          get good(){
            return "ofa.jsは良いです";
          },
          say(){
            return 'こんにちは';
          }
        });
        setTimeout(() => {
          const target = $("#target");
          \$("#logger").html = `
          good : ${target.good} <br>
          say() : ${target.say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 拡張 $ レイヤー

jQueryと同様に、fn.extendを使って基盤となるインスタンスのプロパティやメソッドを拡張することもできます；fnから拡張されたプロパティやメソッドはすべてのインスタンスに適用されます。

<o-playground name="extend - 拡張レイヤー" style="--editor-height: 560px">
  <code path="demo.html">
    <template>
      <ul>
        <li>I am 1</li>
        <li id="target">I am target</li>
        <li>I am 3</li>
      </ul>
      <div id="logger">logger</div>
      <script>
        \$.fn.extend({
          get good(){
            return "ofa.js is good";
          },
          say(){
            return 'hello';
          }
        });
        setTimeout(() => {
          \$("#logger").html = `
          target good : ${$("#target").good} <br>
          logger say() : ${$("#logger").say()}
          `;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## 拡張テンプレート構文

`extend` を使用してプロパティや関数を拡張することで、テンプレート構文の機能を増やしたり、コンポーネント専用のテンプレート構文糖衣構文を提供したりできます。ただし、非公式のテンプレート構文は**できるだけ使用しない**ように注意してください。なぜなら、それらは使用者に一定の学習コストをもたらし、大量の非公式テンプレート構文糖衣構文は開発体験を低下させるからです。

### 拡張属性

拡張属性を使うと、テンプレート内で `:` を用いて設定できます。以下では `red` 属性を拡張し、`red` が `true` のときにフォントの色を赤くします：

```javascript
$.fn.extend({
  set red(bool){
    if(bool){
      this.css.color = "red";
    }else{
      this.css.color = '';
    }
  }
});
```

<o-playground name="extend - 拡張プロパティ" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-one.html"></l-m>
      <temp-one></temp-one>
      <script>
        \$.fn.extend({
          set red(bool){
            if(bool){
              this.css.color = "red";
            }else{
              this.css.color = '';
            }
          }
        });
      </script>
    </template>
  </code>
  <code path="temp-one.html">
    <template component>
      <button on:click="addCount">カウントを追加</button>
      <div :red="count % 3">{{count}}</div>
      <script>
        export default {
          tag: "temp-one",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

この例では、テンプレート構文に `red` 属性を追加し、`count % 3` が 0 ではない場合、文字色が赤色になります。

### 拡張メソッド

`extend` を使う拡張メソッドにより、テンプレート構文内で利用できるようになります。メソッド名はコロンの前の部分です。ここでは `color` というテンプレート構文を拡張しており、後に続く引数は定義された拡張メソッドに渡されます。

ここでは `always` 属性を `true` に設定しており、コンポーネントがインターフェースを更新する必要があるたびに、この定義済みメソッドが呼び出されることを示しています。`always` を設定しない場合、このテンプレート構文関数は一度しか実行されません。

その中で、`options` はより多くのパラメータを提供し、よりカスタマイズ可能なテンプレート構文の開発を支援します：

```javascript
$.fn.extend({
  color(value, func, options){
    const bool = func();
    if(bool){
      this.css.color = value;
    }else{
      this.css.color = '';
    }
  }
});

$.fn.color.always = true;
```

<o-playground name="extend - 拡張メソッド" style="--editor-height: 400px">
  <code path="demo.html" preview active>
    <template>
      <l-m src="./temp-two.html"></l-m>
      <temp-two></temp-two>
      <script>
        \$.fn.extend({
          color(color, func, options){
            const bool = func();
            if(bool){
              this.css.color = color;
            }else{
              this.css.color = '';
            }
          }
        });
        \$.fn.color.always = true;
      </script>
    </template>
  </code>
  <code path="temp-two.html">
    <template component>
      <button on:click="addCount" color:blue="count % 3">カウント追加</button>
      <div color:red="!(count % 3)">{{count}}</div>
      <script>
        export default {
          tag: "temp-two",
          data: {
            count: 0
          },
          proto:{
            addCount(){
              this.count++;
            },
          }
        };
      </script>
    </template>
  </code>
</o-playground>

## テンプレート構文の原理

ここまでで、ofa.js の多くのテンプレート構文が実際には `extend` によって拡張されていることを理解しているはずです：

- `class`、`attr` メソッドはビューが更新されるたびに実行される
- `on`、`one` のような関数バインドは一度しか実行されない

以下の例を見れば、ofa.js のテンプレートレンダリングの仕組みがよりよく理解できます：

<o-playground name="extend - テンプレート構文の原理" style="--editor-height: 480px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./temp-three.html"></l-m>
      <temp-three></temp-three>
    </template>
  </code>
  <code path="temp-three.html" active>
    <template component>
      <div>class always => {{classalways}}</div>
      <div>attr always => {{attralways}}</div>
      <div>on always => {{onalways}}</div>
      <script>
        export default {
          tag: "temp-three",
          data: {
            classalways:"",
            attralways:"",
            onalways:""
          },
          ready(){
            this.classalways = $.fn.class.always;
            this.attralways = $.fn.attr.always;
            this.onalways = !!$.fn.on.always;
          }
        };
      </script>
    </template>
  </code>
</o-playground>

