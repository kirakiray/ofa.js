# ofa.js SSR 示例 (Go 版本)

这是一个使用 Go 语言实现 ofa.js 同构渲染（SSR）的示例项目。

## 项目结构

```
test/ssr-case/go/
├── main.go              # Go 应用主文件
├── contact.page.html    # 页面组件示例
├── pages/               # 页面模板目录
│   ├── home.html        # 首页模板
│   ├── about.html       # 关于页模板
│   ├── contact.html     # 联系页模板
│   └── 404.html        # 错误页模板
├── static/              # 静态文件目录
│   └── app-config.js   # ofa.js 应用配置
└── README.md           # 本说明文件
```

## 功能特点

- **同构渲染**：服务端渲染初始页面内容，确保 SEO 和首屏加载速度
- **客户端接管**：客户端加载 CSR 运行引擎，保持流畅用户体验
- **多页面支持**：支持 /home、/about、/contact 等多个页面
- **动态路由**：根据请求路径动态生成相应页面内容

## 使用方法

1. 确保已安装 Go (建议 Go 1.16+)

2. 启动服务器：
```bash
cd /path/to/test/ssr-case/go
go run main.go
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

- 静态文件服务配置在 3000 端口下的 `/app-config.js` 路径
- `app-config.js` 位于 `static` 目录中，可通过 `/app-config.js` 访问

## 构建为可执行文件

可以将项目构建为独立的可执行文件：

```bash
go build -o ssr-demo main.go
./ssr-demo
```

## Nginx 配置示例

如果使用 Nginx 作为反向代理，可以参考以下配置：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
