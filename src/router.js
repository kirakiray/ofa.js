// xd-app路由器初始化
const initRouter = (app) => {
    // 监听跳转
    app.on("navigate", (e, opt) => {
        if (!app.router) {
            return;
        }
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
        if (!app.router) {
            return;
        }

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