# 计算属性

写在 proto 上的函数，称为计算属性。使用 `get` 或 `set` 关键字定义。

## get 计算属性

<o-playground style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## set 计算属性

<o-playground style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="resetCount">Reset Count - {{count}}</button>
      <button on:click="setCountDouble">Set Count Double - {{countDouble}}</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = val / 2;
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>