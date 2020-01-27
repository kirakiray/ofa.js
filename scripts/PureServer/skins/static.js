
const urltool = require('url');
const path = require('path');
const { stat, readFile } = require('fs').promises;
const { createReadStream } = require("fs");

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
        // 需不要gzip的类型
        nozip: new Set([".bmp", ".png", ".gif", ".jpg"]),
        // 主体目录映射对象
        _static: new Map(),
        // 设置路径
        setStatic(dir, dirPath) {
            this._static.set(dir, {
                expr: new RegExp(`^${dir}`),
                dirPath
            });
        },
        // 去除路径
        removeStatic(dir) {
            this._static.delete(dir);
        }
    },
    async skin(ctx, next) {
        let { request, respone } = ctx;
        let urlObj = urltool.parse(request.url);
        let url = urlObj.pathname;

        // 匹配头部
        for (let d of this._static.values()) {
            let k_expr = d.expr;
            if (d.expr.test(url)) {
                // 修正url
                url = url.replace(k_expr, d.dirPath);

                // 获取stat
                let fileStat;
                try {
                    fileStat = await stat(url);
                } catch (e) {
                    return;
                }

                if (!fileStat.isFile()) {
                    return;
                }

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

                if (this.nozip.has(ext) || !targetMIME) {
                    // 图片类型直接传递数据
                    // 设置文件大小
                    ctx.respHead['Content-Length'] = fileStat.size;

                    createReadStream(url).pipe(respone);
                } else {
                    let file = await readFile(url);

                    // 需要压缩内容
                    ctx.gzip = true;

                    ctx.body = file;
                }

                // 设置200状态
                ctx.code = 200;
                break;
            }
        }

    }
};