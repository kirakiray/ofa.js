# o-app Component

`o-app` is one of the core components in ofa.js, used to configure and manage the entire application. Here are some key properties and methods of app:

## src

The "src" attribute is used to specify the specific address of the application parameter configuration module.

```javascript
const app = document.querySelector("o-app");
console.log(app.src);
```

## 当前

The `current` property is used to obtain the page instance currently being displayed. It lets you access and manipulate the page that is on screen, such as updating its content or performing specific actions.

```javascript
const currentPage = app.current;
```

## goto

The `goto` method is used to navigate to a specified page. You pass the address of the target page, and the app will load and display it. This is a key method for application navigation.

```javascript
app.goto("/page2.html");
```

## replace

The `replace` method is similar to `goto`, but it is used to replace the current page instead of adding a new page to the stack. This can be used to implement page replacement rather than stack navigation.

```javascript
app.replace("/new-page.html");
```

## back

The `back` method is used to return to the previous page, implementing the backward operation of page navigation. This navigates the user back to the previous page.

```javascript
app.back();
```

## routers

The `routers` property contains the application's routing configuration. It is a critical property that defines the routing rules and mappings for each page in the application. The routing configuration determines navigation between pages and how URLs are handled.

```javascript
const routeConfig = app.routers;
```