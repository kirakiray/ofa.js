const ROUTERPAGE = Symbol("router_page");

// 所有的app元素
const apps = [];

// 等待器等待加载的个数
let waitCount = 2;

register({
    tag: "o-app",
    temp: `<style>:host{display:block}::slotted(o-page){position:absolute;left:0;top:0;width:100%;height:100%}::slotted(o-page[page-area]){transform:translate(0,0);transition:all ease-in-out .25s;z-index:2}::slotted(o-page[page-area=back]){transform:translate(-30%,0);opacity:0;z-index:1}::slotted(o-page[page-area=next]){transform:translate(30%,0);opacity:0;z-index:1}.container{display:flex;flex-direction:column;width:100%;height:100%}.main{position:relative;flex:1}.article{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}</style><style id="initStyle">::slotted(o-page[page-area]){transition:none}</style><div class="container"><div><slot name="header"></slot></div><div class="main"><div class="article" part="body"><slot></slot></div></div></div>`,
    attrs: {
        // 首页地址
        home: "",
        // 引用资源地址
        src: "",
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
            height: "",
        },
        // 当前app是否隐藏
        visibility: document.hidden ? "hide" : "show",
    },
    watch: {
        async src(src) {
            if (!src || this._loaded_src) {
                return;
            }
            this._loaded_src = 1;

            // 加载相应模块并执行
            let m = await load(src);

            m.data && Object.assign(this, m.data);

            if (m.proto) {
                // 扩展选项
                this.extend(m.proto);
            }

            if (m.ready) {
                m.ready.call(this);
            }

            if (this.home && !this.router.length) {
                // 当存在home，又没有其他页面在路由时，添加home
                this.router.push({
                    path: this.home,
                });
            }
        },
        home(src) {
            if (!this.src && src && !this.router.length) {
                this.router.push({
                    path: src,
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
            const needRemove = backRouter.filter((e) => !router.includes(e));

            // 等待新增的页面
            const needAdd = [];

            // 对比路由差异进行筛选
            let lastIndex = router.length - 1;
            const newRouter = router.map((e, index) => {
                // 修正数据
                if (typeof e == "string") {
                    e = createXData({
                        path: e,
                    });

                    e.owner.add(router[XDATASELF]);
                }

                // 没有新建成功的
                if (!e._page) {
                    // 增加页面元素
                    let page = (e._page = $({
                        tag: "o-page",
                        src: e.path,
                    }));

                    // 添加loading
                    if (glo.ofa && ofa.onState.loading) {
                        page.push(
                            ofa.onState.loading({
                                src: e.path,
                            })
                        );
                    }

                    let w_resolve;
                    // 添加等待器
                    page._waiting = new Promise((res) => (w_resolve = res));
                    page.__waiter_resolve = w_resolve;
                }

                if (e.state && e._page.state === undefined) {
                    let state = e.state;
                    extend(e._page, {
                        get state() {
                            return state;
                        },
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
                            // 如果被改动过，就不用再修改
                            if (e._page.attr("page-area") === "next") {
                                e._page.attr("page-area", "");
                            }
                        }, 10);
                    } else {
                        e._page.attr("page-area", "");
                    }
                }

                // 修正等待器的加载
                if (index + waitCount > lastIndex && e._page.__waiter_resolve) {
                    e._page.__waiter_resolve();
                    delete e._page.__waiter_resolve;
                }

                return e;
            });

            // 添加页面
            needAdd.forEach((e) => {
                this.push(e._page);
            });

            // 删除页面
            needRemove.forEach((e) => {
                e._page.attr("page-area", "next");
                if (parseFloat(e._page.css.transitionDuration) > 0) {
                    // 保底删除
                    let timer = setTimeout(() => e._page.remove(), 500);
                    // 有动画的情况下，进行动画结束后操作
                    e._page.one("transitionend", () => {
                        e._page.remove();
                        clearTimeout(timer);
                    });
                } else {
                    // 没有动画直接删除
                    e._page.remove();
                }
            });

            // 修正路由数据
            router[XDATASELF].splice(0, 1000, ...newRouter);

            // 备份
            this._backup_router = router.slice();

            // 触发当前页的激活事件
            router.slice(-1)[0]._page.trigger("activepage");
        },
    },
    proto: {
        get currentPage() {
            return this.router.slice(-1)[0]._page;
        },
        // 返回页面
        back() {
            // 是否接受返回行为
            const event = new Event("back", {
                cancelable: true,
            });
            event.delta = 1;
            this.triggerHandler(event);

            if (event.returnValue) {
                // 拦截返回的路由
                if (this.router.length > 1) {
                    this.router.splice(-1, 1);
                }
            }
        },
        // 全局app都可用的数据
        get globalData() {
            return globalAppData;
        },
        postback(data) {
            let target;
            if (top !== window) {
                target = top;
            } else if (opener) {
                target = opener;
            } else {
                console.warn("can't use postback");
                return false;
            }

            target.postMessage(
                {
                    type: "web-app-postback-data",
                    data,
                },
                "*"
            );

            return true;
        },
        // 用于不想暴露真实地址或保证地址唯一性
        // get shareHash() {
        //     return encodeURIComponent(this.currentPage.src);
        // }
        // set shareHash() {
        //     return encodeURIComponent(this.currentPage.src);
        // }
    },
    ready() {
        // 检查页面状况
        window.addEventListener("visibilitychange", (e) => {
            this.visibility = document.hidden ? "hide" : "show";
        });

        // 开始的一段时间，不需要动画
        setTimeout(() => {
            this.shadow.$("#initStyle").remove();
        }, 150);
    },
    attached() {
        apps.push(this);
    },
    detached() {
        let id = apps.indexOf(this);
        if (id > -1) {
            apps.splice(id, 1);
        }
    },
});
