# Single Page Application (Router)

## Basic Setup
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/router/dist/router.min.mjs"></l-m>
    <o-router fix-body>
      <o-app src="./app-config.js"></o-app>
    </o-router>
  </body>
</html>
```

## app-config.js
```javascript
export const home = "./home.html";

export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

export const proto = {
  getSomeData() {
    return "Hello from app";
  }
};
```

## Navigation
```javascript
// In page component
this.goto("./about.html");  // Navigate to page
this.back();                // Go back
this.replace("./new-page.html"); // Replace current page
```

## Link Navigation
```html
<a href="./about.html" olink>Go to About</a>
```

## app Instance
```javascript
this.app.goto("./page.html");  // Navigate
this.app.back();               // Go back
const current = this.app.current; // Get current page
```
