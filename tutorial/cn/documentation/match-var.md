# 样式查询

`match-var` 是 ofa.js 中用于根据 CSS 变量进行样式匹配的功能组件。通过 `match-var`，可以根据当前组件的 CSS 变量值动态匹配并应用不同的样式。这种特性专门用于样式相关的状态传递，不需要使用 JavaScript，使用起来更加方便，适合主题色等样式传递需求。

## 核心概念

- **match-var**: 样式匹配组件，根据 CSS 变量值决定是否应用内部样式
- **属性匹配**: 通过组件属性定义需要匹配的 CSS 变量和期望值
- **样式应用**: 匹配成功时，内部 `<style>` 标签的样式会被应用到组件上

## 基本用法

`match-var` 组件通过属性来定义需要匹配的 CSS 变量和期望值。当组件的 CSS 变量值与指定的属性值匹配时，内部定义的样式就会被应用。

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### 属性

`match-var` 组件使用任意属性来定义 CSS 变量的匹配规则。属性名对应 CSS 变量名（不含 `--` 前缀），属性值就是期望匹配的值。

### 工作原理

1. **浏览器支持**: 如果浏览器支持 `@container style()` 查询，会直接使用 CSS 原生能力
2. **降级处理**: 如果不支持，会通过轮询检测 CSS 变量值的变化，匹配成功后动态注入样式
3. **手动刷新**: 可以通过 `$.checkMatch()` 方法手动触发样式检测

## 基础示例

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
        .container{
            --theme: light;
        }
      </style>
      <div class="container">
        <theme-box>
          根据 CSS 变量显示不同样式
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          border-radius: 8px;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 多条件匹配

可以同时使用多个属性来定义更复杂的匹配条件，只有当所有 CSS 变量都匹配时，样式才会被应用。

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## 多条件匹配示例

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./card.html"></l-m>
      <card>
        <div>多条件样式匹配示例</div>
      </card>
    </template>
  </code>
  <code path="card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <style>
        :host {
          --theme: data(theme);
          --size: data(size);
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <div>主题: {{theme}} | 尺寸: {{size}}</div>
      <slot></slot>
      <script>
        export default {
          tag: "card",
          data: {
            theme: "light",
            size: "small",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 动态数据绑定

`match-var` 可以结合 `data()` 绑定指令，根据组件的响应式数据动态匹配样式。

```html
<style>
  :host {
    --status: data(status);
  }
</style>

<match-var status="success">
  <style>
    .message {
      color: green;
    }
  </style>
</match-var>
```

## 动态数据绑定示例

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./status-badge.html"></l-m>
      <status-badge status="pending">处理中</status-badge>
      <status-badge status="success">成功</status-badge>
      <status-badge status="error">错误</status-badge>
      <br>
      <button on:click="changeStatus">切换状态</button>
    </template>
  </code>
  <code path="status-badge.html" active>
    <template component>
      <style>
        :host {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          margin: 5px;
        }
      </style>
      <style>
        :host {
          --status: data(status);
        }
      </style>
      <match-var status="pending">
        <style>
          :host {
            background-color: #fff3e0;
            border: 1px solid #ff9800;
            color: #e65100;
          }
        </style>
      </match-var>
      <match-var status="success">
        <style>
          :host {
            background-color: #e8f5e9;
            border: 1px solid #4caf50;
            color: #2e7d32;
          }
        </style>
      </match-var>
      <match-var status="error">
        <style>
          :host {
            background-color: #ffebee;
            border: 1px solid #f44336;
            color: #c62828;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "status-badge",
          data: {
            status: "pending",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch 手动刷新

在某些情况下，CSS 变量的变化可能无法被自动检测到，这时可以手动调用 `$.checkMatch()` 方法来触发样式检测。

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // 手动触发样式检测
    $.checkMatch();
  }
}
```

## checkMatch 手动刷新示例

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./color-picker.html"></l-m>
      <color-picker></color-picker>
    </template>
  </code>
  <code path="color-picker.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
        }
        .color-box {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        button {
          padding: 8px 16px;
          margin: 5px;
          cursor: pointer;
        }
      </style>
      <style>
        .color-box {
          --color: data(color);
        }
      </style>
      <match-var color="red">
        <style>
          .color-box {
            background-color: #ffcdd2;
            border: 2px solid #f44336;
          }
        </style>
      </match-var>
      <match-var color="green">
        <style>
          .color-box {
            background-color: #c8e6c9;
            border: 2px solid #4caf50;
          }
        </style>
      </match-var>
      <match-var color="blue">
        <style>
          .color-box {
            background-color: #bbdefb;
            border: 2px solid #2196f3;
          }
        </style>
      </match-var>
      <div class="color-box">当前颜色: {{color}}</div>
      <button on:click="setColor('red')">红色</button>
      <button on:click="setColor('green')">绿色</button>
      <button on:click="setColor('blue')">蓝色</button>
      <script>
        export default {
          tag: "color-picker",
          data: {
            color: "red",
          },
          proto: {
            setColor(color) {
              this.color = color;
              $.checkMatch();
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 嵌套组件中使用

可以在嵌套的组件中使用 `match-var`，通过父组件传递 CSS 变量，子组件根据这些变量匹配不同的样式。

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./outer.html"></l-m>
      <l-m src="./inner.html"></l-m>
      <outer-component></outer-component>
    </template>
  </code>
  <code path="outer.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 1px solid #ccc;
          margin-bottom: 10px;
        }
      </style>
      <style>
        :host {
          --mode: data(mode);
        }
      </style>
      <div>外层模式: {{mode}}</div>
      <inner-component></inner-component>
      <script>
        export default {
          tag: "outer-component",
          data: {
            mode: "normal",
          },
        };
      </script>
    </template>
  </code>
  <code path="inner.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 15px;
          margin-top: 10px;
        }
      </style>
      <match-var mode="normal">
        <style>
          :host {
            background-color: #f5f5f5;
          }
        </style>
      </match-var>
      <match-var mode="special">
        <style>
          :host {
            background-color: #fff8e1;
            border: 1px dashed #ff9800;
          }
        </style>
      </match-var>
      <div>内层组件 - 模式: {{mode}}</div>
      <script>
        export default {
          tag: "inner-component",
          data: {
            mode: "normal",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## 最佳实践

1. **优先使用 CSS 原生能力**: `match-var` 会优先使用浏览器原生的 `@container style()` 查询，现代浏览器中性能更好
2. **合理组织样式**: 将相关的匹配样式放在一起，便于维护和理解
3. **使用 data() 绑定**: 结合 `data()` 指令可以实现响应式的样式切换
4. **手动刷新**: 当样式变化无法自动检测时，记得调用 `$.checkMatch()` 手动触发
5. **避免过度使用**: 如果只是简单的样式切换，可以考虑直接使用 CSS 的 `:host()` 选择器或条件类
