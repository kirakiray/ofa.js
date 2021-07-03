const ROUTERPAGE = Symbol("router_page");

// 初始化路由对象
const initRouterObj = (obj) => {
    // 增加页面元素
    obj._page = $({
        tag: "o-page",
        src: obj.path,
    });

    // 隐式数据传递
    // obj.state = {}
}

register({
    tag: "o-app",
    temp:
        `
<style>
    :host{
        display: block;
    }

    ::slotted(o-page){
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    ::slotted(o-page[page-area]){
        transition: all ease-in-out .25s;
        z-index: 2;
    }

    ::slotted(o-page[page-area="back"]){
        transform: translate(-30px, 0);
        opacity: 0;
        z-index: 1;
    }

    ::slotted(o-page[page-area="next"]){
        transform: translate(30px, 0);
        opacity: 0;
        z-index: 1;
    }

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .main {
        position: relative;
        flex: 1;
    }
</style>
<div class="container">
    <div>
        <slot name="header"></slot>
    </div>
    <div class="main">
        <slot></slot>
    </div>
</div>
`,
    attrs: {
        // 首页地址
        home: "",
    },
    data: {
        // 路由
        router: [],
        // router: [{
        //     path: "",
        //     _page:""
        // }]
        // 元素的尺寸信息
        rect: {
            width: "",
            height: ""
        },
        // 当前app是否隐藏
        visibility: document.hidden ? "hide" : "show",
    },
    watch: {
        home(src) {
            if (src) {
                this.router.push({
                    path: src
                });
            }
        },
        router(router) {
            if (!router.length) {
                return;
            }

            // 根据router的值进行修正页面路由
            let backRouter = this._backup_router;
            if (!backRouter) {
                // 首次存储
                backRouter = this._backup_router = [];
            }

            // 等待删除的页面
            const needRemove = backRouter.filter(e => !router.includes(e));

            // 等待新增的页面
            const needAdd = [];

            // 对比路由差异进行筛选
            let lastIndex = router.length - 1;
            const newRouter = router.map((e, index) => {
                // 修正数据
                if (typeof e == "string") {
                    e = createXData({
                        path: e
                    });

                    e.owner.add(router[XDATASELF]);
                }

                if (!e._page) {
                    // 没有新建成功的
                    initRouterObj(e);
                }

                if (e.state && e._page.state === undefined) {
                    let state = e.state;
                    extend(e._page, {
                        get state() {
                            return state;
                        }
                    });
                }

                if (!backRouter.includes(e)) {
                    needAdd.push(e);
                }

                // 修正page-area
                if (index < lastIndex) {
                    // 页面隐藏
                    e._page.attr("page-area", "back");
                } else if (index == lastIndex) {
                    // 当前页
                    if (e._page.attr("page-area") === null) {
                        e._page.attr("page-area", "next");
                        // firefox会无效
                        // requestAnimationFrame(() => {
                        //     e._page.attr("page-area", "");
                        // });
                        setTimeout(() => {
                            e._page.attr("page-area", "");
                        }, 10);
                    } else {
                        e._page.attr("page-area", "");
                    }
                }

                return e;
            });

            // 添加页面
            needAdd.forEach(e => {
                this.push(e._page);
            });

            // 删除页面
            needRemove.forEach(e => {
                e._page.attr("page-area", "next");
                e._page.one("transitionend", () => {
                    e._page.remove();
                    clearTimeout(timer);
                });
                // 保底删除
                let timer = setTimeout(() => e._page.remove(), 500);
            });

            // 修正路由数据
            router[XDATASELF].splice(0, 1000, ...newRouter);

            // 备份
            this._backup_router = router.slice();

            // 触发当前页的激活事件
            router.slice(-1)[0]._page.trigger("activepage");
        }
    },
    ready() {
        // 检查页面状况
        window.addEventListener("visibilitychange", e => {
            this.visibility = document.hidden ? "hide" : "show";
        });

        // 元素尺寸修正
        const fixSize = () => {
            // 修正尺寸数据
            this.rect.width = this.ele.clientWidth;
            this.rect.height = this.ele.clientHeight;
        }
        fixSize();
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(entries => {
                fixSize();
            });
            resizeObserver.observe(this.ele);
        } else {
            let resizeTimer;
            window.addEventListener("resize", e => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => fixSize(), 300);
            });
        }
    }
});