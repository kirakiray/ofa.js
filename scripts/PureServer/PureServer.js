/**
 * 设计一个最简单的服务器，用于开发工具的静态文件服务器
 * 提供简单的接口抛出功能
 */
const http = require('http');
const util = require('util');
const zlib = require('zlib');
const gzip = util.promisify(zlib.gzip)

// 静态服务器
const staticSkin = require("./skins/static");
const route = require("./skins/route");

// 运行skin
const runSkin = async ({ target, ctx, runned, task, id }) => {
    // 已经运行过的函数
    if (!runned) {
        runned = new Set();
    }

    // 初始化id
    if (!id) {
        id = 0;
    }

    // 运行任务
    let targetTask = task[id];

    if (targetTask) {
        // 判断是否运行过
        if (!runned.has(targetTask)) {
            // 加入已运行列表
            runned.add(targetTask);

            await targetTask.call(target, ctx, async () => {
                task[id + 1] && (await runSkin({ target, ctx, runned, task, id: id + 1 }));
            });
        }

        // 进入下一个任务
        await runSkin({ target, ctx, runned, task, id: id + 1 });
    }
}

class PureServer {
    constructor() {
        // 添加自定义接口服务
        this.use(route);

        // 添加 static 静态文件服务模块
        this.use(staticSkin);
    }

    // 中间件存放处
    _skins = [];

    // 服务器
    _server = "";

    // 端口号
    _port = 9669;

    set listen(port = 9669) {
        this._port = port;

        let server = this._server = http.createServer();

        server.on("request", async (request, respone) => {
            // 返回头
            let respHead = {
                // 服务器类型
                'Server': "PureServer",
                'access-control-allow-origin': "*"
                // 添加max-age（http1.1，一直缓存用；免去使用Etag和lastModify判断，只用版本号控制）
                // 'Cache-Control': "max-age=315360000"
            };

            // 主体传递对象ctx
            let ctx = {
                request,
                respone,
                body: undefined,
                respHead: respHead,
                code: undefined,
                // 是否需要压缩
                gzip: false
            };

            // 运行skins
            await runSkin({ target: this, ctx, task: this._skins.map(skinObj => skinObj.skin) });

            // 设置code
            let code = ctx.code;

            if (!code && ctx.body === undefined) {
                respone.writeHead(404);
                respone.end();
                return;
            }

            if (ctx.body) {
                if (ctx.gzip) {
                    ctx.respHead['Content-Encoding'] = 'gzip';
                    ctx.body = await gzip(ctx.body);
                }

                // 添加长度
                ctx.respHead['Content-Length'] = ctx.body.length;
            }

            // 头部文件
            respone.writeHead(code || 200, ctx.respHead);

            ctx.body && respone.end(ctx.body);
        });

        server.listen(port);
    }

    get _port() {
        return this._port;
    }

    // 中间件方法
    // 不能存放相同的函数
    use(func) {
        if (func instanceof Function) {
            // 加入到队列内
            this._skins.push({
                skin: func
            });
        } else if (func instanceof Object && func.skin) {
            // 需要合并的数据
            let proto = {};

            if (func.init) {
                let d = func.init.call(this);
                Object.assign(proto, d);
            }

            if (func.proto) {
                Object.assign(proto, func.proto);
            }

            //  合并到自身
            Object.assign(this, proto);

            this._skins.push({
                skin: func.skin,
                data: proto
            });
        }
    }
    // 去除中间件
    unuse(func) {
        if (func instanceof Object) {
            func = func.skin
        }

        let id = this._skins.find(e => skin === func);
        if (id > -1) {
            // 获取目标对象
            let tarObj = this._skins[id];

            // 删除依赖数据
            if (tarObj.data) {
                Object.keys(tarObj.data).forEach(k => {
                    delete this[k];
                });
            }

            this._skins.splice(id, 1);
        }
    }
}

exports.PureServer = PureServer;
