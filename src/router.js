// xd-app路由器初始化
const initRouter = (app) => {
    const launchFun = (e, launched) => {
        if (launched) {
            // 注销监听
            app.unwatch("launched", launchFun);

            // 历史路由数组
            let xdHistory = sessionStorage.getItem("xd-app-history");
            if (xdHistory) {
                xdHistory = JSON.parse(xdHistory)
            } else {
                xdHistory = [];
            }

            // 保存路由历史
            const saveXdHistory = (opts) => {
                sessionStorage.setItem("xd-app-history", JSON.stringify(xdHistory));
            }

            // 确定router执行
            if (app.router == 1) {
                if (xdHistory.length === 0) {
                    // 首次修正路由
                    let { currentPage } = app;
                    history.replaceState({
                        xdapp: 1,
                        src: currentPage.src,
                        top: true,
                        pageId: currentPage.pageId
                    }, currentPage.src, `?__page=${encodeURIComponent(currentPage.src)}`);

                    // 加入首次路由并保存
                    xdHistory.push({ src: currentPage.src, pageId: currentPage.pageId });
                    saveXdHistory();
                } else if (xdHistory.length === 1) {
                    // 修正第一页的pageId
                    app.currentPages[0][PAGEID] = xdHistory[0].pageId;
                } else {
                    // 多页路由，修正并补充页面

                    let { currentPage } = app;
                    // 修正第一页的pageId
                    currentPage[PAGEID] = xdHistory[0].pageId;
                    currentPage.attrs["xd-page-anime"] = currentPage.pageParam.back;

                    // 补充剩余的页面
                    let lastId = xdHistory.length - 1;
                    xdHistory.forEach((e, i) => {
                        if (!i) return;

                        let xdPage = $({
                            tag: "xd-page",
                            src: e.src
                        });

                        if (e.data) {
                            xdPage[NAVIGATEDATA] = e.data;
                        }

                        // 加入历史列表
                        app[CURRENTS].push(xdPage);

                        // 还原pageId
                        xdPage[PAGEID] = e.pageId;

                        let f;
                        xdPage.watch("pageStat", f = (e, val) => {
                            if (val === "finish") {
                                // 完成时，修正page状态
                                if (i == lastId) {
                                    // 当前页
                                    xdPage.attrs["xd-page-anime"] = xdPage.pageParam.current;
                                    return;
                                } else {
                                    // 设置为前一个页面
                                    xdPage.attrs["xd-page-anime"] = xdPage.pageParam.back[0];
                                }

                                xdPage.unwatch("pageStat", f);
                            }
                        }, true);

                        // 添加到app中
                        app.push(xdPage);
                    });
                }

                // 监听跳转
                app.on("navigate", (e, opt) => {
                    let defs = {
                        xdapp: 1,
                        src: opt.src,
                        data: opt.data,
                        pageId: opt.target.pageId
                    };
                    let { currentPage } = app;
                    switch (opt.type) {
                        case "to":
                            if (opt.forward) {
                                // 前进路由修正数据
                                currentPage[PAGEID] = opt.pageId;
                            } else {
                                history.pushState(defs, opt.src, `?__page=${encodeURIComponent(opt.src)}`);
                            }

                            xdHistory.push({
                                src: currentPage.src,
                                pageId: currentPage.pageId,
                                data: opt.data
                            });
                            saveXdHistory();
                            break;
                        case "replace":
                            history.replaceState(defs, opt.src, `?__page=${encodeURIComponent(opt.src)}`);
                            xdHistory.splice(-1, {
                                src: currentPage.src,
                                pageId: currentPage.pageId,
                                data: opt.data
                            });
                            saveXdHistory();
                            break;
                        case "back":
                            xdHistory.splice(-opt.delta, opt.delta);
                            saveXdHistory();
                            break;
                    }
                    console.log(`navigate to => `, e);
                });

                window.addEventListener("popstate", e => {
                    let { state } = e;

                    let { currentPages } = app;

                    let targetIndex = currentPages.findIndex(e => e.pageId === state.pageId);

                    if (targetIndex > -1) {
                        // 返回操作
                        app[APPNAVIGATE]({
                            type: "back",
                            delta: currentPages.length - targetIndex - 1
                        });
                    } else {
                        // 不存在的页面，属于前进路由，跳转新页面
                        app[APPNAVIGATE]({
                            src: state.src,
                            forward: true,
                            pageId: state.pageId,
                            data: state.data
                        });
                    }

                    // 判断是否前一页的数据
                    console.log(`state => `, e);
                });
            }
        }
    }
    app.watch("launched", launchFun);
}