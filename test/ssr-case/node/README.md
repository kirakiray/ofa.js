# ofa.js SSR 示例

这是一个使用 Express.js 实现 ofa.js 同构渲染（SSR）的示例项目。

## 项目结构

```
test/ssr-case/node/
├── app.js              # Express.js 应用主文件
├── contact.page.html   # 页面组件示例
├── package.json        # 项目依赖配置
├── pages/              # 页面模板目录
│   ├── home.html       # 首页模板
│   ├── about.html      # 关于页模板
│   ├── contact.html    # 联系页模板
│   └── 404.html        # 错误页模板
├── static/             # 静态文件目录
│   └── app-config.js   # ofa.js 应用配置
└── README.md           # 本说明文件
```

## 功能特点

- **同构渲染**：服务端渲染初始页面内容，确保 SEO 和首屏加载速度
- **客户端接管**：客户端加载 CSR 运行引擎，保持流畅用户体验
- **多页面支持**：支持 /home、/about、/contact 等多个页面
- **动态路由**：根据请求路径动态生成相应页面内容

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 启动服务器：
```bash
npm start
```

3. 访问应用：
- 主页: http://localhost:3000
- 关于: http://localhost:3000/about
- 联系: http://localhost:3000/contact

## 技术实现

此示例展示了 ofa.js 的同构渲染（Symphony Client-Server Rendering）模式：

1. 服务端生成带有通用运行结构的完整 HTML 页面
2. 客户端加载 CSR 运行引擎
3. 自动识别当前运行环境，决定渲染策略

参考 [ofa.js SSR 文档](../../../../tutorial/cn/documentation/ssr.md) 了解更多关于同构渲染的信息。

## 静态资源配置

- 静态文件服务配置在 3000 端口下的 `/static` 目录
- `app-config.js` 现在位于 `/static` 目录中，可通过 `/app-config.js` 访问