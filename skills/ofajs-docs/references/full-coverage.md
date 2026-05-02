# ofa.js 模板语法快速入门案例

<!-- 源文件内容start -->

**demo.html**
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ofa.js 完整功能演示</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <!-- <script
      src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js@main/dist/ofa.min.mjs#debug"
      type="module"
    ></script> -->
    <script type="module" src="/packages/ofa/main.mjs#debug"></script>
    <o-page src="./page.html"></o-page>
  </body>
</html>

```

**my-counter.html**
```html
<template component>
  <style>
    :host {
      display: inline-block;
      padding: 10px;
      border: 2px solid #4caf50;
      border-radius: 8px;
      background: #f1f8e9;
    }
    .counter-display {
      font-size: 24px;
      font-weight: bold;
      margin: 0 10px;
    }
    .btn {
      padding: 5px 15px;
      margin: 0 5px;
      cursor: pointer;
    }
  </style>

  <div>
    <slot></slot>
    <span class="counter-display">{{currentValue}}</span>
    <button class="btn" on:click="increment">+</button>
    <button class="btn" on:click="decrement">-</button>
  </div>

  <script>
    export default {
      tag: "my-counter",
      attrs: {
        initialValue: 0,
      },
      data: {
        currentValue: 0,
      },
      watch: {
        initialValue(val) {
          this.currentValue = val;
        },
      },
      proto: {
        increment() {
          this.currentValue++;
          this.emitChange();
        },
        decrement() {
          this.currentValue--;
          this.emitChange();
        },
        emitChange() {
          this.emit("change", {
            data: { value: this.currentValue },
          });
        },
      },
      ready() {
        this.currentValue = this.initialValue;
      },
    };
  </script>
</template>

```

**page.html**
```html
<template page>
  <l-m src="./my-counter.html"></l-m>
  <l-m src="./todo-item.html"></l-m>
  <style>
    :host {
      display: block;
    }
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .active {
      background-color: #e3f2fd;
    }
    .highlight {
      color: #1976d2;
      font-weight: bold;
    }
    .btn {
      padding: 8px 16px;
      margin: 5px;
      cursor: pointer;
    }
    .error {
      color: red;
    }
    .success {
      color: green;
    }
    .warning {
      color: orange;
    }
  </style>

  <div class="container">
    <h1>ofa.js 完整功能演示</h1>

    <div class="section">
      <h2>1. 文本插值与 HTML 渲染</h2>
      <p>普通文本: {{message}}</p>
      <p>计算属性: {{doubleCount}}</p>
      <p>HTML渲染: <span :html="htmlContent"></span></p>
    </div>

    <div class="section">
      <h2>2. 事件绑定</h2>
      <button class="btn" on:click="count++">计数 +1 ({{count}})</button>
      <button class="btn" on:click="decrement">计数 -1</button>
      <button class="btn" on:click="toggle">切换状态</button>
    </div>

    <div class="section">
      <h2>3. 条件渲染 (o-if/o-else-if/o-else)</h2>
      <o-if :value="count > 10">
        <p class="success">计数大于 10</p>
      </o-if>
      <o-else-if :value="count > 5">
        <p class="warning">计数大于 5</p>
      </o-else-if>
      <o-else>
        <p>计数小于等于 5</p>
      </o-else>
    </div>

    <div class="section">
      <h2>4. 动态类名与样式</h2>
      <p class:active="isActive" class:highlight="count > 3">
        动态类名演示 (active: {{isActive}}, highlight: {{count > 3}})
      </p>
      <p :style.color="count > 5 ? 'red' : 'blue'" :style.fontSize="'16px'">
        动态样式演示 (颜色根据计数变化)
      </p>
    </div>

    <div class="section">
      <h2>5. 列表渲染 (o-fill)</h2>
      <div>
        <button class="btn" on:click="addItem">添加项目</button>
        <button class="btn" on:click="removeItem">删除最后</button>
      </div>
      <o-fill :value="todoList">
        <todo-item
          attr:idx="$index"
          :content="$data.content"
          sync:completed="$data.completed"
          on:remove="$host.removeTodoItem($index)"
        ></todo-item>
      </o-fill>
    </div>

    <div class="section">
      <h2>6. 自定义组件 (my-counter)</h2>
      <my-counter :initial-value="5" on:change="handleCounterChange">
        <span>自定义计数器: </span>
      </my-counter>
    </div>

    <div class="section">
      <h2>7. 属性绑定演示</h2>
      <p>单向绑定: {{inputValue}}</p>
      <input type="text" :value="inputValue" on:input="updateInput($event)" />
      <p>双向绑定: {{syncValue}}</p>
      <input type="text" sync:value="syncValue" />
    </div>

    <div class="section">
      <h2>8. 生命周期日志</h2>
      <div :html="lifecycleLogs"></div>
    </div>
  </div>

  <script>
    export default async ({ query }) => {
      return {
        data: {
          message: "Hello ofa.js!",
          count: 0,
          isActive: false,
          htmlContent: "<strong>加粗文本</strong>",
          inputValue: "初始值",
          syncValue: "双向绑定值",
          todoList: [
            { content: "学习 ofa.js", completed: false },
            { content: "创建组件", completed: true },
          ],
          lifecycleLogs: "",
        },
        watch: {
          count(val, oldVal) {
            console.log(`count changed: ${oldVal} -> ${val}`);
          },
        },

        proto: {
          get doubleCount() {
            return this.count * 2;
          },
          decrement() {
            if (this.count > 0) this.count--;
          },
          toggle() {
            this.isActive = !this.isActive;
          },
          addItem() {
            this.todoList.push({
              content: `新项目 ${this.todoList.length + 1}`,
              completed: false,
            });
          },
          removeItem() {
            if (this.todoList.length > 0) {
              this.todoList.pop();
            }
          },
          removeTodoItem(index) {
            this.todoList.splice(index, 1);
          },
          updateInput(event) {
            this.inputValue = event.target.value;
          },
          handleCounterChange(event) {
            console.log("Counter changed:", event.data);
          },
        },
        ready() {
          this.lifecycleLogs += "<p>ready: 页面初始化完成</p>";
          console.log("Query params:", query);
        },
        attached() {
          this.lifecycleLogs += "<p>attached: 页面已挂载</p>";
        },
        detached() {
          console.log("detached: 页面已卸载");
        },
      };
    };
  </script>
</template>

```

**todo-item.html**
```html
<template component>
  <style>
    :host {
      display: block;
      padding: 8px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .item-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .text {
      flex: 1;
    }
    .remove-btn {
      color: red;
      cursor: pointer;
      padding: 2px 8px;
    }
  </style>

  <div class="item-content" class:completed="completed">
    <input type="checkbox" sync:checked="completed" />
    <span class="text">{{idx + 1}}. {{content}}</span>
    <span class="remove-btn" on:click="removeSelf">✕</span>
  </div>

  <script>
    export default {
      tag: "todo-item",
      attrs: {
        content: "",
      },
      data: {
        idx: 0,
        completed: false,
      },
      proto: {
        removeSelf() {
          this.emit("remove");
        },
      },
    };
  </script>
</template>

```

<!-- 源文件内容end -->
