// 保存路由的逻辑
define(async ({ load }) => {
    const storage = await load("../storage -p");
    const oappRouterStorage = storage.getStorage("o-app-router-database");

    await oappRouterStorage.dbPms;

    function removeApprouter(oaid) {
        oappRouterStorage.removeItem(oaid);
    }

    function loadRouter(oaid) {
        return oappRouterStorage.getItem(oaid).then(result => {
            return result ? result.data : undefined;
        });
    }

    // 保存路由数据
    function saveRouter(data, oaid) {
        return oappRouterStorage.setItem(oaid, {
            appid: oaid,
            time: new Date().getTime(),
            data
        });
    }

    return (app, routerId) => {
        let oaid = routerId || sessionStorage["o-app-id"];
        if (!oaid) {
            oaid = Math.random().toString(32).slice(2);
            sessionStorage["o-app-id"] = oaid;
        }

        window.addEventListener("unload", e => {
            // 窗口关闭后清除数据
            removeApprouter(oaid);
        });

        // 将超时的数据删除
        oappRouterStorage.getAll().then(result => {
            result.forEach(e => {
                const { value } = e;
                if (value.appid !== oaid) {
                    if ((Date.now() - value.time) > (1000 * 3600) * 24) {
                        // 超过一天的清除
                        removeApprouter(value.appid);
                    }
                }
            });
        });

        loadRouter(oaid).then(historyData => {
            if (historyData && historyData.length > 1) {
                app.router.push(...historyData.slice(1));
            }
        });

        // 虚路由监听
        let routerTimer;
        app.watchKey({
            router() {
                clearTimeout(routerTimer);
                routerTimer = setTimeout(() => {
                    const router = JSON.parse(JSON.stringify(app.router))

                    saveRouter(router, oaid);

                    // saveRouter(router, oaid).then(e => {
                    //     console.log("save router => ", e);
                    // });
                }, 150);
            }
        });
    }
});