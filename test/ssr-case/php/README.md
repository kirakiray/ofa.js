# ofa.js SSR 示例 (PHP 版本)

这是一个使用 PHP 实现 ofa.js 同构渲染（SSR）的示例项目。

## 项目结构

```
test/ssr-case/php/
├── index.php             # PHP 应用主文件
├── contact.page.html     # 页面组件示例
├── pages/                # 页面模板目录
│   ├── home.html         # 首页模板
│   ├── about.html        # 关于页模板
│   ├── contact.html     # 联系页模板
│   └── 404.html         # 错误页模板
├── static/               # 静态文件目录
│   └── app-config.js    # ofa.js 应用配置
└── README.md            # 本说明文件
```

## 功能特点

- **同构渲染**：服务端渲染初始页面内容，确保 SEO 和首屏加载速度
- **客户端接管**：客户端加载 CSR 运行引擎，保持流畅用户体验
- **多页面支持**：支持 /home、/about、/contact 等多个页面
- **动态路由**：根据请求路径动态生成相应页面内容

## 使用方法

1. 确保已安装 PHP (建议 PHP 7.4+)

2. 启动 PHP 内置服务器：
```bash
php -S localhost:8080
```

3. 访问应用：
- 主页: http://localhost:8080
- 关于: http://localhost:8080/about
- 联系: http://localhost:8080/contact

## 技术实现

此示例展示了 ofa.js 的同构渲染（Symphony Client-Server Rendering）模式：

1. 服务端生成带有通用运行结构的完整 HTML 页面
2. 客户端加载 CSR 运行引擎
3. 自动识别当前运行环境，决定渲染策略

参考 [ofa.js SSR 文档](../../../../tutorial/cn/documentation/ssr.md) 了解更多关于同构渲染的信息。

## 静态资源配置

- 需要将 `static` 目录配置为静态文件目录
- `app-config.js` 需要通过 `/app-config.js` 访问

## Nginx 配置示例

如果使用 Nginx 作为 Web 服务器，可以参考以下配置：

```nginx
server {
    listen 80;
    server_name localhost;
    root /path/to/test/ssr-case/php;
    index index.php index.html;

    # 静态文件目录
    location /app-config.js {
        alias /path/to/test/ssr-case/php/static/app-config.js;
    }

    # PHP 处理
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # 所有其他请求都交给 index.php 处理
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
```
