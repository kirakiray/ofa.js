// 普通页面路由模式
define(async ({ load }) => {
    let initedAddressApp;

    // const storage = await load("../storage -p");

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

        // history 真是很多问题的api，所以history api 只负责监听返回和添加当前路径的功能
        initCacheRouter(app);

        // const oaid = sessionStorage["o-app-id"];

        // const database_name = "o-app-address-cache-" + oaid;
        // const addressCacheDb = storage.getStorage(database_name);

        // window.addEventListener("unload", e => {
        //     indexedDB.deleteDatabase(database_name);
        // });

        // 之前的路由模式经常失效，改用完全版的 history api
        let routerTimer;
        app.watchKey({
            router() {
                // history api 有极短的延迟bug，并且断点不了，通过延后修正
                clearTimeout(routerTimer);
                routerTimer = setTimeout(() => {
                    if (JSON.stringify(history.state.router) == JSON.stringify(app.router)) {
                        // 属于刷新后的路由重置，不需要在加入路由
                        return;
                    }

                    // 新增路由
                    history.pushState({
                        router: JSON.parse(JSON.stringify(app.router))
                    }, "", `#${encodeURIComponent(app.shareHash || app.currentPage.src)}`);
                }, 100);
            }
        });

        if (!history.state) {
            // 首次加载，替换首页地址数据
            app.watchUntil("router.length >= 1").then(e => {
                history.replaceState({
                    router: JSON.parse(JSON.stringify(app.router))
                }, "", `#${encodeURIComponent(app.shareHash || app.currentPage.src)}`);
            });
        }

        // 监听地址栏变动
        window.addEventListener("popstate", e => {
            if (e.state) {
                if (app.router.length > e.state.router.length) {
                    let backlen = app.router.length - e.state.router.length;

                    // 页面后退
                    app.router.splice(-backlen);
                } else {
                    // 页面前进
                    let forward_router = e.state.router.slice(app.router.length);
                    app.router.push(...forward_router);
                }
            } else {
                // 直接修改地址栏
                let src = decodeURIComponent(location.hash).replace("#", "");
                if ("shareHash" in app) {
                    app.shareHash = src;
                } else {
                    app.router.push(src);
                }

                app.router.watchUntil(e => {
                    return !!app.router.slice(-1)[0].path;
                }).then(() => {
                    history.replaceState({
                        router: JSON.parse(JSON.stringify(app.router))
                    }, "", `#${encodeURIComponent(app.shareHash || app.currentPage.src)}`);
                });
            }
        });
    }
});