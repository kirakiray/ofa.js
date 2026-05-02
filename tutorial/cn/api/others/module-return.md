# 模块返回对象属性

在 ofa.js 中，无论是页面模块还是组件模块，都需要通过 `export default async () => {}` 返回一个对象来定义模块的配置和行为。本文档汇总了返回对象可以包含的所有属性。

## 属性总览

| 属性 | 类型 | 页面模块 | 组件模块 | 说明 | 相关文档 |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ 必须 | 组件标签名 | [创建组件](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | 响应式数据对象 | [属性响应](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | 组件属性定义 | [传递特征属性](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | 方法和计算属性 | [计算属性](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | 侦听器 | [侦听器](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | DOM 创建完成时调用 | [生命周期](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | 挂载到 DOM 时调用 | [生命周期](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | 从 DOM 移除时调用 | [生命周期](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | 完全加载完成时调用 | [生命周期](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ 父页面 | ❌ | 路由变化时调用 | [嵌套页面/路由](../../documentation/nested-routes.md) |

> **特殊导出**：`export const parent = "./layout.html"` - 用于嵌套路由，指定父页面路径（不在返回对象中）。详见 [嵌套页面/路由](../../documentation/nested-routes.md)。

## 核心属性

### tag

`tag` 是组件的标签名，**组件模块必须定义此属性**。页面模块不需要定义 `tag`。

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> 注意：`tag` 的值必须与使用组件时的标签名一致。

### data

`data` 是响应式数据对象，用于存储组件或页面的状态数据。数据变化时会自动更新视图。

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "张三",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> 注意：`data` 是对象而非函数，与 Vue 框架不同。

### attrs

`attrs` 用于定义组件属性，接收外部传入的数据。只有组件模块需要定义 `attrs`。

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // 无默认值
      disabled: "",     // 有默认值
      size: "medium"    // 有默认值
    }
  };
};
```

使用组件时传入属性：

```html
<my-component title="标题" disabled size="large"></my-component>
```

> 重要规则：
> - 传递的 attribute 值必须是字符串，如果不是字符串将会被自动转换为字符串
> - 命名转换：`fullName` → `full-name`（kebab-case 格式）
> - `attrs` 和 `data` 的 key 不能重复

### proto

`proto` 用于定义方法和计算属性。计算属性使用 JavaScript 的 `get` 和 `set` 关键字定义。

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // 方法定义
      increment() {
        this.count++;
      },
      
      // 计算属性（getter）
      get doubleCount() {
        return this.count * 2;
      },
      
      // 计算属性
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

> 注意：ofa.js 使用 `get`/`set` 关键字定义计算属性，而非 Vue 的 `computed` 选项。

### watch

`watch` 用于定义侦听器，监听数据变化并执行相应逻辑。

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // 监听单个属性
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // 监听多个属性
      "count,name"() {
        console.log('count 或 name 发生变化');
      }
    }
  };
};
```

侦听器回调函数接收两个参数：
- `newValue`：变化后的新值
- `{ watchers }`：当前组件的所有侦听器对象

## 生命周期钩子

生命周期钩子允许你在组件的不同阶段执行特定逻辑。

### ready

`ready` 钩子在组件准备就绪时调用，此时组件的模板已经渲染完成，DOM 元素已经创建，但可能尚未插入到文档中。

```javascript
ready() {
  console.log('DOM 已创建');
  this.initDomElements();
}
```

### attached

`attached` 钩子在组件被插入到文档中时调用，表示组件已经挂载到页面上。

```javascript
attached() {
  console.log('已挂载到 DOM');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached

`detached` 钩子在组件从文档中移除时调用，表示组件即将被卸载。

```javascript
detached() {
  console.log('已从 DOM 移除');
  clearInterval(this._timer);
}
```

### loaded

`loaded` 钩子在组件及其所有子组件、异步资源全部加载完毕后触发。

```javascript
loaded() {
  console.log('完全加载完成');
}
```

### routerChange

`routerChange` 钩子在路由变化时调用，仅用于父页面监听子页面切换。

```javascript
routerChange() {
  this.refreshActive();
}
```

## 生命周期执行顺序

```
ready → attached → loaded
                 ↓
              detached（移除时）
```

## 特殊导出：parent

`parent` 用于嵌套路由，指定当前页面的父页面路径。这是一个独立的导出，不在返回对象中。

```html
<template page>
  <style>:host { display: block; }</style>
  <div>子页面内容</div>
  <script>
    // 指定父页面
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## 完整示例

### 组件模块

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>计数: {{count}}</p>
    <p>双倍: {{doubleCount}}</p>
    <button on:click="increment">增加</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "默认标题"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count 变化为:', newVal);
          }
        },
        ready() {
          console.log('组件准备就绪');
        },
        attached() {
          console.log('组件已挂载');
        },
        detached() {
          console.log('组件已卸载');
        }
      };
    };
  </script>
</template>
```

### 页面模块

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('页面准备就绪');
        },
        
        attached() {
          console.log('页面已挂载');
          console.log('查询参数:', query);
        },
        
        detached() {
          console.log('页面已卸载');
        }
      };
    };
  </script>
</template>
```

## 常见错误

### 1. attrs 和 data 的 key 重复

```javascript
// ❌ 错误
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // 与 attrs 重复
};

// ✅ 正确
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // 使用不同的 key
};
```

### 2. 使用 Vue 风格定义计算属性

```javascript
// ❌ 错误
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ 正确
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data 定义为函数

```javascript
// ❌ 错误
return {
  data() {
    return { count: 0 };
  }
};

// ✅ 正确
return {
  data: {
    count: 0
  }
};
```

### 4. 方法定义位置错误

```javascript
// ❌ 错误
return {
  methods: {
    handleClick() {}
  }
};

// ✅ 正确
return {
  proto: {
    handleClick() {}
  }
};
```
