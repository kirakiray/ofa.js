
const querystring = require("querystring");
const url = require("url");
const path = require('path');
const util = require('util');
const { stat, readFile } = require('fs').promises;
const { createReadStream } = require("fs");
const zlib = require('zlib');
const gzip = util.promisify(zlib.gzip)

// 静态服务器中间件
module.exports = {
    proto: {
        // 静态文件返回相应的mime字符
        mines: new Map([
            [".bmp", "image/bmp"],
            [".png", "image/png"],
            [".gif", "image/gif"],
            [".jpg", "image/jpeg"],
            [".svg", "image/svg+xml"],
            [".html", "text/html"],
            [".htm", "text/html"],
            [".js", "application/javascript"],
            [".css", "text/css"],
            [".appcache", "text/cache-manifest"],
            [".json", "application/json"],
            [".map", "application/octet-stream"]
        ]),
        // 主体目录映射对象
        static: new Map()
    },
    async skin(ctx, next) {
        let { request, respone } = ctx;
        let url = request.url;

        // 匹配头部
        for (let k of this.static) {
            let k_expr = new RegExp(`^${k[0]}`);
            if (k_expr.test(url)) {
                // 修正url
                url = url.replace(k_expr, k[1]);

                // 获取stat
                let fileStat;
                try {
                    fileStat = await stat(url);
                } catch (e) {
                    return;
                }

                console.log("fileStat", fileStat);

                // 获取mime类型
                let ext = path.extname(url);

                // 判断是否存在相应的mime类型
                let targetMIME = this.mines.get(ext);

                if (targetMIME) {
                    ctx.respHead['Content-Type'] = targetMIME;
                } else {
                    // 不在mime内，content-type为数据流
                    ctx.respHead['Content-Type'] = "application/octet-stream";
                }

                if (/image/.test(targetMIME) || !targetMIME) {
                    // 图片类型直接传递数据
                    // 设置文件大小
                    ctx.respHead['Content-Length'] = fileStat.size;

                    createReadStream(url).pipe(respone);
                } else {
                    let file = await readFile(url);

                    // 添加gz压缩头信息
                    ctx.respHead['Content-Encoding'] = 'gzip';
                    file = await gzip(file);

                    ctx.body = file;
                }

                // 设置200状态
                ctx.code = 200;
            }
        }

    }
};