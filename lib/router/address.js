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

        // history 真是很多问题的api，所以history api 只负责监听返回和添加当前路径的功能
        initCacheRouter(app);

        // 缓存state router 数据
        let cacheStateRouter = sessionStorage["cacheStateRouter"];
        if (cacheStateRouter) {
            cacheStateRouter = JSON.parse(cacheStateRouter);
        } else {
            cacheStateRouter = {};
        }

        window.cacheStateRouter = cacheStateRouter;

        let saverTimer;
        const addRouter = routerData => {
            let values = Object.values(cacheStateRouter);
            let str = JSON.stringify(routerData);
            let rid;
            if (!values.includes(str)) {
                rid = Math.random().toString(32).slice(2);
                cacheStateRouter[rid] = str;
            } else {
                let target = Object.entries(cacheStateRouter).find(([rkey, value]) => {
                    return value === str;
                });
                return target[0];
            }
            clearTimeout(saverTimer);
            saverTimer = setTimeout(() => {
                sessionStorage.cacheStateRouter = JSON.stringify(cacheStateRouter);
            }, 10);
            return rid;
        }

        // 根据id获取路由
        function getRouterByRids(arr) {
            return arr.map(rid => {
                return JSON.parse(cacheStateRouter[rid]);
            });
        }

        // 之前的路由模式经常失效，改用完全版的 history api
        let routerTimer;
        app.watchKey({
            router() {
                // history api 有极短的延迟bug，并且断点不了，通过延后修正
                clearTimeout(routerTimer);
                routerTimer = setTimeout(() => {
                    if (app.router.length == history.state.rids.length) {
                        let stateRouter;
                        if (history.state.rids) {
                            stateRouter = getRouterByRids(history.state.rids);
                        }

                        if (JSON.stringify(stateRouter) == JSON.stringify(app.router)) {
                            // 属于刷新后的路由重置，不需要在加入路由
                            return;
                        }

                        // 替换路由
                        replaceRouter();
                    } else if (app.router.length > history.state.rids.length) {
                        let rids = app.router.map(e => addRouter(e));

                        // 新增路由
                        history.pushState({
                            // router: JSON.parse(JSON.stringify(app.router)),
                            rids
                        }, "", `#${encodeURI(app.shareHash || app.currentPage.src)}`);
                    } else {
                        // 属于直接修改router的多级返回操作
                        // 直接修正history
                        history.go(app.router.length - history.state.rids.length);
                    }
                }, 100);
            }
        });

        function replaceRouter() {
            let rids = app.router.map(e => addRouter(e));
            history.replaceState({
                rids,
                // router: JSON.parse(JSON.stringify(app.router))
            }, "", `#${encodeURI(app.shareHash || app.currentPage.src)}`);
        }

        if (!history.state) {
            let startHash = location.hash;
            // 存档首次进来的hash
            sessionStorage.setItem("o-app-first-hash", startHash);

            // 首次加载，替换首页地址数据
            app.watchUntil("router.length >= 1").then(e => {
                replaceRouter();

                // 加载新页面
                const new_src = decodeURI(startHash.replace("#", ""));
                if (new_src) {
                    if ("shareHash" in app) {
                        app.shareHash = new_src;
                    }
                    // else {
                    //     app.router.push(new_src);
                    // }
                }
            });
        }

        // 监听地址栏变动
        window.addEventListener("popstate", e => {
            if (e.state) {
                const stateRouter = getRouterByRids(e.state.rids);

                if (app.router.length > stateRouter.length) {
                    let backlen = app.router.length - stateRouter.length;

                    // 修正返回事件
                    const event = new Event("back", {
                        cancelable: true
                    });
                    event.delta = backlen;
                    app.triggerHandler(event);

                    // 页面后退
                    app.router.splice(-backlen);
                } else if (app.router.length < stateRouter.length) {
                    // 页面前进
                    let forward_router = stateRouter.slice(app.router.length);
                    app.router.push(...forward_router);
                }
            } else {
                // 直接修改地址栏
                let src = decodeURI(location.hash).replace("#", "");
                if ("shareHash" in app) {
                    app.shareHash = src;
                } else {
                    app.router.push(src);
                }

                app.router.watchUntil(e => {
                    return !!app.router.slice(-1)[0].path;
                }).then(() => {
                    replaceRouter();
                });
            }
        });
    }
});