let xdpageStyle = $(`<style>xd-page{display:block;}</style>`);
$("head").push(xdpageStyle);

const PAGE_PREPARING = Symbol("_preparing");
const PAGE_PREPARING_RESOLVE = Symbol("_preparing_resolve");
const PAGE_STATE = Symbol("page_state");

main.setProcessor("Page", async (packData, d, { relativeLoad }) => {
    let defaults = {
        // 默认模板
        temp: true,
        // 加载组件样式
        css: false,
        // 监听属性函数
        watch: {},
        // 自有属性
        data: {},
        // 页面渲染完成
        // ready() { },
        // 页面被关闭时调用
        // destory() { },
        // 下面需要搭配 xd-app
        // 页面被激活时调用，搭配xd-app使用
        // onShow() { },
        // 被放置后台时调用
        // onHide() { },
        // xdapp相关animeParam属性
        // animeParam: {}
    };

    await componentBuildDefault({ defaults, packData, options: d, relativeLoad });

    return async () => defaults;
});

$.register({
    tag: "xd-page",
    temp: false,
    proto: {
        get pageStat() {
            return this[PAGE_STATE];
        },
        get pageId() {
            return this[PAGEID];
        },

        // 获取页面寄宿的app对象
        get app() {
            return this.parents("xd-app")[0];
        },
        set animeParam(param) {
            this._animeParam = param;
        },
        get animeParam() {
            let animeParam = this._animeParam;

            if (!animeParam) {
                let { app } = this;

                if (app) {
                    animeParam = app.animeParam;
                }
            }

            return animeParam;
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
            let targetPage = this;

            let app;

            do {
                app = targetPage.app;

                if (!app) {
                    let hostEle = targetPage.$host;
                    if (hostEle && hostEle.is("xd-page")) {
                        targetPage = targetPage.$host;
                    } else {
                        console.warn("this page no app =>", this);
                        return;
                    }
                } else {
                    if (targetPage.ele !== this.ele) {
                        targetPage.navigate(opts);
                        return;
                    }
                    break;
                }

            } while (targetPage)

            let defs = {
                src: ""
            };

            switch (getType(opts)) {
                case "object":
                    Object.assign(defs, opts);
                    break;
                case "string":
                    defs.src = opts;
                    break;
            }
            defs.self = this;

            if (defs.type !== "back") {
                let relativeSrc = this.src;

                if (relativeSrc) {
                    // 去掉后面的参数
                    let urlStrArr = /(.+\/)(.+)/.exec(relativeSrc);
                    let src = defs.src;

                    if (urlStrArr) {
                        let obj = main.toUrlObjs([src], urlStrArr[1]);
                        obj && (obj = obj[0]);
                        src = obj.ori;
                        obj.search && (src += ".js?" + obj.search);
                    }
                    defs.src = src;
                }
            }

            return app[APPNAVIGATE](defs);
        },
        // 页面返回
        back(delta = 1) {
            return this.navigate({ type: "back", delta });
        }
    },
    data: {
        // 当前页面的链接地址
        src: "",
        // 当前页面的状态
        // pageStat: "unload",
        // [PAGELOADED]: "",
        // 页面是否展示，主要是在xd-app内的关键属性
        show: true
    },
    attrs: ["src"],
    watch: {
        async src(e, val) {
            if (!val) {
                return;
            }
            if (this.pageStat !== "unload" && this.pageStat !== "preparing") {
                throw {
                    target: this,
                    desc: "xd-page can't reset src"
                };
            }

            // 判断是否在准备中
            if (this[PAGE_PREPARING]) {
                await this[PAGE_PREPARING];
            }

            // 加载页面模块数据
            this[PAGE_STATE] = "loading";

            let pageOpts;
            try {
                pageOpts = await load(val + " -r");
            } catch (e) {
                // 错误页面
                let errObj = e[0].descript;
                this[PAGE_STATE] = "error";

                let errorPath = await load(val + " -r -getLink");

                renderEle(this.ele, {
                    temp: ofa.get404({
                        path: errorPath,
                        src: val
                    }),
                    attrs: [],
                    watch: {}
                });

                throw errObj;
            }

            this[PAGEOPTIONS] = pageOpts;

            // 渲染元素
            renderEle(this.ele, Object.assign({
                attrs: [],
                watch: {}
            }, pageOpts));

            this[PAGE_STATE] = "finish";

            let nvdata;
            if (this[NAVIGATEDATA]) {
                nvdata = this[NAVIGATEDATA];
                delete this[NAVIGATEDATA];
            }

            // 运行ready
            pageOpts.ready && pageOpts.ready.call(this, {
                data: nvdata
            });
            this.emit("page-ready");

            this.watch("show", (e, show) => {
                if (show) {
                    pageOpts.onShow && pageOpts.onShow.call(this);
                } else {
                    pageOpts.onHide && pageOpts.onHide.call(this);
                }
            }, true)
        }
    },
    ready() {
        // 添加pageId
        this[PAGEID] = getRandomId();
        this[PAGE_STATE] = "unload";
    },
    detached() {
        this[PAGE_STATE] = "destory";

        if (this[PAGEOPTIONS]) {
            this[PAGEOPTIONS].destory && this[PAGEOPTIONS].destory.call(this);
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