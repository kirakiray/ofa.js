# SSR and Isomorphic Rendering

If you don't know what SSR is, it means you don't need it yet. You can skip this chapter and come back to study it later when you need it.

## Isomorphic Rendering

To simultaneously retain the smooth CSR experience, achieve better crawler recognition for SEO, and enjoy more freedom in choosing backend development languages, ofa.js provides a unique isomorphic rendering mode called Symphony Client-Server Rendering.

> To understand the specific definitions and differences between CSR, SSR, and SSG, please read the final section of this article.

The core concept of isomorphic rendering is:- Render the initial page on the server for SEO and fast first-screen load  
- Let the client take over routing afterward, preserving the smooth UX of CSR  
- Works with any server stack, enabling true isomorphic rendering

### Implementation Principles of Isomorphic Rendering

The isomorphic rendering mode of ofa.js is based on the following mechanisms:

1. Server generates a complete HTML page with a universal runtime structure
2. Client loads CSR runtime engine
3. Automatically detects current runtime environment and decides rendering strategy

### Isomorphic Rendering Code Structure

**Original CSR Page Module:**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>I am Page</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**The complete page after isomorphic rendering encapsulation:**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Page module content insertion location ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>I am Page</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

So, you can use any development language (Go, Java, PHP, Node.js, Python, etc.) and any backend template rendering engine (such as Go's `html/template`, PHP's Smarty/Twig/Blade, etc.) to embed the isomorphic rendering code structure of ofa.js into the template, thereby achieving SSR.

* [Nodejs SSR Case](https://github.com/kirakiray/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR Case](https://github.com/kirakiray/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR Case](https://github.com/kirakiray/ofa.js/tree/main/test/ssr-case/go)

### Isomorphic Rendering Template Structure

To implement the isomorphic rendering mode, simply use the following universal template structure on the server side:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- Dynamically insert the corresponding page module content -->
  </o-app>
</body>

</html>
```

**Note:** The HTML returned by the server must have the correct HTTP header set: `Content-Type: text/html; charset=UTF-8`

`scsr.mjs` is the isomorphic rendering engine provided by ofa.js; it automatically selects the rendering strategy based on the current page’s runtime state, ensuring an optimal user experience in any environment.

Similarly, SSG can also use this structure to implement static site generation.

## Differences between ofa.js, SSR, and other front-end frameworks

ofa.js's Symphony Client-Server Rendering (SCSR) is essentially also an SSR pattern.

Compared to SSR solutions of existing front-end frameworks like Vue, React, and Angular, the biggest advantage of ofa.js is that **it does not require mandatory binding to Node.js**. This means that any backend template rendering engine (such as Smarty for PHP, Jinja2 for Python, Thymeleaf for Java, etc.) can easily integrate ofa.js to achieve SSR.

## Overview of Web Rendering Methods

Modern web applications mainly have four rendering methods: traditional server-side template engine rendering, CSR (Client Side Rendering), SSR (Server Side Rendering), and SSG (Static Site Generation). Each method has its own advantages and applicable scenarios.

### Traditional Server-Side Template Engine Rendering

Among the many Web solutions, server-side template engines remain the most mainstream way to render pages. Back-end languages like Go and PHP rely on built-in or third-party template engines—such as Go’s html/template or PHP’s Smarty/Twig/Blade—to inject dynamic data into HTML templates, generating a complete HTML page in one pass and returning it to the client.

**Pros:**- SEO-friendly with fast first-screen loading
- Server-side control, offering higher security
- Lower technical stack requirements for the team, allowing backend developers to complete development independently

**Disadvantages:**- Poor user experience; each interaction requires a page refresh
- High server-side load
- High coupling between front-end and back-end, hindering division of labor and collaboration

### CSR (Client-Side Rendering)

In CSR mode, the page content is entirely rendered by browser-side JavaScript. The [single-page application](./routes.md) of ofa.js is a typical CSR implementation. This approach provides a smooth user experience, allowing all interactions to be completed without page navigation. Single-page applications (SPA) developed with React or Vue using their corresponding routing libraries (such as React Router or Vue Router) are all typical CSR implementations.

**Pros:**- Smooth user experience with seamless page transitions
- Strong client-side processing power and rapid response

**Disadvantages:**- Not conducive to SEO; search engines struggle to index the content

### SSR (Server-Side Rendering)

While preserving the fluid CSR experience, the page is now rendered in real time by the server: upon a user request, the server instantly generates the full HTML and returns it, achieving true server-side rendering.

**Pros:**- SEO-friendly with fast first-screen loading
- Supports dynamic content

**Disadvantages:**- High server load
- Typically requires a Node.js environment as a runtime or at least a Node.js middleware layer
- Still requires subsequent client-side activation to achieve full interactivity

### SSG (Static Site Generation)

During the build phase, all pages are pre-rendered as static HTML files, which can be served directly to users by the server after deployment.

**Pros:**- Fast first-load speed, SEO-friendly
- Low server load, stable performance
- High security

**Disadvantages:**- Difficult to update dynamic content
- Build time increases with the number of pages