// 保存路由的逻辑
define(async () => {
    let oaid = sessionStorage["o-app-id"];
    if (!oaid) {
        oaid = Math.random().toString(32).slice(2);
        sessionStorage["o-app-id"] = oaid;
    }

    var db;

    window.addEventListener("unload", e => {
        // 窗口关闭后清除数据
        removeApprouter(oaid);
    });

    function removeApprouter(oaid) {
        db && db.transaction(['app-router-data'], 'readwrite')
            .objectStore('app-router-data').delete(oaid)
    }

    await new Promise(resolve => {
        const db_req = indexedDB.open("o-app-router-database", 1);
        db_req.onsuccess = event => {
            db = db_req.result;
            resolve();
        };
        db_req.onupgradeneeded = event => {
            db = event.target.result;

            if (!db.objectStoreNames.contains('app-router-data')) {
                db.createObjectStore(
                    'app-router-data',
                    { keyPath: "appid" }
                );
            }
        }
        db_req.onerror = function (event) {
            console.log('cache router init error');
        };
    });

    // 将超时的数据删除
    db.transaction(["app-router-data"], "readonly")
        .objectStore("app-router-data")
        .openCursor()
        .onsuccess = (event) => {
            var cursor = event.target.result;

            if (cursor) {
                let { value } = cursor;

                if (value.appid !== oaid) {
                    if ((Date.now() - value.time) > (1000 * 3600) * 24) {
                        // 超过一天的清除
                        removeApprouter(value.appid);
                    }
                }

                cursor.continue();
            } else {
                console.log('没有更多数据了！');
            }
        };

    // 保存路由数据
    function saveRouter(data) {
        return new Promise((resolve, reject) => {
            var request = db.transaction(['app-router-data'], 'readwrite')
                .objectStore('app-router-data')
                .put({
                    appid: oaid,
                    time: new Date().getTime(),
                    data
                });

            request.onsuccess = (event) => {
                resolve({ event });
            };

            request.onerror = (event) => {
                reject({
                    event
                });
            }
        });
    }

    function loadRouter() {
        return new Promise((resolve, reject) => {
            let req = db.transaction(["app-router-data"], "readonly")
                .objectStore("app-router-data")
                .get(oaid);

            req.onsuccess = (e) => {
                let { result } = e.target;
                resolve(result ? result.data : undefined);
            }
            req.onerror = (e) => {
                reject(e);
            }
        });
    }

    return (app, routerId) => {
        loadRouter().then(historyData => {
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
                    const router = app.router.map((e, index) => {
                        let obj = {
                            path: e.path,
                            index
                        };

                        e.state && (obj.state = JSON.parse(JSON.stringify(e.state)));

                        return obj;
                    })

                    saveRouter(router).then(e => {
                        console.log("save router => ", e);
                    });
                }, 150);
            }
        });
    }
});