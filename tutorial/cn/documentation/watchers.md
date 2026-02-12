# 侦听器

侦听器（Watcher）是 ofa.js 中用于监听数据变化并执行相应逻辑的功能。当响应式数据发生变化时，侦听器会自动触发回调函数，允许你执行诸如数据转换、副作用操作或异步处理等任务。

## 基本用法

侦听器定义在组件的 `watch` 对象中，其中键名对应需要监听的数据属性名，值是当数据变化时执行的回调函数。

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
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 回调函数参数

侦听器回调函数接收两个参数：
- `newValue`：变化后的新值
- `{watchers}`：当前组件的所有侦听器对象

数据变更后会先进行防抖处理，再执行 `watch` 中的回调；`watchers` 参数即为本次防抖周期内所有被合并的变更集合。

`watch` 中的函数会在组件初始化完成后立即被调用，用于建立数据监听。可通过判断 `watchers` 是否有长度来区分是否为首次调用。

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>名字: {{name}}</p>
      <p>年龄: {{age}}</p>
      <input sync:value="name" placeholder="输入名字" />
      <input sync:value="age" type="number" placeholder="输入年龄" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "张三",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                this.log += `属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}"\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                this.log += `属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}"\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 深度侦听

对于对象或数组类型的嵌套数据，watch 内会自动进行深度监听。

<o-playground style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>用户信息:</p>
        <p>姓名: {{user.name}}</p>
        <p>年龄: {{user.age}}</p>
        <p>爱好: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">修改姓名</button>
        <button on:click="updateAge">修改年龄</button>
        <button on:click="addHobby">添加爱好</button>
        <button on:click="updateHobby">修改爱好</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "张三",
                age: 25,
                hobbies: ["篮球", "足球"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                console.log("修改: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `修改值-> 属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}" <br>`;
                }else{
                  this.log += `执行方法${watcher.type}-> 函数名 "${watcher.name}"  参数 "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "李四";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("游泳");
              },
              updateHobby() {
                this.user.hobbies[0] = "羽毛球";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 监听多个数据源

你可以同时监听多个数据的变化，并在回调函数中根据多个数据的变化执行相应的逻辑。

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <p>宽度: {{rectWidth}}</p>
      <p>高度: {{rectHeight}}</p>
      <p>面积: {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="宽度" />
      <input sync:value="rectHeight" type="number" placeholder="高度" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              rectWidth() {
                this.calcArea();
              },
              rectHeight() {
                this.calcArea();
              },
            },
            proto: {
              calcArea() {
                this.area = (this.rectWidth || 0) * (this.height || 0);
              },
            },
            ready() {
              this.calcArea();
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 侦听器 vs 计算属性

侦听器和计算属性都可以用于响应数据的变化，但它们有不同的适用场景：

| 特性 | 侦听器 | 计算属性 |
|------|--------|----------|
| 适用场景 | 执行副作用操作、异步操作 | 基于响应式数据派生新值 |
| 返回值 | 无返回值 | 必须返回值 |
| 缓存 | 无缓存，每次数据变化都会执行 | 有缓存，只在依赖变化时重新计算 |
| 灵活性 | 更灵活，可执行任意操作 | 更简洁，声明式定义 |

<o-playground style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #f5f5f5;
        }
      </style>
      <p>原价格: {{price}}</p>
      <p>折扣: {{discount}}</p>
      <p>计算属性 - 最终价格: {{finalPrice}}</p>
      <p>侦听器 - 折扣后价格: {{discountedPrice}}</p>
      <button on:click="changePrice">修改价格</button>
      <button on:click="changeDiscount">修改折扣</button>
      <div class="log">
        <p>计算属性访问次数: {{computedCount}}</p>
        <p>侦听器执行次数: {{watcherCount}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              price: 100,
              discount: 0.8,
              finalPrice: 0,
              discountedPrice: 0,
              computedCount: 0,
              watcherCount: 0,
            },
            proto: {
              get finalPrice() {
                this.computedCount++;
                return this.price * this.discount;
              },
              changePrice() {
                this.price = Math.floor(Math.random() * 200) + 50;
              },
              changeDiscount() {
                this.discount = parseFloat((Math.random() * 0.5 + 0.5).toFixed(2));
              },
            },
            watch: {
              price() {
                this.watcherCount++;
                this.discountedPrice = this.price * this.discount;
              },
              discount() {
                this.watcherCount++;
                this.discountedPrice = this.price * this.discount;
              },
            },
            ready() {
              this.discountedPrice = this.price * this.discount;
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 实际应用场景

### 1. 表单验证

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="用户名（3-10个字符）" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="邮箱" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "用户名必须是3-10个字符";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "请输入有效的邮箱地址";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. 数据持久化

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <p>设置: {{settings.theme}}</p>
      <p>保存状态: {{saveStatus}}</p>
      <button on:click="setLight">浅色主题</button>
      <button on:click="setDark">深色主题</button>
      <button on:click="resetSettings">重置</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "已保存",
            },
            watch: {
              settings: {
                handler() {
                  this.saveStatus = "保存中...";
                  setTimeout(() => {
                    this.saveStatus = "已保存";
                    console.log("设置已保存:", this.settings);
                  }, 500);
                },
                deep: true,
              },
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事项

1. **避免修改监听的数据**：在侦听器回调中修改被监听的数据可能导致无限循环。如果需要修改数据，请确保有适当的条件判断。
2. **性能考虑**：深度侦听会遍历整个对象树，对于大型对象可能会有性能开销。请谨慎使用 `{ deep: true }`。
3. **异步操作**：侦听器支持异步操作，但请注意处理好异步回调中的上下文问题。
4. **初始值**：`immediate: true` 会立即执行侦听器，此时 `oldValue` 为 `undefined`。
