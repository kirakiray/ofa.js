const APPSTAT = Symbol("appStat");
const CURRENTS = Symbol("currentPages");

// 内置页面样式动画数据对象
const pageAnimes = new Map([
    ["back", {
        transform: {
            translateX: "-100%"
        },
        transition: "all ease .3s"
    }],
    ["front", {
        transform: {
            translateX: "100%"
        },
        transition: "all ease .3s"
    }],
    ["active", {
        opacity: 1,
        transform: {
            translateX: "0"
        },
        transition: "all ease .3s"
    }]
]);

// 将动画数据对象转换为css样式
const animeToStyle = (animeObj) => {
    if (getType(animeObj) == "string") {
        animeObj = pageAnimes.get(animeObj);
    }

    let styleObj = Object.assign({}, animeObj);

    let { transform } = styleObj;
    if (transform) {
        let transformStr = "";
        Object.keys(transform).forEach(k => {
            transformStr += `${k}(${transform[k]}) `;
            transformStr = transformStr.slice(0, -1)
        });
        styleObj.transform = transformStr;
    }

    let str = "";

    Object.keys(styleObj).forEach(name => {
        str += `${name}:${styleObj[name]};`;
    });

    return str;
}

$.register({
    tag: "xd-app",
    data: {
        src: "",
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

                            // 设置前置样式
                            let { front, current } = pageEle.pageParam;
                            pageEle.style = animeToStyle(front);


                            // 后装载
                            $.nextTick(() => {
                                pageEle.style = animeToStyle(current);
                            });

                            // 旧页面后退
                            let beforePage = this.currentPage;
                            let { back } = beforePage.pageParam;
                            beforePage.style = animeToStyle(back[0]);

                            // 装载当前页
                            this[CURRENTS].push(pageEle);
                        }
                        break;
                    case "back":
                        // 返回页面操作
                        let prevPage,
                            currentPages = this[CURRENTS],
                            len = currentPages.length;

                        let { currentPage } = this;

                        // 前一页
                        if (len >= 2) {
                            prevPage = currentPages[len - 2];

                            let { current } = prevPage.pageParam;
                            let { front } = currentPage.pageParam;

                            // 修正样式
                            prevPage.style = animeToStyle(current);
                            currentPage.style = animeToStyle(front);

                            // 去掉前一页
                            currentPages.splice(len - 1, 1);

                            // 时间到后删除之前的页面
                            setTimeout(() => {
                                currentPage.remove();
                            }, 300);
                        }
                        break;
                }
            });
        },
        back() {
            this.navigate({
                type: "back"
            });
        }
    },
    watch: {},
    ready() {
        this[APPSTAT] = "unload";

        // 判断是否有页面，激活当前页
        $.nextTick(() => {
            let firstPage = this.que("xd-page");

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
        // page: {
        //     // 后退中的page的样式
        //     back: ["back"],
        //     // 激活中的页面样式
        //     current: "active",
        //     // 隐藏的页面样式
        //     hide: ""
        // }
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