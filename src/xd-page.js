const PAGESTAT = Symbol("pageStat");
const NAVIGATEDATA = Symbol("navigateData");

let xdpageStyle = $(`<style>xd-page{display:block;}</style>`);
$("head").push(xdpageStyle);

$.register({
    tag: "xd-page",
    temp: false,
    proto: {
        get stat() {
            return this[PAGESTAT];
        },

        // 获取页面寄宿的app对象
        get app() {
            return this.parents("xd-app")[0];
        },
        set pageParam(param) {
            this._pageParam = param;
        },
        get pageParam() {
            let pageParam = this._pageParam;

            if (!pageParam) {
                let { app } = this;

                if (app) {
                    pageParam = app.pageParam;
                }
            }

            return pageParam;
        },
        get params() {
            let paramsExprArr = /\?(.+)/.exec(this.src);
            if (paramsExprArr) {
                let obj = {};
                let arr = paramsExprArr[1].split("&");
                arr.forEach(str => {
                    let [k, v] = str.split("=");
                    if (k && v) {
                        obj[k] = v;
                    }
                });
                return obj;
            }
        },
        // 页面跳转
        navigate(opts) {
            let { app } = this;
            if (!app) {
                console.warn("no app =>", this);
                return;
            }
            opts.self = this;
            app.navigate(opts);
        },
        // 页面返回
        back() {
            this.navigate({ type: "back" });
        }
    },
    data: {
        src: "",
        _pageOptions: null
    },
    attrs: ["src"],
    watch: {
        async src(e, val) {
            if (!val) {
                return;
            }
            if (this[PAGESTAT] !== "unload") {
                throw {
                    target: this,
                    desc: "xd-page can't reset src"
                };
            }

            // 加载页面模块数据
            this[PAGESTAT] = "loading";

            let pageOpts = await load(val + " -r");

            this._pageOptions = pageOpts;

            let defaults = {
                // 默认模板
                temp: true,
                // 加载组件样式
                link: false,
                // 监听属性函数
                watch: {},
                // 自有属性
                data: {},
                // 依赖子模块
                // use: []
                // 页面渲染完成
                // ready() { },
                // 页面被关闭时调用
                // destory() { },
                // 下面需要搭配 xd-app
                // 页面被激活时调用，搭配xd-app使用
                // onActive() { },
                // 被放置后台时调用
                // onHide() { },
                // xdapp相关pageParam属性
                // pageParam: {}
            };

            Object.assign(defaults, pageOpts);

            // 分解初始url
            let path = "";
            let paramStr = "";
            let paramsExprArr = /(.+)\??(.*)/.exec(val);
            if (paramsExprArr) {
                path = paramsExprArr[1];
                paramStr = paramsExprArr[2];
            }

            // 获取组件名
            let fileName;
            let oriFileName;
            let fileExprArr = /.+\/(.+)/.exec(path)
            if (fileExprArr) {
                oriFileName = fileName = fileExprArr[1];

                // 去掉后缀
                fileName = fileName.replace(/\..+/, "");
            }

            let relativeDir = /.+\//.exec(path);
            if (relativeDir) {
                relativeDir = relativeDir[0];
            }

            // 重新制作load方法
            const relativeLoad = (...args) => main.load(main.toUrlObjs(args, relativeDir));

            // 加载依赖组件
            if (defaults.use && defaults.use.length) {
                await relativeLoad(...defaults.use);
            }

            // 获取temp内容
            let temp = "";

            if (!defaults.temp) {
                throw {
                    desc: "page need template!"
                };
            }

            // 判断是否有换行
            if (/\n/.test(defaults.temp)) {
                // 拥有换行，是模板字符串
                temp = defaults.temp;
            } else {
                if (defaults.temp === true) {
                    temp = await relativeLoad(`./${fileName}.html`)
                } else {
                    temp = await relativeLoad(`${defaults.temp}`);
                }
            }

            // 添加link
            let linkPath = defaults.link;
            if (linkPath) {
                if (defaults.link === true) {
                    linkPath = await load(`${relativeDir + fileName}.css -getPath -r`);
                } else {
                    linkPath = await load(`${relativeDir + defaults.link} -getPath -r`);
                }
                linkPath && (temp = `<link rel="stylesheet" href="${linkPath}">\n` + temp);
            }

            // 渲染元素
            renderEle(this.ele, Object.assign({
                attrs: [],
                watch: {}
            }, defaults, {
                temp
            }));

            this[PAGESTAT] = "finish";

            let nvdata;
            if (this[NAVIGATEDATA]) {
                nvdata = this[NAVIGATEDATA];
                delete this[NAVIGATEDATA];
            }

            // 运行ready
            defaults.ready && defaults.ready.call(this, {
                data: nvdata
            });
            this.emit("page-ready");
        }
    },
    ready() {
        // debugger
        // 自动进入unload状态
        this[PAGESTAT] = "unload";
    },
    detached() {
        this[PAGESTAT] = "destory";

        if (this._pageOptions) {
            this._pageOptions.destory && this._pageOptions.destory.call(this);
            this.emit("page-destory");
        }
    }
});

$.fn.extend({
    get $page() {
        let { $host } = this;
        while ($host.$host) {
            $host = $host.$host;
        }
        return $host;
    },
    get $app() {
        let { $page } = this;
        if (!$page) {
            console.warn("no app");
            return;
        }
        return $page.parents("xd-app")[0];
    }
});