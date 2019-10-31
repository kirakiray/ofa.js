const APPSTAT = Symbol("appStat");
const CURRENTS = Symbol("currentPages");

$.register({
    tag: "xd-app",
    data: {
        src: "",
        xdPageAnime: "",
        _unBubble: ["xdPageAnime"],
        // 默认page数据
        pageParam: {
            // 后退中的page的样式
            back: ["back"],
            // 激活中的页面样式
            current: "active",
            front: "front",
            // 隐藏的页面样式
            hide: "hide"
        },
        // [CURRENTS]: []
    },
    proto: {
        // 当前装填
        get stat() {
            return this[APPSTAT];
        },
        // 选中的页面
        get currentPage() {
            return this[CURRENTS].slice(-1)[0];
        },
        // 处在路由中的页面
        get currentPages() {
            return this[CURRENTS].slice();
        },
        // 跳转到
        // 跳转路由
        navigate(opts) {
            let defaults = {
                // 支持类型 to/back
                type: "to",
                // back返回的级别
                delta: 1,
                // to 跳转的类型
                url: "",
                // 跳转到相应pageid的页面
                pageid: "",
                // 相应的page元素
                target: ""
            };

            let optsType = getType(opts);

            switch (optsType) {
                case "object":
                    Object.assign(defaults, opts);
                    break;
                case "string":
                    defaults.url = opts;
                    break;
            }

            return new Promise((res, rej) => {
                switch (defaults.type) {
                    case "to":
                        // 确认没有target
                        if (!defaults.target && !defaults.id && defaults.url) {
                            let { url } = defaults;

                            // 新建page
                            let pageEle = $({
                                tag: "xd-page",
                                src: url
                            });

                            // 添加到 xd-app 内
                            this.push(pageEle);

                            // 先设置前置样式
                            // 直接设置元素 attr 比 watch attrs 更快装载
                            pageEle.attr("xd-page-anime", this.pageParam.front);

                            // 前一个页面后退
                            this.currentPage.xdPageAnime = this.pageParam.back[0];

                            // 装载当前页
                            this[CURRENTS].push(pageEle);

                            // 添加属性
                            // 直接修正属性，已经是异步操作
                            // setTimeout(() => {
                            pageEle.xdPageAnime = this.pageParam.current;
                            // }, 50);
                        }
                        break;
                    case "back":
                        debugger
                        break;
                }
            });
        }
    },
    watch: {},
    ready() {
        this[APPSTAT] = "unload";

        // 判断是否有页面，激活当前页
        $.nextTick(() => {
            let firstPage = this.que("xd-page");

            firstPage.xdPageAnime = firstPage.pageParam.current;

            // firstPage.attr("xd-page-anime", this.pageParam.current);

            // 添加首页，并激活
            this[CURRENTS] = [firstPage];
        });

    }
});

processors.set("app", async packData => {
    let defaults = {
        // 运行后触发的callback
        onLauncher() { },
        // 显示后触发
        onShow() { },
        // 隐藏后触发
        onHide() { },
        // 出错后触发
        onError() { },
        // 全局样式
        // 单行设置link类型
        globalCss: "",
        // 默认page数据
        page: {
            // 后退中的page的样式
            back: ["back"],
            // 激活中的页面样式
            current: "active",
            // 隐藏的页面样式
            hide: ""
        }
    };

    // 注册节点
    $.register(defaults);

    // 设置模块载入完成
    packData.stat = 3;
});

// 添加新类型
drill.App = (d, moduleId) => {
    base.tempM = {
        type: "app",
        d,
        moduleId
    };
}

// 添加新类型
glo.App || (glo.App = drill.App);