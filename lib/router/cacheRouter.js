// 保存路由的逻辑
define(() => {
    let target_app;
    return (app) => {
        if (target_app) {
            return;
        }

        target_app = app;

        // 存储假路由
        const HNAME = "o-app-history";
        let historyData = sessionStorage.getItem(HNAME);
        if (historyData) {
            historyData = JSON.parse(historyData);

            if (historyData.length > 1) {
                app.router.push(...historyData.slice(1));
            }
        }

        // 虚路由监听
        let routerTimer;
        app.watchKey({
            router() {
                clearTimeout(routerTimer);
                routerTimer = setTimeout(() => {
                    // 路由改变过
                    sessionStorage.setItem("router_changed", 1);

                    const router = app.router.map(e => {
                        let obj = {
                            path: e.path
                        };

                        e.state && (obj.state = JSON.parse(JSON.stringify(e.state)));

                        return obj;
                    })

                    sessionStorage.setItem(HNAME, JSON.stringify(router));
                }, 150);
            }
        });

        if (sessionStorage.getItem("router_changed") != 1) {
            // 判断是否首次带数据进入app
            let first_load_hash = sessionStorage.getItem("o-app-first-hash");
            if (!first_load_hash) {
                // 没有添加address模块的状态，直接取hash
                let hash = location.hash;
                if (hash) {
                    first_load_hash = hash;
                }
            }

            // 判断当前页是否first_load_hash，不是的话进行添加
            let descObj = Object.getOwnPropertyDescriptor(app, "shareHash");
            if (descObj && descObj.set) {
                app.shareHash = decodeURIComponent(first_load_hash).replace(/^#/, "");
            }
        }
    }
});