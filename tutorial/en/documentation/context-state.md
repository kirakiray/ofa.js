# Context Status

Context state is a mechanism in ofa.js for cross-component data sharing. Through the Provider and Consumer pattern, it enables data transfer between parent-child components and across hierarchical components without the need to pass data layer by layer via props.

## Core Concepts

- **o-provider**: Data provider; defines the data to be shared.
- **o-consumer**: Data consumer; fetches data from the nearest provider.
- **watch:xxx**: Watches changes in consumer data and binds them to component or page module properties.

## o-provider Provider

The `o-provider` component is used to define a provider of shared data. It identifies itself by the `name` attribute and defines the data to share through attributes such as `custom-a="value"`.

```html
<o-provider name="userInfo" custom-name="Zhang San" custom-age="25">
  ...
</o-provider>
```

### Attributes

- `name`: The unique identifier of the provider, used by consumers to locate the corresponding provider

### Features

1. **Automatic Attribute Passing**: All non-reserved attributes on a provider are passed as shared data.  
2. **Reactive Updates**: When a provider’s data changes, consumers with the matching name automatically update.  
3. **Hierarchical Lookup**: Consumers start searching for data with the given name from the nearest ancestor provider.

## o-consumer Consumer

The `o-consumer` component is used to consume data from a provider. It specifies the provider to consume from via the `name` attribute.

```html
<o-consumer name="userInfo"></o-consumer>
```

### Attributes

- `name`: the name of the provider to consume

### Features

1. **Automatic Data Retrieval**: The consumer automatically fetches data corresponding to the name from the nearest parent provider.
2. **Attribute Merging**: If multiple providers with the same name have a certain attribute, the attribute from the provider closest to the consumer takes precedence.
3. **Attribute Monitoring**: Specific attribute changes can be monitored via `watch:xxx`.

## Monitoring Data Changes

You can monitor changes in provider data via `watch:xxx`:

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data: {
    age: 0,
  },
};
</script>
```

## Basic Example

<o-playground name="Basic Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>User ID: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      {{userId}} Avatar
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      User-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>## o-root-provider Root Provider

`o-root-provider` is a root-level global provider whose scope covers the entire document. Consumers can access the root provider’s data even when no parent provider exists.

```html
<!-- Define global root provider -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Can be consumed anywhere on the page -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### Features

1. **Global Scope**: Data from root providers is available across the entire page.  
2. **Precedence**: When a provider and a root-provider share the same name, the provider closest to the consumer takes precedence.  
3. **Removability**: After a root-provider is removed, consumers fall back to searching for other providers.

## root-provider Example

<o-playground name="root-provider example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>Theme: {{theme}}</div>
        <div>Language: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Header - Theme: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Content - Language: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>### Priority Example

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="custom-value="parent">
 ...
 <!-- Here👇 the custom-value obtained is "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- Here👇 the custom-value obtained is "root" -->
<o-consumer name="test"></o-consumer>
```

### Priority Example Demonstration

<o-playground name="Priority Example Demo" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>Value in parent Provider: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>Root Provider value: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        Value in child component: {{customValue}} (nearest is {{customValue}} provider)
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>## getProvider(name) Method

`getProvider(name)` is an instance method that retrieves the provider element matching the given name. It walks up the DOM to find the closest ancestor provider; if none is found, it returns the root-provider.

### Use the getProvider(name) method inside a component or page module.

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

## getProvider Example

<o-playground name="getProvider Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="Zhang San" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Get Provider Data</button>
      <div>Current Name: {{currentName}}</div>
      <div>Current Age: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Update Provider Data</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider found:", provider);
                console.log("Name:", provider.customName);
                console.log("Age:", provider.customAge);
                alert(`Provider data: ${provider.customName}, ${provider.customAge} years old`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "Li Si";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>### Obtaining the Provider from an Element

```javascript
// Get the provider from the parent of the current element
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("Provider found:", provider.customName);
}

// Directly get the global root-provider
const globalProvider = $.getRootProvider("globalConfig");
```

### Usage Scenario

1. **Manual Data Retrieval**: Used when direct access to provider data is required  
2. **Cross Shadow DOM**: Locate an ancestor provider inside Shadow DOM  
3. **Event Handling**: Obtain the corresponding provider within an event callback

## Dispatch Event

A provider can dispatch events to all consumers that consume it:

```html
<o-provider name="test" id="myProvider" custom-value="Hello">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// Dispatch event
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hello World" }
});
</script>
```

## Event Dispatch Example

<o-playground name="Event Dispatch Example" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["Welcome to the chat room"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>Chat Room</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="Enter message...">
      <button on:click="sendMessage">Send</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>## Best Practices

1. **Reasonable Naming**: Use meaningful names for providers and consumers to facilitate tracking and maintenance
2. **Avoid Overuse**: Context state is suitable for sharing data across components; props are recommended for regular parent-child components
3. **Root Provider for Global Configuration**: Themes, languages, global states, etc. are suitable for root-provider
4. **Timely Cleanup**: When a provider is removed, consumers will automatically clean up data without manual handling