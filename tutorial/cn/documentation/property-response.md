# 属性响应

前面 [属性绑定](./property-binding.md) 介绍简单的属性响应，将组件的属性值渲染到文本展示上。

不仅可以将自身的值响应，也支持将多层对象内的属性值渲染到文本展示上。

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
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{obj.count2}}</p>
      <button on:click="handleAddCount">增加</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              obj: {
                count2: 100,
              },
            },
            proto:{
              handleAddCount(){
                this.count++;
                this.obj.count2++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

所有的数据绑定到ofa.js实例对象上时，会自动转换为响应式数据。所以只能存储 字符串，数字，布尔值，数组，对象等基本数据类型。不能存储函数，类实例等复杂数据类型，这些其他类型的数据都要作为非响应式属性来进行存储。

## 非响应式数据

有时候要存储一些非响应式的数据，例如 Promise 实例对象，正则表达式之类的，就需要使用到非响应式属性。

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
      <p style="color: blue;">count: {{count}}</p>
      <p style="color: green;">count2: {{_count2}}</p>
      <button on:click="count++">Blue增加</button>
      <button on:click="_count2++">Green增加</button>
      <script>
        export default async () => {
          return {
            data: {
              count: 20,
              _count2: 100,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

在点击Green增加按钮时，它的数值实际是增加了的，只是因为没有触发响应式更新，所以文本展示上没有变化。后面如果点击了Blue增加按钮，会重新出发整个组件的响应式更新，会顺便更新了Green的文本展示。


