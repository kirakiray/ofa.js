# Property Binding

ofa.js supports binding data to properties of instantiated element objects, such as the value or checked attributes of input elements.

## One-way property binding

One-way property binding uses the `:toKey="fromKey"` syntax to synchronize component data "one-way" to DOM element properties. When the component data changes, the element properties update immediately; however, changes to the element itself (such as user input) are not written back to the component, maintaining a single and controllable data flow.

<o-playground name="One-way Property Binding" style="--editor-height: 500px">
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
      <p>Current value: {{val}}</p>
      <input type="text" :value="val" placeholder="This is a one-way bound input">
      <p>Note: editing the input directly won't change the displayed value above</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>## Two-way Property Binding

Two-way property binding uses the `sync:xxx` syntax to synchronize component data with DOM element attributes bidirectionally. When the component data changes, the DOM element’s attribute is updated; when the attribute changes (e.g., through user input), the component data is updated in sync.

<o-playground name="Two-way Property Binding" style="--editor-height: 500px">
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
      <p>Current Value: {{val}}</p>
      <input type="text" sync:value="val" placeholder="This is a two-way bound input field">
      <p>Tip: Modifying content in the input field will update the displayed value above in real-time.</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>### Features of Two-way Binding

- Data Flow: Component ↔ DOM Element (Two-way)
- Component data changes → DOM element updates
- DOM element changes → Component data updates
- Applicable to scenarios requiring user input and data synchronization

### Common Two-Way Binding Scenarios

<o-playground name="Two-way Form Binding Example" style="--editor-height: 700px">
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
      <h3>Two-way Form Binding Example</h3>
      <div class="form-group">
        <label>Text Input:</label>
        <input type="text" sync:value="textInput" placeholder="Enter text">
      </div>
      <div class="form-group">
        <label>Number Input:</label>
        <input type="number" sync:value="numberInput" placeholder="Enter number">
      </div>
      <div class="form-group">
        <label>Textarea:</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Enter multi-line text"></textarea>
      </div>
      <div class="form-group">
        <label>Select Box:</label>
        <select sync:value="selectedOption">
          <option value="">Please choose...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Checkbox:</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> I agree to the terms
        </label>
      </div>
      <div class="preview">
        <h4>Live Preview:</h4>
        <p>Text: {{textInput}}</p>
        <p>Number: {{numberInput}}</p>
        <p>Textarea: {{textareaInput}}</p>
        <p>Select: {{selectedOption}}</p>
        <p>Checkbox status: {{isChecked ? 'checked' : 'unchecked'}}</p>
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
</o-playground>## Notes

1. **Performance**: Two-way binding creates data watchers; heavy use can impact performance.  
2. **Data Consistency**: It keeps data and view in sync, but guard against infinite update loops.  
3. **Initial Values**: Provide proper initial values for bound data to prevent undefined display issues.  
4. **Event Conflicts**: Avoid combining two-way binding with manual event handling on the same element to prevent conflicts.