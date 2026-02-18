# 创建组件

## 引用组件

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

其中 "tag" 是组件的标签名，必须和组件的标签名一致。通过 `l-m` 标签引入组件模块，组件模块会自动注册组件，就像使用 `script` 标签引入组件一样。

`l-m` 引用标签是异步引用。

## 同步引用组件

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
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

`l-m` 标签引用和 `load` 方法都可以同步引用组件模块，但是 `l-m` 标签引用是异步引用，`load` 方法是同步引用。