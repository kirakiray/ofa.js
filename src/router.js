// 返回路由提前载入量
let ofa_inadvance = 1;

/// 是否初始化了history
const BANDF = "xd-app-init-back-forward-" + location.pathname;

const createEmptyXdHistoryData = () => {
    return {
        // 后退历史
        history: [],
        // 前进历史
        forwards: []
    };
}

// xd-app路由器初始化
const initRouter = (app) => {
    const launchFun = (e, launched) => {
        if (!launched) {
            return;
        }
        // 注销监听
        app.unwatch("launched", launchFun);

        const HNAME = "xd-app-history-" + location.pathname;

        // 历史路由数组
        let xdHistoryData = sessionStorage.getItem(HNAME);
        if (xdHistoryData) {
            xdHistoryData = JSON.parse(xdHistoryData)
        } else {
            xdHistoryData = createEmptyXdHistoryData();
        }

        // 保存路由历史
        const saveXdHistory = () => {
            sessionStorage.setItem(HNAME, JSON.stringify(xdHistoryData));
        }

        if (app.router != 1) {
            return;
        }

        // 附带在location上的path路径
        let in_path = getQueryVariable("__p");
        if (in_path) {
            in_path = decodeURIComponent(in_path);
        }

        // 历史页面
        if (xdHistoryData.history.length) {
            // 第一页在返回状态
            app.currentPage.attrs["xd-page-anime"] = app.currentPage.animeParam.back;

            let lastId = xdHistoryData.history.length - 1;

            // 还原旧页面
            xdHistoryData.history.forEach((e, i) => {
                let xdPage = $({
                    tag: "xd-page",
                    src: e.src
                });

                let f;
                xdPage.watch("pageStat", f = (e, val) => {
                    if (val === "finish") {
                        xdPage.display = "none";
                        // 完成时，修正page状态
                        if (i == lastId) {
                            // 当前页
                            xdPage.attrs["xd-page-anime"] = xdPage.animeParam.current;
                        } else {
                            // 设置为前一个页面
                            xdPage.attrs["xd-page-anime"] = xdPage.animeParam.back[0];
                        }

                        setTimeout(() => xdPage.display = "", 36);

                        xdPage.unwatch("pageStat", f);
                    }
                }, true);

                // 添加到app中
                app.push(xdPage);

                // 加入历史列表
                app[CURRENTS].push(xdPage);
            });
        }

        // 判断是否当前页，不是当前页就是重新进入的，在加载
        if (in_path) {
            // 定向到指定页面
            let src = in_path;

            if (app.currentPage.src !== src) {
                app.currentPage.watch("pageStat", (e, pageStat) => {
                    if (pageStat == "finish") {
                        setTimeout(() => {
                            app.currentPage.navigate({
                                src
                            });
                        }, 36);
                    }
                })
            }

            sessionStorage.setItem(BANDF, "");
        }

        // 监听跳转
        app.on("navigate", (e, opt) => {
            let { currentPage } = app;

            switch (opt.type) {
                case "to":
                    xdHistoryData.history.push({
                        src: opt.src
                    });
                    // 不是通过前进来的话，就清空前进历史
                    !opt.forward && (xdHistoryData.forwards.length = 0);
                    saveXdHistory();
                    fixCurrentPagePath();
                    break;
                case "replace":
                    xdHistoryData.history.splice(-1, {
                        src: currentPage.src
                    });
                    saveXdHistory();
                    fixCurrentPagePath();
                    break;
                case "back":
                    let his = xdHistoryData.history.splice(-opt.delta, opt.delta);
                    xdHistoryData.forwards.push(...his);
                    saveXdHistory();
                    break;
            }
        });

        // ---前进后退功能监听封装---

        if (!sessionStorage.getItem(BANDF)) {
            $('body').one("mousedown", e => {
                // 提前获取__p参数
                let old_p = getQueryVariable("__p");

                // 初次替换后退路由
                history.pushState({
                    __t: "back"
                }, "back", "?back=1");

                // 进一步正确路由
                history.pushState({
                    __t: "current"
                }, "current", "?" + old_p);

                // 增加一个前进路由
                // history.pushState({
                //     __t: "forward"
                // }, "forward", "?forward=1");

                // history.back();
            });

            sessionStorage.setItem(BANDF, 1)
        }

        // 修正当前页面的path
        const fixCurrentPagePath = () => {
            history.replaceState({
                __t: "current"
            }, "current", `?__p=${encodeURIComponent(app.currentPage.src)}`);
        }

        // 初次修正
        fixCurrentPagePath();

        // 延后初始化路由监听
        // 开始监听路由
        window.addEventListener("popstate", e => {
            let { state } = e;

            let validOpts = {
                valid: true
            };

            switch (state.__t) {
                case "back":
                    // 还原路由
                    history.forward();
                    app.emitHandler("before-back", validOpts);
                    if (validOpts.valid) {
                        app.back();
                    }
                    break;
                case "current":
                    fixCurrentPagePath();
                    break;
                // case "forward":
                //     // 还原路由
                //     history.back();
                //     app.emitHandler("before-forward", validOpts);
                //     if (validOpts.valid) {
                //         let last = xdHistoryData.forwards.splice(-1)[0];

                //         // 前进路由
                //         last && app.currentPage.navigate({
                //             src: last.src,
                //             forward: true
                //         });
                //     }
                //     break;
            }
        });
    }
    app.watch("launched", launchFun);
}