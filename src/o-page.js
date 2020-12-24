let opageStyle = $(`<style>o-page{display:block;}</style>`);
$("head").push(opageStyle);

const PAGE_PREPARING = Symbol("_preparing");
const PAGE_PREPARING_RESOLVE = Symbol("_preparing_resolve");

main.setProcessor("Page", async (packData, d, { relativeLoad }) => {
    let defaults = {
        // 默认模板
        temp: true,
        // 监听属性函数
        watch: {},
        // 自有属性
        data: {},
        // 页面渲染完成
        // ready() { },
        // 页面被关闭时调用
        // destory() { },
        // 下面需要搭配 o-app
        // 页面被激活时调用，搭配o-app使用
        // onShow() { },
        // 被放置后台时调用
        // onHide() { },
        // ofa app相关animeParam属性
        // animeParam: {}
    };

    await componentBuildDefault({ defaults, packData, options: d, relativeLoad });

    return async () => defaults;
});

$.register({
    tag: "o-page",
    temp: false,
    data: {
        // 当前页面的真实地址
        source: "",
        // 页面是否展示，主要是在o-app内的关键属性
        show: true,
        // 当前页面的状态
        status: ""
    },
    proto: {
        get pageId() {
            return this[PAGEID];
        },
        // 获取页面寄宿的app对象
        get app() {
            return this.parents("o-app")[0];
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
                // 修正o-page内嵌o-page找不到app的问题
                app = targetPage.app;

                if (!app) {
                    let hostEle = targetPage.$host;
                    if (hostEle && hostEle.is("o-page")) {
                        targetPage = targetPage.$host;
                    } else {
                        console.warn("this page no app =>", this);
                        return;
                    }
                } else {
                    // 让外层的Page进行跳转逻辑
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
                // 当前地址的相对目录
                let relativeDir = this.source.replace(/(.+\/).+/, "$1");

                // 去掉后面的参数
                let src = defs.src;

                let obj = main.toUrlObjs([src], relativeDir)[0];
                let path = obj.path;
                defs.src = (obj.search ? `${path}?${obj.search}` : path);
            }

            return app[APPNAVIGATE](defs);
        },
        // 页面返回
        back(delta = 1) {
            return this.navigate({ type: "back", delta });
        }
    },
    attrs: {
        // 当前页面的链接地址
        src: ""
    },
    watch: {
        async src(e, val) {
            this.attrs.oLoading = "1";

            if (!val) {
                return;
            }
            if (this.status !== "unload" && this.status !== "preparing") {
                throw {
                    target: this,
                    desc: "o-page can't reset src"
                };
            }

            // 判断是否在准备中
            if (this[PAGE_PREPARING]) {
                await this[PAGE_PREPARING];
            }

            // 加载页面模块数据
            this.status = "loading";

            // 相应资源地址
            // let sourcePath = await load(val + " -r -getLink");
            let sourcePath = await load(val + " -getLink");

            // 设置真实地址
            this.source = sourcePath;

            // 修正记录信息
            this.ele.__xInfo.scriptSrc = sourcePath;

            let pageOpts;
            try {
                // pageOpts = await load(val + " -r");
                pageOpts = await load(val);
            } catch (e) {
                // 错误页面
                let errObj = e[0].descript;
                this.status = "error";

                renderComponent(this.ele, {
                    temp: ofa.get404({
                        path: sourcePath,
                        src: val
                    }),
                    attrs: [],
                    watch: {}
                });

                this.attrs.oLoading = null;

                throw errObj;
            }

            // 页面被删除就不折腾
            if (this.status == "destory") {
                return;
            }

            // if (pageOpts.tempUrl) {
            //     this.ele.__xInfo.tempUrl = pageOpts.tempUrl
            // }

            this[PAGEOPTIONS] = pageOpts;

            // 渲染元素
            renderComponent(this.ele, Object.assign({
                attrs: [],
                watch: {}
            }, pageOpts));

            this.attrs.oLoading = null;
            this.status = "finish";

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
        this.status = "unload";
    },
    detached() {
        this.status = "destory";

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
        return $page.parents("o-app")[0];
    }
});