((window, factory) => {
    if (window.drill) {
        drill.define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.ofaStorage = factory();
    }
})(this, function () {
    const indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;

    const ready = (_this) => new Promise((resolve, reject) => {
        if (!_this._task) {
            resolve(true);
        } else {
            _this._task.push({ resolve, reject });
        }
    });

    class XDStorage {
        constructor(id) {
            // 根据id获取数据库
            let req = indexedDB.open(id);

            // 先设定任务队列数组
            let task = this._task = [];

            req.onsuccess = (e) => {
                //获取数据库
                this.db = e.target.result;

                // 删除任务队列数组
                delete this._task;

                if (task.length) {
                    task.forEach(o => o.resolve(true));
                }
            };

            // 创建时生成仓库
            req.onupgradeneeded = (e) => {
                // 保存 IDBDataBase 接口
                let db = this.db = e.target.result;

                // 为该数据库创建一个对象仓库
                db.createObjectStore("main", { keyPath: "key" });
            };

            req.onerror = (event) => {
                throw {
                    desc: "数据创建出错",
                    evenet
                };
            };
        }
        clear() {
            return ready(this).then(e => {
                return new Promise((resolve, reject) => {
                    let req = this.db.transaction(["main"], "readonly")
                        .objectStore("main")
                        .getAllKeys();

                    req.onsuccess = (e) => {
                        let keys = e.target.result;

                        if (keys) {
                            this.removeItem(keys).then(resolve).catch(reject);
                        }
                    }
                    req.onerror = (e) => {
                        reject(e);
                    }
                });
            });
        }
        getItem(key) {
            return ready(this).then(e => {
                return new Promise((resolve, reject) => {
                    let req = this.db.transaction(["main"], "readonly")
                        .objectStore("main")
                        .get(key);

                    req.onsuccess = (e) => {
                        let { result } = e.target;
                        resolve(result ? result.value : undefined);
                    }
                    req.onerror = (e) => {
                        reject(e);
                    }
                });
            });
        }
        setItem(key, value) {
            return ready(this).then(e => {
                return new Promise((resolve, reject) => {
                    let req = this.db.transaction(["main"], "readwrite")
                        .objectStore("main")
                        .put({ key, value });

                    req.onsuccess = (e) => {
                        resolve(true);
                    }
                    req.onerror = (e) => {
                        reject(e);
                    }
                });
            });
        }
        removeItem(key) {
            return ready(this).then(e => {
                return new Promise((resolve, reject) => {
                    let req = this.db.transaction(["main"], "readwrite")
                        .objectStore("main")

                    req.onsuccess = (e) => {
                        resolve(true);
                    }
                    req.onerror = (e) => {
                        reject(e);
                    }

                    if (key instanceof Array) {
                        key.forEach(k => req.delete(k));
                    } else {
                        req.delete(key)
                    }
                });
            });
        }
        getLength() {
            return ready(this).then(e => {
                return new Promise((resolve, reject) => {
                    let req = this.db.transaction(["main"], "readonly")
                        .objectStore("main")
                        .getAllKeys();

                    req.onsuccess = (e) => {
                        let keys = e.target.result;

                        if (keys) {
                            resolve((keys && keys.length) || 0);
                        }
                    }
                    req.onerror = (e) => {
                        reject(e);
                    }
                });
            });
        }
    }

    let globalStorage = new XDStorage("public");

    // 设置全局性获取参数
    globalStorage.getStorage = id => id && new XDStorage(id);

    return globalStorage;
});