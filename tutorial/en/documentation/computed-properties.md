# Computed Properties

Computed properties are a way to derive new data from reactive data, automatically updating based on changes in the dependent data. In ofa.js, computed properties are defined as special methods within the `proto` object, using JavaScript's `get` or `set` keywords.

## Features & Benefits

- **Cached**: The result of a computed property is cached and only recalculated when its dependencies change.  
- **Reactive**: The computed property automatically updates when its dependencies change.  
- **Declarative**: Dependencies are declared explicitly, making the code clearer and easier to understand.

## get Computed Property

The get computed property is used to derive new values from reactive data. It does not accept parameters and only returns a value calculated based on other data.

<o-playground name="get Computed Property Example" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="clickMe">Click Me - {{count}} - {{countDouble}}</button>
      <p>The value of computed property countDouble is: {{countDouble}}</p>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                console.log('countDouble is accessed');
                return this.count * 2;
              },
              clickMe() {
                this.count++;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Practical Application Scenario Examples

Computed properties are commonly used to handle complex data transformation logic, such as filtering arrays or formatting display text.

<o-playground name="Computed Property Example" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 5px;
          margin: 3px 0;
          background-color: #838383ff;
        }
      </style>
      <input type="text" sync:value="filterText" placeholder="Filter names...">
      <ul>
        <o-fill :value="filteredNames">
          <li>{{$data}}</li>
        </o-fill>
      </ul>
      <script>
        export default async () => {
          return {
            data: {
              filterText: '',
              names: ['Zhang3', 'Li4', 'Wang54']
            },
            proto: {
              get filteredNames() {
                if (!this.filterText) {
                  return this.names;
                }
                return this.names.filter(name => 
                  name.includes(this.filterText)
                );
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Computed Properties for Sets

Setter computed properties allow you to modify the underlying data state through assignment operations. It accepts a parameter and is typically used to inversely update the original data that depends on it.

<o-playground name="set computed property example" style="--editor-height: 700px">
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
      <div>
        <p>Base value: {{count}}</p>
        <p>Double value: {{countDouble}}</p>
        <button on:click="resetCount">Reset count</button>
        <button on:click="setCountDouble">Set double value to 10</button>
        <button on:click="incrementCount">Increment base value</button>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              count: 1,
            },
            proto: {
              get countDouble() {
                return this.count * 2;
              },
              set countDouble(val) {
                this.count = Math.max(0, val / 2); // ensure count is not negative
              },
              resetCount() {
                this.count = 0;
              },
              setCountDouble() {
                this.countDouble = 10;
              },
              incrementCount() {
                this.count++;
              }
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Computed Properties vs Methods

Although methods can achieve similar functionality, computed properties are cached and only re-evaluate when their dependencies change, resulting in better performance.

```javascript
// Using a computed property (recommended) – cached
get fullName() {
  return this.firstName + ' ' + this.lastName;
}

// Using a method – runs every time it's called
fullName() {
  return this.firstName + ' ' + this.lastName;
}
```

## Notes

1. **Avoid asynchronous operations**: Computed properties must remain synchronous and side-effect-free; asynchronous calls or direct state mutation are forbidden.  
2. **Dependency tracking**: Rely only on reactive data; otherwise updates will be unpredictable.  
3. **Error protection**: Circular dependencies or improper assignments inside a computed property can crash rendering or trigger infinite loops—set boundary conditions and handle exceptions in advance.

## Practical Application Example

Here is a simple form validation example demonstrating the utility of computed properties:

<o-playground name="Form Validation Example" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 200px;
        }
        .status {
          margin-top: 10px;
          padding: 8px;
          border-radius: 4px;
        }
        .valid {
          background-color: #d4edda;
          color: green;
        }
        .invalid {
          background-color: #f8d7da;
          color: red;
        }
      </style>
      <h3>Simple Validation Example</h3>
      <input type="text" sync:value="username" placeholder="Enter username (at least 3 characters)">
      <p class="status" class:valid="isValid" class:invalid="!isValid">
        Status: {{statusMessage}}
      </p>
      <script>
        export default async () => {
          return {
            data: {
              username: ''
            },
            proto: {
              get isValid() {
                return this.username.length >= 3;
              },
              get statusMessage() {
                return this.isValid ? 'Username valid' : 'Username too short';
              },
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

