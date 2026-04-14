# o-app Component

## Properties
```javascript
const app = $("o-app");

app.src              // Get app config src
app.current          // Get current page instance
app.routers          // Route configuration
```

## Navigation Methods
```javascript
app.goto("./page.html")       // Navigate to page
app.replace("./page.html")     // Replace current page
app.back()                     // Go back
```

## In Page Component
```javascript
// Navigation
this.goto("./about.html");
this.back();
this.replace("./new-page.html");

// Access app
this.app.goto("./page.html");
this.app.getSomeData();
```

## Link Navigation
```html
<a href="./about.html" olink>Go to About</a>
```
