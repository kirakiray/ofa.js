# Conditional Rendering

In ofa.js, conditional rendering is an important feature that allows deciding whether to render a certain element or component based on the data state. ofa.js provides a component-based conditional rendering solution, implemented through the `o-if`, `o-else-if`, and `o-else` components.

## o-if Component

The `o-if` component is used to conditionally render its content based on the truthiness of an expression. When the bound `value` attribute is a truthy value, the content inside the component will be rendered; otherwise, the content will not appear in the DOM.

<o-playground name="o-if Work Principle Demo" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>### How o-if Works

`o-if` renders content into the DOM only when the condition is true. When the condition is false, the DOM elements inside `o-if` are completely removed. This implementation is suitable for situations where conditions do not change frequently, as it involves the creation and destruction of DOM elements.

## o-else-if and o-else Components

When multiple conditional branches are needed, you can use the `o-else-if` and `o-else` components together with `o-if` to implement multi-branch conditional rendering.

- `o-if`: The mandatory first conditional component
- `o-else-if`: Optional intermediate conditional components, which can be multiple
- `o-else`: Optional default conditional component, placed at the end

<o-playground name="Multi-Branch Conditional Rendering Example" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- Switch between different content based on the remainder of num divided by 3 -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>## Real-world Application Scenarios

### User Permission Control

<o-playground name="User Permission Control Example" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">Switch User Role</button>
        <p>Current Role: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Admin Panel</h3>
            <button>Manage Users</button>
            <button>System Settings</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>User Info</h3>
            <p>Welcome {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Please login to view content</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Guest'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = 'John';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>### Form Validation Status Display

<o-playground name="Form Validation Status Display Example" style="--editor-height: 500px">
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
      <div>
        <h3>Email Validation Example</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="Enter email address">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ Email format is correct</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ Email format is incorrect</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Please enter an email address for validation</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>## Best Practices for Conditional Rendering

1. **Use case**: Use `o-if` when an element rarely changes under different conditions, as it completely removes unnecessary elements and saves memory.

2. **Performance**: For frequently toggled elements, prefer class binding (e.g., `class:hide`) over conditional rendering, which creates and destroys DOM nodes.

3. **Clear structure**: Conditional rendering is ideal for switching between content with different structures, such as tabs or step-by-step guides.