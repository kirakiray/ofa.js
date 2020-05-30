// 获取历史队列
const getHistory = (obj) => {
    let arr = [];
    let target = obj;
    while (target) {
        arr.unshift({
            animeParam: target.animeParam,
            src: target.src,
            data: target.data
        });
        target = target.prev;
    }
    return arr;
}

// 跳转路由，跟普通页面跳转的体验一样
const initJumpRouter = (app) => {
    if (app.router != "router" && app.router != 1) {
        return;
    }

    // 默认记录中的当前页数据
    // let nowPageState = {
    //     // 动画数据
    //     animeParam: {},
    //     // 链接地址
    //     src: "",
    //     // 传递的data数据
    //     data: null,
    //     // 前一页数据
    //     prev: null
    // }
    let nowPageState;

    if (history.state) {
        nowPageState = history.state;

        // 重新补充回元素
        renderHistory({
            historyArr: getHistory(nowPageState),
            app
        });
    }

    // 是否navigate的返回
    let isNavigateBack = false;

    // 监听app变动
    app.on("navigate", (e, opt) => {
        console.log("navigate => ", e, opt)

        // 这个时候已经切换成功了
        let { currentPage } = app;
        let { animeParam } = currentPage;

        // 添加路由
        // 修正当前数据
        let src = currentPage.src;

        switch (opt.type) {
            case "to":
                // 更新当前页数据
                nowPageState = {
                    animeParam,
                    src,
                    data: opt.data,
                    prev: history.state
                }

                if (!opt._popstate_forward) {
                    history.pushState(nowPageState, "", "?__p=" + encodeURIComponent(src));
                } else {
                    let list = opt._popstate_forward_list;
                    if (list.length > 1) {
                        // 补充相应页面数据
                        let afterList = list.slice(0, -1);
                        afterList.forEach((e, i) => {
                            let xdPage = $({
                                tag: "xd-page",
                                src: e.src
                            });

                            if (e.data) {
                                xdPage[NAVIGATEDATA] = e.data;
                            }
                            xdPage.display = "none";
                            xdPage.attrs["xd-page-anime"] = e.animeParam.back[0];

                            // 加载页前的页面，都进入缓存状态（当前页和前一页要立刻加载）
                            if (afterList.length - ofa_inadvance > i) {
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
                            app[CURRENTS].splice(-1, 0, xdPage);
                        });
                    }
                }
                break;
            case "back":
                // 当返回是调用xd-page back时，修正原生history上的路由
                if (!opt._popstate_back) {
                    isNavigateBack = true;

                    history.go(-opt.delta);
                }

                // 纠正缓存状态
                app.currentPages.slice(-1 - ofa_inadvance).forEach(page => page._preparing_resolve && page._preparing_resolve());
                break;
            case "replace":
                // 更新当前页数据
                nowPageState = {
                    animeParam,
                    src,
                    data: opt.data,
                    prev: nowPageState.prev
                }
                history.replaceState(nowPageState, "", "?__p=" + encodeURIComponent(src));
                break;
        }
    });

    // 监听路由改动，修正路由信息
    window.addEventListener("popstate", e => {
        // 对比 nowPageState 缺失是前进还是后退，修正app
        let before_list = getHistory(nowPageState);
        let now_list = getHistory(history.state);

        if (before_list.length > now_list.length) {
            if (isNavigateBack) {
                isNavigateBack = false;
            } else {
                // 后退页面
                app[APPNAVIGATE]({
                    type: "back",
                    delta: before_list.length - now_list.length,
                    // 标识
                    _popstate_back: true
                });
            }
        } else {
            // 前进页面
            let nextPage = now_list.slice(-1)[0];
            app[APPNAVIGATE](Object.assign({
                // 标识
                _popstate_forward: true,
                _popstate_forward_list: now_list.slice(-(now_list.length - before_list.length))
            }, nextPage));
        }

        // 修正记录的当前页
        nowPageState = e.state;
    });
}