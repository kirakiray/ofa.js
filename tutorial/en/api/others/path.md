# PATH

The `PATH` attribute is typically used on custom components or page components to obtain the file address of the registered component. During development, this can help you understand the source of the component, especially when you need to reference or load other resource files. You can use the `PATH` attribute to construct file paths.

Below is a simple example demonstrating how to use the `PATH` property in a custom component:

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

In this example, we selected a `my-comp` element with the `id` "myCustomComponent", and then obtained the file path of this custom component through the `PATH` attribute. You can use the `componentPath` variable in the script section as needed, for example, to construct paths for other resource files or perform other operations.