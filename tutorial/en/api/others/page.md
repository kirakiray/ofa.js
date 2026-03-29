# o-page Component

`o-page` is one of the core components in ofa.js, representing an independent page or page module. Below are some key properties and methods of `o-page`:

## src attribute

The `src` attribute specifies the exact address of the page module. It is the key attribute that defines the page's content and behavior, telling the application where to load the content for a specific page.

```javascript
const page = this;
```

## goto method

The `goto` method is used to navigate from the current page to another page. Compared with the `goto` method of `app`, the `goto` method of `page` can use **relative paths** to navigate to other pages.

```javascript
page.goto("./page2.html");
```

## replace method

The `replace` method replaces the current page with another page. It is similar to the `replace` method of `app`, but performs the replacement within the page.

```javascript
page.replace("./new-page.html");
```

## back method

The `back` method is used to return to the previous page. It navigates the user back to the last page, similar to the browser's back operation.

```javascript
page.back();
```