// xd-app路由器初始化
const initRouter = (app) => {
    const launchFun = (e, launched) => {
        if (launched) {
            // 注销监听
            app.unwatch("launched", launchFun);

            // 确定router执行
            if (app.router == 1) {
                let { currentPage } = app;
                history.replaceState({
                    xdapp: 1,
                    src: currentPage.src,
                    top: true,
                    pageId: currentPage.pageId
                }, currentPage.src, `?__page=${encodeURIComponent(currentPage.src)}`);

                // 监听跳转
                app.on("navigate", (e, opt) => {
                    let defs = {
                        xdapp: 1,
                        src: opt.src,
                        data: opt.data,
                        pageId: opt.target.pageId
                    };
                    switch (opt.type) {
                        case "to":
                            if (opt.forward) {
                                // 通过前进路由进入的页面
                                history.replaceState(defs, opt.src, `?__page=${encodeURIComponent(opt.src)}`);
                            } else {
                                history.pushState(defs, opt.src, `?__page=${encodeURIComponent(opt.src)}`);
                            }
                            break;
                        case "replace":
                            history.replaceState(defs, opt.src, `?__page=${encodeURIComponent(opt.src)}`);
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
                            forward: true
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