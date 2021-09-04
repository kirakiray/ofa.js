// 普通页面路由模式
define(async ({ load }) => {
    let initedAddressApp;

    const initCacheRouter = await load("./cacheRouter.js");

    return async (app) => {
        if (initedAddressApp) {
            throw {
                desc: "the existing app is initialized globally",
                initedTarget: initedAddressApp,
                target: app
            };
        }

        if (!app) {
            app = ofa.apps[0];
        }

        initedAddressApp = app;

        // 监听地址栏变动
        window.addEventListener("popstate", e => {
            if (e.state) {
                switch (e.state.type) {
                    case "back":
                        // 拦截返回的路由
                        app.back();
                        // 立刻还原回路由
                        history.forward();
                        // console.log("路由后退")
                        break;
                }
            }
        });

        // 路由变动后修正
        let routerTimer;
        app.watchKey({
            router() {
                // history api 有极短的延迟bug，并且断点不了，通过延后修正
                clearTimeout(routerTimer);
                routerTimer = setTimeout(() => {
                    history.replaceState({
                        type: "now",
                    }, "", `#${encodeURIComponent(app.shareHash || app.currentPage.src)}`);
                }, 100);
            }
        });

        if (!history.state || !history.state.type) {
            // 存档首次进来的hash
            sessionStorage.setItem("o-app-first-hash", location.hash);

            // 初始化返回路由
            history.pushState({
                type: "back"
            }, "", `#back`);

            // 添加首页
            history.pushState({
                type: "now",
            }, "", `#${encodeURIComponent(app.shareHash || app.currentPage.src)}`);
        }

        // history 真是很多问题的api，所以history api 只负责监听返回和添加当前路径的功能
        initCacheRouter(app);
    }
});