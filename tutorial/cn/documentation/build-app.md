# 生产与部署

使用 ofa.js 开发的项目，直接部署到静态服务器上就能进行使用。

## 开发环境

你可以使用官方的 [ofa Studio](https://core.noneos.com/?redirect=studio) 进行开发，它提供了一键式的项目创建和预览。

使用VSCode之类的编辑，进行开发你的项目。

你还可以自建静态服务器：
* 使用 Nginx 或 Apache 等静态服务器软件。或者直接
* 使用Nodejs的 [http-server](https://www.npmjs.com/package/http-server) 模块。
* 直接使用编辑器的静态服务器插件来预览。

## 生产环境

### 导出项目

如果你使用的是 [ofa Studio](https://core.noneos.com/?redirect=studio)构建的项目，直接使用工具内自带的导出项目即可。

### 压缩混淆

生产环境一般需要压缩混淆工具，以减小文件大小，提高加载速度。你可以使用 [Terser CLI](https://terser.org/docs/cli-usage/) 进行压缩混淆。

如果你不想接触命令行工具，你可以直接 [ofa build](https://builder.ofajs.com/)进行文件的压缩混淆。这个工具是测试版，后期会合并到 ofa studio 中。

