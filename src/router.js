// 返回路由提前载入量
let ofa_inadvance = 1;

// xd-app路由器初始化
const initRouter = (app) => {
    const launchFun = (e, launched) => {
        if (!launched) {
            return;
        }
        // 注销监听
        app.unwatch("launched", launchFun);

        // 历史路由数组
        let xdHistoryData = sessionStorage.getItem("xd-app-history");
        if (xdHistoryData) {
            xdHistoryData = JSON.parse(xdHistoryData)
        } else {
            xdHistoryData = {
                history: []
            };
        }

        // 保存路由历史
        const saveXdHistory = () => {
            sessionStorage.setItem("xd-app-history", JSON.stringify(xdHistoryData));
        }

        if (app.router != 1) {
            return;
        }

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

                        $.nextTick(() => xdPage.display = "");

                        xdPage.unwatch("pageStat", f);
                    }
                }, true);

                // 添加到app中
                app.push(xdPage);

                // 加入历史列表
                app[CURRENTS].push(xdPage);
            });
        }

        // 监听跳转
        app.on("navigate", (e, opt) => {
            let defs = {
                xdapp: 1,
                src: opt.src,
            };
            let { currentPage } = app;

            switch (opt.type) {
                case "to":
                    xdHistoryData.history.push({
                        src: defs.src
                    });
                    saveXdHistory();
                    break;
                case "replace":
                    history.replaceState(defs, opt.src, `?__page=${encodeURIComponent(opt.src)}`);
                    xdHistory.splice(-1, {
                        src: currentPage.src
                    });
                    saveXdHistory();
                    break;
                case "back":
                    xdHistoryData.history.splice(-opt.delta, opt.delta);
                    saveXdHistory();
                    break;
            }
        });

        // ---前进后退功能监听封装---
        const BANDF = "xd-app-init-back-forward";

        if (!sessionStorage.getItem(BANDF)) {
            // 获取当前真实路径
            let m_arr = location.href.match(/.+\/(.+)/);
            let current_path;
            if (m_arr.length == 2) {
                current_path = m_arr[1];
            } else {
                throw {
                    desc: "path error",
                    href: location.href
                };
            }

            $('body').one("mousedown", e => {
                // 初次替换后退路由
                history.pushState({
                    __t: "back"
                }, "back", "?back=1");

                // 进一步正确路由
                history.pushState({
                    __t: "current"
                }, "current", "?current=1");

                // 增加一个前进路由
                history.pushState({
                    __t: "forward"
                }, "forward", "?forward=1");

                history.back();
            });

            sessionStorage.setItem(BANDF, 1)
        }

        // 返回页面
        const backPage = () => {
            app.currentPage.back();
        }

        // 延后初始化路由监听
        // 开始监听路由
        window.addEventListener("popstate", e => {
            let { state } = e;

            let validOpts = {
                valid: true
            };

            switch (state.__t) {
                case "back":
                    console.log("返回页");
                    // 还原路由
                    history.forward();
                    app.emitHandler("back", validOpts);
                    if (validOpts.valid) {
                        backPage();
                    }
                    break;
                case "current":
                    console.log("当前页");
                    break;
                case "forward":
                    console.log("前进ye");
                    // 还原路由
                    history.back();
                    app.emitHandler("forward", validOpts);
                    break;
            }
        });
    }
    app.watch("launched", launchFun);
}