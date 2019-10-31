const PAGESTAT = Symbol("pageStat");

let xdpageStyle = $(`<style>xd-page{display:block;}</style>`);
$("head").push(xdpageStyle);

// 渲染页面触发函数
function xdpageAttached() {
    this._isAttache = true;

    let opts = this._opts;

    if (!opts) {
        return;
    }

    if (this[PAGESTAT] !== "finish") {
        // 渲染元素
        renderEle(this.ele, Object.assign({}, opts, {
            attrs: [],
            watch: {}
        }));

        // 设置渲染完成
        this[PAGESTAT] = "finish";
    }

    // 运行ready
    opts.ready && opts.ready.call(this);
}

// 定义新类型 xd-page
$.register({
    tag: "xd-page",
    // temp: `
    // <style>:host{display:block;}.xd-page-content{width:100%;height:100%;}</style>
    // <div class="xd-page-content" xv-tar="pageContent">xd-page-inner</div>
    // `,
    temp: false,
    attrs: ["src", "pageid", "xdPageAnime"],
    data: {
        xdPageAnime: "",
        pageid: "",
        src: "",
        _isAttache: false
    },
    proto: {
        // 获取页面状态
        get stat() {
            return this[PAGESTAT];
        },
        // 获取页面寄宿的app对象
        get app() {
            return this.parents("xd-app")[0];
        }
    },
    watch: {
        src(e, val) {
            if (this[PAGESTAT] != "unload") {
                throw {
                    target: this,
                    desc: `this page is ${this.stat}!`
                };
            }

            if (!val) {
                return;
            }

            this[PAGESTAT] = "loading";

            // 请求文件
            load(val).then(opts => {
                this[PAGESTAT] = "loaded";

                // 设置临时数据对象
                this._opts = Object.assign({}, opts);

                if (this._isAttache) {
                    xdpageAttached.call(this);
                }
            });
        }
    },
    ready() {
        // 自动进入unload状态
        this[PAGESTAT] = "unload";

        // 设置pageParam属性
        this.extend({
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
            }
        });
        // debugger
    },
    attached: xdpageAttached,
    detached() {
        // 更新状态
        this[PAGESTAT] = "destory";

        if (this.src) {
            load(this.src).then(opts => {
                opts.destory.call(this);
            });
        }
    }
});

processors.set("page", async packData => {
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
        use: []
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
        // pageParam: []
    };

    // load方法
    const load = (...args) => main.load(main.toUrlObjs(args, packData.dir));

    let options = base.tempM.d;

    if (isFunction(options)) {
        options = options(load, {
            DIR: packData.dir,
            FILE: packData.path
        });
        if (options instanceof Promise) {
            options = await options;
        }
    }

    // 合并默认参数
    Object.assign(defaults, options);

    // 获取文件名
    let fileName = packData.path.match(/.+\/(.+)/)[1];
    fileName = fileName.replace(/\.js$/, "");

    // 添加子组件
    if (defaults.use && defaults.use.length) {
        await load(...defaults.use);
    }

    // 置换temp
    let temp = "";
    if (!defaults.temp) {
        console.error("page need template!");
        return;
    }
    // 判断是否有换行
    if (/\n/.test(defaults.temp)) {
        // 拥有换行，是模板字符串
        temp = defaults.temp;
    } else {
        let path;
        if (defaults.temp === true) {
            path = await load(`./${fileName}.html -getPath`)
        } else {
            // path = defaults.temp;
            path = await load(`${defaults.temp} -getPath`);
        }
        temp = await load(path);
        // temp = await fetch(path);
        // temp = await temp.text();
    }

    // 添加link
    let linkPath = defaults.link;
    if (linkPath) {
        if (defaults.link === true) {
            linkPath = await load(`./${fileName}.css -getPath`);
        } else {
            linkPath = await load(`${defaults.link} -getPath`);
        }
        linkPath && (temp = `<link rel="stylesheet" href="${linkPath}">\n` + temp);
    }

    defaults.temp = temp;

    packData.getPack = async () => defaults;

    // 设置模块载入完成
    packData.stat = 3;
});

// 添加新类型
drill.Page = (d, moduleId) => {
    base.tempM = {
        type: "page",
        d,
        moduleId
    };
}

// 添加新类型
glo.Page || (glo.Page = drill.Page);