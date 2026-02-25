const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "static")));

// 路由处理 - 根据ofa.js的同构渲染概念
app.get("*", (req, res) => {
  // 获取请求路径以确定要渲染的页面
  const pagePath = req.path === "/" ? "/home" : req.path;

  // 读取页面文件内容
  const fs = require("fs");
  const path = require("path");

  const getPageContent = (pathname) => {
    // 尝试从文件系统读取页面
    const pageMap = {
      "/": "/home",
      "/home": "/home",
      "/about": "/about",
      "/contact": "/contact",
    };

    const normalizedPath = pageMap[pathname] || pathname;

    // 构建页面文件路径
    let pageFilePath;
    switch (normalizedPath) {
      case "/home":
        pageFilePath = path.join(__dirname, "pages", "home.html");
        break;
      case "/about":
        pageFilePath = path.join(__dirname, "pages", "about.html");
        break;
      case "/contact":
        pageFilePath = path.join(__dirname, "pages", "contact.html");
        break;
      default:
        pageFilePath = path.join(__dirname, "pages", "404.html");
        break;
    }

    // 尝试读取页面文件
    try {
      if (fs.existsSync(pageFilePath)) {
        return fs.readFileSync(pageFilePath, "utf8");
      } else {
        console.warn(`Page file not found: ${pageFilePath}`);
        // 返回默认的404页面
        const default404Path = path.join(__dirname, "pages", "404.html");
        if (fs.existsSync(default404Path)) {
          return fs.readFileSync(default404Path, "utf8");
        }
      }
    } catch (error) {
      console.error(`Error reading page file: ${pageFilePath}`, error);
      // 发生错误时，也返回404页面
      const errorPagePath = path.join(__dirname, "pages", "404.html");
      if (fs.existsSync(errorPagePath)) {
        return fs.readFileSync(errorPagePath, "utf8");
      } else {
        // 如果404页面也不存在，则返回简单错误信息
        return `<template page><h1>Page Not Found</h1><p>The requested page could not be found.</p></template>`;
      }
    }
  };

  // 生成完整的HTML页面 - 符合ofa.js同构渲染结构
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ofa.js SSR Demo</title>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    ${getPageContent(pagePath)}
  </o-app>
</body>
</html>`;

  // 设置正确的Content-Type头部
  res.setHeader("Content-Type", "text/html; charset=UTF-8");
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("SSR demo with ofa.js is ready!");
});

module.exports = app;
