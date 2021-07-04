let initedAddressApp = false;

// 全局化app，进行地址栏的监听
const initAddress = async (app) => {
    if (initedAddressApp) {
        throw {
            desc: "the existing app is initialized globally",
            target: initedAddressApp
        };
    }

    initedAddressApp = app;

    await app.watchUntil("homeLoaded");

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
    app.watchKey({
        router: e => {
            setTimeout(() => {
                history.replaceState({
                    type: "now",
                    router: app.router.map(e => {
                        let obj = {
                            path: e.path
                        };

                        e.state && (obj.state = e.state);

                        return obj;
                    })
                }, "", `#src=${encodeURIComponent(app.currentPage.src)}`);
            }, 50);
        }
    });

    // 初始化过就不用初始化了
    if (!history.state || history.state.type !== "now") {
        // 初始化返回路由
        history.pushState({
            type: "back"
        }, "", `#back`);

        history.pushState({
            type: "now",
        }, "", `#src=${encodeURIComponent(app.currentPage.src)}`);
    } else if (history.state && history.state.type == "now" && history.state.router.length > 1) {
        // 还原之前的路由
        app.router.push(...history.state.router.slice(1));
    }
}