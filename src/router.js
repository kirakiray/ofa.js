// 返回路由提前载入量
let ofa_inadvance = 1;

/// 是否初始化了history
const BANDF = "xd-app-init-back-forward-" + location.pathname;


// 修正当前页面的path
const fixCurrentPagePath = (app) => {
    history.replaceState({
        __t: "current"
    }, "current", `?__p=${encodeURIComponent(app.currentPage.src)}`);
}

// 渲染历史列表数据
const renderHistory = ({ historyArr = [], app }) => {
    // 历史页面
    if (historyArr.length) {
        // 第一页在返回状态
        app.currentPage.attrs["xd-page-anime"] = app.currentPage.animeParam.back;

        // 首页也要暂时不显示，不然会出现一闪的情况
        let indexPage = app.currentPage;
        indexPage.display = "none";
        $.nextTick(() => indexPage.display = "");

        let lastId = historyArr.length - 1;

        // 还原旧页面
        historyArr.forEach((e, i) => {
            let xdPage = $({
                tag: "xd-page",
                src: e.src
            });

            if (e.data) {
                xdPage[NAVIGATEDATA] = e.data;
            }

            xdPage.display = "none";
            // 完成时，修正page状态
            if (i == lastId) {
                // 当前页
                xdPage.attrs["xd-page-anime"] = e.animeParam.current;
            } else {
                // 设置为前一个页面
                xdPage.attrs["xd-page-anime"] = e.animeParam.back[0];
            }

            // 加载页前的页面，都进入缓存状态（当前页和前一页要立刻加载）
            if (historyArr.length - ofa_inadvance - 1 > i) {
                xdPage.pageStat = "preparing";
                xdPage._preparing = new Promise(res => xdPage._preparing_resolve = () => {
                    xdPage._preparing_resolve = xdPage._preparing = null;
                    res();
                });
            }

            setTimeout(() => xdPage.display = "", 72);

            // 添加到app中
            app.push(xdPage);

            // 加入历史列表
            app[CURRENTS].push(xdPage);
        });
    }
}

// 公用路由逻辑初始化
const commonRouter = (app, opts = {
    fixCurrent: true
}) => {
    const { fixCurrent } = opts;

    const HNAME = "xd-app-history-" + location.pathname;

    // 历史路由数组
    let xdHistoryData = sessionStorage.getItem(HNAME);
    if (xdHistoryData) {
        xdHistoryData = JSON.parse(xdHistoryData)
    } else {
        xdHistoryData = {
            // 后退历史
            history: [],
            // 前进历史
            forwards: []
        };
    }

    // 保存路由历史
    const saveXdHistory = () => {
        sessionStorage.setItem(HNAME, JSON.stringify(xdHistoryData));
    }
    // 附带在location上的path路径
    let in_path = getQueryVariable("__p");
    if (in_path) {
        in_path = decodeURIComponent(in_path);
    }

    // 历史页面
    renderHistory({
        app,
        historyArr: xdHistoryData.history
    });

    // 判断是否当前页，不是当前页就是重新进入的，在加载
    if (fixCurrent && in_path) {
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
        let { animeParam } = currentPage;

        switch (opt.type) {
            case "to":
                xdHistoryData.history.push({
                    src: opt.src,
                    data: opt.data,
                    animeParam
                });
                // 不是通过前进来的话，就清空前进历史
                !opt.forward && (xdHistoryData.forwards.length = 0);
                saveXdHistory();
                fixCurrent && fixCurrentPagePath(app);
                break;
            case "replace":
                xdHistoryData.history.splice(-1, 1, {
                    src: opt.src,
                    data: opt.data,
                    animeParam
                });
                saveXdHistory();
                fixCurrent && fixCurrentPagePath(app);
                break;
            case "back":
                console.log("back 1");
                let his = xdHistoryData.history.splice(-opt.delta, opt.delta);
                xdHistoryData.forwards.push(...his);
                saveXdHistory();
                // $.nextTick(() => fixCurrentPagePath(app));
                fixCurrent && setTimeout(() => fixCurrentPagePath(app), 100);

                // 纠正缓存状态
                app.currentPages.slice(-1 - ofa_inadvance).forEach(page => page._preparing_resolve && page._preparing_resolve());
                break;
        }
    });

    // 初次修正
    fixCurrent && fixCurrentPagePath(app);
}