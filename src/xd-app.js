$.register({
    tag: "xd-app",
    data: {
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
        router: 0
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
            return this[CURRENTS].slice(-1)[0];
        },
        // 处在路由中的页面
        get currentPages() {
            return this[CURRENTS].slice();
        },
        // 跳转路由
        // 外部请使用page上的navigate传参
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
                pageid: "",
                // 相应的page元素
                target: "",
                // 自定义数据
                data: null,
                // 切换动画页面
                anime: true,
                // 触发 navigate 事件
                emitNavigate: true
            };

            Object.assign(defaults, opts);

            // 防止传File类的数据   
            defaults.data && (defaults.data = JSON.parse(JSON.stringify(defaults.data)));

            return new Promise(async (res, rej) => {
                switch (defaults.type) {
                    case "back":
                        // 返回页面操作
                        let prevPage,
                            currentPages = this[CURRENTS],
                            len = currentPages.length;

                        let { currentPage } = this;

                        let { delta } = defaults;

                        // 修正delta，保证不超过最后一页
                        if (len == 2) {
                            delta = 1;
                        }

                        // 前一页
                        if (len >= 2) {
                            prevPage = currentPages[len - (delta + 1)];

                            let { current } = prevPage.animeParam;
                            let { front } = currentPage.animeParam;

                            // 修正样式
                            prevPage.attrs["xd-page-anime"] = current;
                            currentPage.attrs["xd-page-anime"] = front;

                            if (!defaults.anime) {
                                currentPage.style.transition = prevPage.style.transition = "none";
                                $.nextTick(() => currentPage.style.transition = prevPage.style.transition = "");
                            }

                            // 去掉前一页
                            let needRemovePages = currentPages.splice(len - delta, delta);
                            setTimeout(() => {
                                needRemovePages.forEach(page => page.remove());
                                res();
                            }, 300);
                        } else {
                            return;
                        }
                        break;
                    case "replace":
                    case "to":
                    default:
                        // 判断是否已经存在当前self
                        let selfIndex = this[CURRENTS].indexOf(defaults.self);
                        let finnalDetal = this[CURRENTS].length - selfIndex - 1;
                        if (defaults.self && finnalDetal > 0) {
                            await this[APPNAVIGATE]({
                                type: "back",
                                delta: finnalDetal
                            });
                        }

                        // 确认没有target
                        if (!defaults.target && !defaults.id && defaults.src) {
                            let { src } = defaults;

                            // 新建page
                            let pageEle = defaults.target = $({
                                tag: "xd-page",
                                src
                            });

                            pageEle[NAVIGATEDATA] = defaults.data;

                            // 添加到 xd-app 内
                            this.push(pageEle);

                            // 设置前置样式
                            let { front, current } = pageEle.animeParam;
                            pageEle.attrs["xd-page-anime"] = front;

                            // 后装载
                            // safari需要一点延迟
                            let setPageAnimeAttr = () => { pageEle.attrs["xd-page-anime"] = current; setPageAnimeAttr = null; }
                            defaults.anime ? setTimeout(setPageAnimeAttr, 34) : setPageAnimeAttr();


                            // 旧页面后退
                            let beforePage = this.currentPage;
                            let { back } = beforePage.animeParam;
                            beforePage.attrs["xd-page-anime"] = back[0];
                            if (!defaults.anime) {
                                beforePage.style.transition = "none";
                                $.nextTick(() => beforePage.style.transition = "");
                            }

                            // 装载当前页
                            this[CURRENTS].push(pageEle);

                            // 执行完成callback
                            let replaceFun = () => {
                                if (defaults.type == "replace") {
                                    // 替换了前一页，要删掉前一页数据
                                    let beforePage = this[CURRENTS].splice(this[CURRENTS].length - 2, 1);
                                    beforePage[0].remove();
                                }
                                res();
                                replaceFun = null;
                            }
                            defaults.anime ? setTimeout(replaceFun, 300) : replaceFun();
                        }
                        break;
                }

                // 出发navigate事件
                defaults.emitNavigate && this.emitHandler("navigate", Object.assign({}, defaults));
            });
        },
        back(delta = 1) {
            this.currentPage.back(delta);
        }
    },
    watch: {},
    ready() {
        // 判断是否有页面，激活当前页
        $.nextTick(() => {
            let readyFun = () => {
                this[CURRENTS] = [this.$("xd-page")];

                // 触发事件
                this.launched = true;

                readyFun = null;
            }

            this.$("xd-page") ? readyFun() : this.one("page-ready", readyFun);
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
    }
});