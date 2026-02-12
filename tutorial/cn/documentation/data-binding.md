# 数据绑定

除了文本渲染数据，还可以数据绑定到 input 等元素的 value 属性上；

## 单项属性绑定

绑定属性采用 `:xxx` 语法，单项的将属性绑定到元素上；

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>val: {{val}}</p>
      <input type="text" :value="val" placeholder="输入内容" style="width: 100%;">
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

通过单项只会在那个数据发生改动时，从组件往内部元素传递数据；所以如果input元素发生改动，是不会反向传递到组件上层的。

## 双向属性绑定

双向属性绑定采用 `sync:xxx` 语法，当元素属性发生变化时，会同步到组件数据上；

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>val: {{val}}</p>
      <input type="text" sync:value="val" placeholder="输入内容" style="width: 100%;">
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
