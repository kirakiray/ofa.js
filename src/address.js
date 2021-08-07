let initedAddressApp = false;

// 全局化app，进行地址栏的监听
const initAddress = async (app) => {
    if (initedAddressApp) {
        throw {
            desc: "the existing app is initialized globally",
            initedTarget: initedAddressApp,
            target: app
        };
    }

    initedAddressApp = app;

    window.addEventListener("popstate", e => {
        switch (e.state.type) {
            case "back":
                // 拦截返回的路由
                app.currentPage.back();
                history.forward();
                break;
        }
    });

    // 主要监听到最新的页面的路由
    let routerTimer;
    app.watchKey({
        router: e => {
            clearTimeout(routerTimer);
            routerTimer = setTimeout(() => {
                history.replaceState({
                    type: "now",
                    router: app.router.map(e => {
                        let obj = {
                            path: e.path
                        };

                        e.state && (obj.state = JSON.parse(JSON.stringify(e.state)));

                        return obj;
                    })
                }, "", `#${encodeURIComponent(app.currentPage.src)}`);
            }, 150);
        }
    });

    // 初始化过就不用初始化了
    if (!history.state || history.state.type !== "now") {
        // 如果当前路由地址不是首页，载入相应页面
        let target_url;
        if (location.hash && location.hash.length > 1) {
            target_url = location.hash.replace(/^#/, "");
        }

        // 初始化返回路由
        history.pushState({
            type: "back"
        }, "", `#back`);

        // 添加首页
        history.pushState({
            type: "now",
        }, "", `#${encodeURIComponent(app.currentPage.src)}`);

        // 进入下一级页面
        if (target_url && app.currentPage.src !== target_url) {
            app.router.push(decodeURIComponent(target_url));
        }
    } else if (history.state && history.state.type == "now" && history.state.router.length > 1) {
        // 还原之前的路由
        app.router.push(...history.state.router.slice(1));
    }
}