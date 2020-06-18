// currents路由提前载入页面的数量
let preloadLen = 1;

$.register({
    tag: "o-app",
    data: {
        // 当前页面的路由数据
        currents: [],
        // 默认page数据
        _animeParam: {
            // 后退中的page的样式
            back: ["back"],
            // 激活中的页面样式
            current: "active",
            front: "front",
        },
        // _appOptions: {},
        // 是否已经launched
        launched: false,
        // 当前app是否隐藏
        visibility: document.hidden ? "hide" : "show",
        // 是否打开路由
        router: 0,
        // 屏幕尺寸数据
        screen: {
            width: "",
            height: "",
            // 旋转角度
            angle: ""
        }

    },
    watch: {
        // 当前app的路由数据
        currents(e, currents) {
            // 单个page页面数据如下
            // let pageData = {
            //     // 路由地址
            //     src: "",
            //     // 路由传递数据（非param）
            //     data: {},
            //     // 真正的页面元素，不存在的情况下重新创建
            //     _page: {},
            //     对应页面元素的id
            //     pageId:"",
            //     // 页面切换动画数据
            //     animeParam: {}
            // };

            if (!currents.length) {
                return;
            }

            // 旧的页面
            let oldCurrents = e.old;

            // 最后一页的id
            let lastId = currents.length - 1;

            // 页面修正
            currents.forEach((pageData, index) => {
                let {
                    animeParam,
                    data,
                    src,
                    _page
                } = pageData;

                // 清除下一个状态切换
                clearTimeout(pageData._nextPageAnimeTimer);

                let pageEle = _page;
                // 判断是否有页面元素，没有的话添加页面元素
                if (!pageEle) {
                    pageData._page = pageEle = $({
                        tag: "o-page",
                        src
                    });

                    // 设置传输数据
                    pageEle[NAVIGATEDATA] = data;

                    this.push(pageEle);
                }

                // unload状态全部都准备在预加载下
                if (pageEle.pageStat === "unload" && !pageEle._preparing) {
                    // 属于缓存进来的页面，进行等待操作
                    pageEle[PAGE_STATE] = "preparing";
                    pageEle[PAGE_PREPARING] = new Promise(res => pageEle[PAGE_PREPARING_RESOLVE] = () => {
                        pageEle[PAGE_PREPARING_RESOLVE] = pageEle[PAGE_PREPARING] = null;
                        res();
                    });
                }

                // 最后一页数据缓存
                if (index >= (lastId - preloadLen) && pageEle[PAGE_PREPARING]) {
                    pageEle[PAGE_PREPARING_RESOLVE]();
                }

                // 修正pageId
                if (!pageData.pageId) {
                    pageData.pageId = pageEle.pageId;
                }

                let { current, front, back } = animeParam || pageEle.animeParam;

                if (index < lastId) {
                    // 属于前面的页面
                    // pageEle.attrs["o-page-anime"] = index + "-" + lastId;
                    pageEle.attrs["o-page-anime"] = back[lastId - 1 - index] || back.slice(-1)[0];
                    pageEle.show = false;
                } else if (lastId == index) {
                    // 当前页不存在动画样式的情况下，就是前进式的页面
                    // 当前只有首页的情况，不需要进场动画
                    if (!pageEle.attrs["o-page-anime"] && currents.length != 1) {
                        pageEle.attrs["o-page-anime"] = front;
                        pageData._nextPageAnimeTimer = setTimeout(() => {
                            pageEle.attrs["o-page-anime"] = current;
                            pageEle.show = true;
                        }, 50);
                    } else {
                        // 有动画属性下，直接修正
                        pageEle.attrs["o-page-anime"] = current;
                        pageEle.show = true;
                    }
                }
            });

            // 对currents去掉后的页面进行处理
            if (oldCurrents && oldCurrents.length) {
                // 不需要的页面
                let unneedPageData = oldCurrents.filter(e => {
                    return !currents.find(e2 => e2.pageId === e.pageId);
                });

                if (unneedPageData && unneedPageData.length) {
                    let unneedPages = this.filter(e => {
                        return !!unneedPageData.find(e2 => e2.pageId === e.pageId)
                    });

                    if (unneedPages && unneedPages.length) {
                        // 以动画回退的方式干掉页面
                        unneedPages.forEach(pageEle => {
                            let { front } = pageEle.animeParam;
                            pageEle.attrs["o-page-anime"] = front;

                            // 动画结束后删除
                            let endfun = e => {
                                pageEle.ele.removeEventListener("transitionend", endfun);
                                pageEle.remove();
                                endfun = null;
                            };
                            pageEle.ele.addEventListener("transitionend", endfun);
                            // 时间候补确保删除
                            setTimeout(() => endfun && endfun(), 1000);
                        });
                    }
                }
            }
        }
    },
    attrs: ["router"],
    proto: {
        // 页面参数，动画的数据存储对象
        get animeParam() {
            return this._animeParam;
        },
        set animeParam(val) {
            this._animeParam = val;
        },
        // 选中的页面
        get currentPage() {
            return this.currents.slice(-1)[0]._page;
        },
        // // 处在路由中的页面
        get currentPages() {
            return this.currents.map(e => e._page);
        },
        // 跳转路由
        [APPNAVIGATE](opts) {
            let defaults = {
                // 当前页面
                self: "",
                // 支持类型 to/back
                type: "to",
                // back返回的级别
                delta: 1,
                // to 跳转的类型
                src: "",
                // 跳转到相应pageid的页面
                // pageid: "",
                // 相应的page元素
                // target: "",
                // 自定义数据
                data: null,
                // 切换动画页面
                // anime: true
            };

            Object.assign(defaults, opts);

            // 防止传File类的数据   
            defaults.data && (defaults.data = JSON.parse(JSON.stringify(defaults.data)));

            // 判断self对currents的修正
            if (defaults.self) {
                // 查找是否存在currents上
                let target_id = this.currents.findIndex(e => e._page === defaults.self);
                if (target_id > -1 && target_id < this.currents.length - 1) {
                    this.currents.splice(target_id + 1);
                }
            }

            return new Promise((resolve, reject) => {
                switch (defaults.type) {
                    case "to":
                        this.currents.push({
                            src: defaults.src,
                            data: defaults.data
                        });
                        break;
                    case "replace":
                        this.currents.splice(-1, 1, {
                            src: defaults.src,
                            data: defaults.data
                        });
                        break;
                    case "back":
                        if (this.currents.length <= 1) {
                            return;
                        }
                        // 干掉相应delta的页，确保必须至少剩一页
                        if (defaults.delta >= this.currents.length) {
                            defaults.delta = this.currents.length - 1;
                        }

                        this.currents.splice(-defaults.delta);
                        break;
                }

                $.nextTick(() => this.emitHandler("navigate", Object.assign({}, defaults)));
            })
        },
        back(delta = 1) {
            this.currentPage.back(delta);
        },
        // 更新尺寸信息
        fixSize() {
            // 修正屏幕数据
            this.screen.width = screen.width;
            this.screen.height = screen.height;
            this.screen.angle = screen.orientation ? screen.orientation.angle : "";
        }
    },
    ready() {
        // 判断是否有页面，激活当前页
        $.nextTick(() => {
            let readyFun = () => {
                // this[CURRENTS] = [this.$("o-page")];
                let firstPage = this.$("o-page");

                // 设置第一页
                this.currents = [{
                    // 路由地址
                    src: firstPage.src,
                    // 路由传递数据（非param）
                    data: {},
                    // 真正的页面元素，不存在的情况下重新创建
                    _page: firstPage,
                    // 页面切换动画数据
                    animeParam: firstPage.animeParam,
                    // 页面id
                    pageId: firstPage.pageId
                }];

                // 触发事件
                this.launched = true;

                readyFun = null;
            }

            this.$("o-page") ? readyFun() : this.one("page-ready", readyFun);
        });

        // 检查页面状况
        window.addEventListener("visibilitychange", e => {
            this.visibility = document.hidden ? "hide" : "show";
        });

        // 初始路由前，app必须初始化完成
        let launchFun = (e, launched) => {
            if (!launched) {
                return;
            }
            // 注销监听
            this.unwatch("launched", launchFun);

            // 初始化路由
            initSlideRouter(this);
            initJumpRouter(this);

            launchFun = null;
        }
        this.watch("launched", launchFun);

        this.fixSize();
        // 尺寸修改的时候也设置
        let resizeTimer;
        window.addEventListener("resize", e => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.fixSize(), 500);
        });
    }
});