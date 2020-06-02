// 默认跳转型路由
// 跳转路由，跟普通页面跳转的体验一样
const initJumpRouter = (app) => {
    if (app.router != "router" && app.router != 1) {
        return;
    }

    let nowPageState;

    if (history.state) {
        nowPageState = history.state;

        // 发现历史数据，添加回软路由
        renderHistory(nowPageState.history, app);
        // app.currents.push(...nowPageState.history);
    }

    app.on("navigate", (e, opt) => {
        console.log("navigate => ", e, opt)

        let { currentPage } = app;
        let { animeParam, src } = currentPage;

        let historyObj = [];
        app.currents.object.forEach((e, i) => {
            if (i == 0) {
                return;
            }
            delete e.pageId;

            historyObj.push(e);
        });

        switch (opt.type) {
            case "to":
                nowPageState = {
                    history: historyObj
                }
                // 前进url本来就记录了state，不需要重新记录
                if (!opt._popstate_forward) {
                    history.pushState(nowPageState, "", `?__p=${encodeURIComponent(src)}`);
                }
                break;
            case "replace":
                nowPageState = {
                    history: historyObj
                }
                history.replaceState(nowPageState, "", `?__p=${encodeURIComponent(src)}`);
                break;
            case "back":
                // 不是通过popstate的返回，要重新修正history的路由
                if (!opt._popstate_back) {
                    navigateBacked = 1;
                    history.go(-opt.delta);
                }
                break;
        }

        console.log("navigate =>", opt);
    });

    // 返回动作是否已经执行完成
    let navigateBacked = 0;

    // 监听路由变动
    window.addEventListener("popstate", e => {
        // 对比 nowPageState 缺失是前进还是后退，修正app
        let beforeHistory = (nowPageState && nowPageState.history) || [];
        let nowHistory = (e.state && e.state.history) || [];

        if (beforeHistory.length > nowHistory.length) {
            if (navigateBacked) {
                // 通过app.navigate返回的路由，复原 navigateBacked
                navigateBacked = 0;
                return;
            }
            // 页面后退
            app[APPNAVIGATE]({
                type: "back",
                delta: beforeHistory.length - nowHistory.length,
                // 标识
                _popstate_back: true
            });
        } else {
            // 添加到currents队列
            let fList = nowHistory.slice(-(nowHistory.length - beforeHistory.length));
            app.currents.push(...fList);

            // 页面前进
            let nextPage = nowHistory.slice(-1)[0];

            // 修正事件
            $.nextTick(() => app.emitHandler("navigate", { type: "to", src: nextPage.src, _popstate_forward: true }));
        }

        // 修正 nowPageState
        nowPageState = e.state;
    });


    // 附带在location上的path路径
    let in_path = getQueryVariable("__p");
    if (in_path && !history.state) {
        // 当前state没有数据，但是__p参数存在，证明是外部粘贴的地址，进行地址修正
        history.replaceState(null, "", "?");
        $.nextTick(() => {
            app[APPNAVIGATE]({
                src: decodeURIComponent(in_path)
            });
        });
    }
}

// 渲染历史页面
function renderHistory(hisData, app) {
    // 渲染历史页面
    app.currents.push(...hisData);
    $.nextTick(() => {
        app.currentPages.forEach(page => page.style.transition = "none");
        setTimeout(() => app.currentPages.forEach(page => page.style.transition = ""), 100);
    });
}

// 公用路由软路由初始化逻辑
const fakeRouter = (app) => {
    const HNAME = "xd-app-history-" + location.pathname;

    // 虚拟历史路由数组
    let fakeState = sessionStorage.getItem(HNAME);
    if (fakeState) {
        fakeState = JSON.parse(fakeState)
    } else {
        fakeState = {
            // 后退历史
            history: []
        };
    }
    if (fakeState.history.length) {
        // 渲染历史页面
        // app.currents.push(...fakeState.history);
        renderHistory(fakeState.history, app);
    }

    // 监听跳转
    app.on("navigate", (e, opt) => {
        let { currentPage } = app;
        let { animeParam } = currentPage;

        switch (opt.type) {
            case "to":
                fakeState.history.push({
                    src: opt.src,
                    data: opt.data,
                    animeParam
                });
                break;
            case "replace":
                fakeState.history.splice(-1, 1, {
                    src: opt.src,
                    data: opt.data,
                    animeParam
                });
                break;
            case "back":
                fakeState.history.splice(-opt.delta);
                break;
        }

        sessionStorage.setItem(HNAME, JSON.stringify(fakeState));
    });
}