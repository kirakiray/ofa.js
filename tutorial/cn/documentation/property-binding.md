# 属性绑定

ofa.js 支持将数据绑定到元素实例化后对象的属性上，如 input 元素的 value 或 checked 属性等。

## 单向属性绑定

单向属性绑定采用 `:xxx` 语法，将数据从组件单向传递到元素属性上。这种绑定方式只会从组件向DOM元素传递数据，当组件数据变化时，DOM元素的属性会相应更新，但DOM元素的变化不会影响组件数据。

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
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>当前值: {{val}}</p>
      <input type="text" :value="val" placeholder="这是一个单向绑定的输入框">
      <p>注意：直接在输入框中修改内容不会改变上面显示的值</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 双向属性绑定

双向属性绑定采用 `sync:xxx` 语法，实现了组件数据与DOM元素之间的双向同步。当组件数据变化时，DOM 元素的属性会更新；当 DOM 元素的属性发生变化时（如用户输入），也会同步更新组件数据。

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>当前值: {{val}}</p>
      <input type="text" sync:value="val" placeholder="这是一个双向绑定的输入框">
      <p>提示：在输入框中修改内容会实时更新上面显示的值</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 双向绑定的特点

- 数据流向：组件 ↔ DOM 元素（双向）
- 组件数据变化 → DOM 元素更新
- DOM 元素变化 → 组件数据更新
- 适用于需要用户输入和数据同步的场景

### 常见的双向绑定场景

<o-playground style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>表单双向绑定示例</h3>
      <div class="form-group">
        <label>文本输入框:</label>
        <input type="text" sync:value="textInput" placeholder="输入文本">
      </div>
      <div class="form-group">
        <label>数字输入框:</label>
        <input type="number" sync:value="numberInput" placeholder="输入数字">
      </div>
      <div class="form-group">
        <label>多行文本:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="输入多行文本"></textarea>
      </div>
      <div class="form-group">
        <label>选择框:</label>
        <select sync:value="selectedOption">
          <option value="">请选择...</option>
          <option value="option1">选项1</option>
          <option value="option2">选项2</option>
          <option value="option3">选项3</option>
        </select>
      </div>
      <div class="form-group">
        <label>复选框:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> 我同意条款
        </label>
      </div>
      <div class="preview">
        <h4>实时预览:</h4>
        <p>文本: {{textInput}}</p>
        <p>数字: {{numberInput}}</p>
        <p>多行文本: {{textareaInput}}</p>
        <p>选择: {{selectedOption}}</p>
        <p>复选框状态: {{isChecked ? '已勾选' : '未勾选'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 注意事项

1. **性能考虑**：双向绑定会创建数据监听器，大量使用可能影响性能
2. **数据一致性**：双向绑定确保数据和视图的一致性，但要注意避免无限循环更新
3. **初始值设置**：确保绑定的数据有合适的初始值，避免 undefined 显示问题
4. **事件冲突**：避免在同一元素上同时使用双向绑定和手动事件处理，以免造成冲突
