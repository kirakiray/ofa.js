# 创建组件

创建组件模块，和创建 page模块不一样，是使用 `component` 属性标识 template 元素。

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "NoneOS 组件示例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
