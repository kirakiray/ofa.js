const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 设置视图引擎和公共静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由处理 - 根据ofa.js的同构渲染概念
app.get('*', (req, res) => {
  // 获取请求路径以确定要渲染的页面
  const pagePath = req.path === '/' ? '/home' : req.path;
  
  // 读取页面文件内容
  const fs = require('fs');
  const path = require('path');
  
  const getPageContent = (pathname) => {
    // 尝试从文件系统读取页面
    const pageMap = {
      '/': '/home',
      '/home': '/home',
      '/about': '/about',
      '/contact': '/contact'
    };
    
    const normalizedPath = pageMap[pathname] || pathname;
    
    switch(normalizedPath) {
      case '/home':
        return `
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  </style>
  <h1>Welcome to Home Page</h1>
  <p>This is rendered with SSR using ofa.js</p>
  <nav>
    <a href="/about">About</a> | 
    <a href="/contact">Contact</a>
  </nav>
  <button id="clickBtn">Click Me</button>
  <div id="counter">Count: 0</div>
  <script>
    export default async ({ load, query }) => {
      let count = 0;
      
      return {
        data: { count },
        attached() {
          const btn = document.getElementById('clickBtn');
          const counter = document.getElementById('counter');
          
          btn.addEventListener('click', () => {
            count++;
            counter.textContent = 'Count: ' + count;
          });
        },
      };
    };
  </script>
</template>`;
      case '/about':
        return `
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  </style>
  <h1>About Us</h1>
  <p>This is the about page rendered with SSR using ofa.js</p>
  <nav>
    <a href="/">Home</a> | 
    <a href="/contact">Contact</a>
  </nav>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {
          console.log('About page loaded');
        },
      };
    };
  </script>
</template>`;
      case '/contact':
        // 读取contact.page.html的内容
        try {
          const contactPagePath = path.join(__dirname, 'contact.page.html');
          if (fs.existsSync(contactPagePath)) {
            return fs.readFileSync(contactPagePath, 'utf8');
          }
        } catch (error) {
          console.error('Error reading contact page:', error);
        }
        
        // 如果无法读取文件，则返回内联版本
        return `
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
      padding: 20px;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }
    
    .contact-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #333;
      text-align: center;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    button {
      background-color: #007bff;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    button:hover {
      background-color: #0056b3;
    }
  </style>
  
  <div class="contact-container">
    <h1>Contact Us</h1>
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" placeholder="Enter your name">
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" placeholder="Enter your email">
    </div>
    <div class="form-group">
      <label for="message">Message:</label>
      <textarea id="message" rows="5" placeholder="Enter your message"></textarea>
    </div>
    <button id="submitBtn">Send Message</button>
    <div id="result" style="margin-top: 15px; color: green; font-weight: bold;"></div>
  </div>
  
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {
          const submitBtn = document.getElementById('submitBtn');
          const resultDiv = document.getElementById('result');
          
          submitBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if(name && email && message) {
              resultDiv.textContent = \`Thank you \${name}! Your message has been sent.\`;
              resultDiv.style.color = 'green';
              
              // Reset form
              document.getElementById('name').value = '';
              document.getElementById('email').value = '';
              document.getElementById('message').value = '';
            } else {
              resultDiv.textContent = 'Please fill in all fields.';
              resultDiv.style.color = 'red';
            }
          });
        },
      };
    };
  </script>
</template>`;
      default:
        return `
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  </style>
  <h1>Page Not Found</h1>
  <p>The requested page could not be found.</p>
  <nav>
    <a href="/">Home</a> | 
    <a href="/about">About</a> | 
    <a href="/contact">Contact</a>
  </nav>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {
          console.log('404 page loaded');
        },
      };
    };
  </script>
</template>`;
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
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('SSR demo with ofa.js is ready!');
});

module.exports = app;