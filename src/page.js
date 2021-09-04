drill.ext(({ addProcess }) => {
    addProcess("Page", async ({ respone, record, relativeLoad }) => {
        let result = respone;

        if (isFunction(respone)) {
            result = await respone({
                load: relativeLoad,
                FILE: record.src
            });
        }

        // 转换模板
        const defaults = await getDefaults(record, relativeLoad, result);
        let d = transTemp(defaults.temp);
        defaults.temp = d.html;

        // 获取可设置keys
        const cansetKeys = getCansetKeys(defaults);

        record.done(async (pkg) => {
            return { defaults, cansetKeys, temps: d.temps };
        })
    });
});

const PAGESTATUS = Symbol("page_status");

// 获取在 o-app 层上的 o-page
const getCurrentPage = (host) => {
    if (host.parent.is("o-app")) {
        return host;
    }

    while (host.host) {
        host = host.host;
        if (host.is("o-page") && host.parent.is("o-app")) {
            return host;
        }
    }
}

register({
    tag: "o-page",
    attrs: {
        // 资源地址
        src: null,
        // 当前页面的状态
        // empty空白状态，等待加载页面
        // loading 加载中
        // loaded 加载成功
        // error 加载资源失败
        [PAGESTATUS]: "empty"
    },
    proto: {
        get status() {
            return this[PAGESTATUS];
        },
        get app() {
            let target = getCurrentPage(this);

            if (target) {
                return target.parent;
            }
            throw {
                desc: `cannot find the app`,
                target: this
            };
        },
        get query() {
            const searchParams = new URLSearchParams(this.src.replace(/.+(\?.+)/, "$1"));

            let obj = {};

            for (const [key, value] of searchParams.entries()) {
                obj[key] = value;
            }

            return obj;
        },
        // 跳转到相应页面
        navigateTo(src) {
            let cPage = getCurrentPage(this);

            // 查找到当前页的id
            const { router } = this.app;
            let id = router.findIndex(e => e._page == cPage);

            router.splice(id + 1, router.length, src);
        },
        // 替换跳转
        replaceTo(src) {
            let cPage = getCurrentPage(this);

            // 查找到当前页的id
            const { router } = this.app;
            let id = router.findIndex(e => e._page == cPage);

            router.splice(id, router.length, src);
        },
        // 返回页面
        back() {
            this.app.back();
        }
    },
    watch: {
        async src(src) {
            if (!src) {
                return;
            }
            if (this[PAGESTATUS] !== "empty") {
                throw {
                    desc: "src can only be set once",
                    target: this
                };
            }

            this[PAGESTATUS] = "loading";

            if (this._waiting) {
                // 等待加载
                await this._waiting;
            }

            let defaults;

            // 获取渲染数据
            try {
                let data = await load(src);

                this._realsrc = await load(src + " -link");

                // 重新修正可修改字段
                const n_keys = new Set([...Array.from(this[CANSETKEYS]), ...data.cansetKeys]);
                n_keys.delete("src");
                this[CANSETKEYS] = n_keys;

                defaults = data.defaults;

                // 合并原型链上的数据
                extend(this, defaults.proto);

                // 再次渲染元素
                renderXEle({
                    xele: this,
                    defs: Object.assign({}, defaults, {
                        // o-page不允许使用attrs
                        attrs: {},
                    }),
                    temps: data.temps,
                    _this: this.ele
                }).then(e => {
                    this.ele.x_render = 2;
                    this.attr("x-render", 2);
                });
            } catch (err) {
                if (glo.ofa) {
                    this.html = ofa.onState.loadError(err);
                    this[PAGESTATUS] = "error";
                }
                return;
            }

            this[PAGESTATUS] = "loaded";

            emitUpdate(this, {
                xid: this.xid,
                name: "setData",
                args: ["status", this[PAGESTATUS]]
            });

            defaults.attached && this.__attached_pms.then(() => defaults.attached.call(this))
            defaults.detached && this.__detached_pms.then(() => defaults.detached.call(this))
        }
    },
    created() {
        this.__attached_pms = new Promise(res => this.__attached_resolve = res);
        this.__detached_pms = new Promise(res => this.__detached_resolve = res);
    },
    attached() {
        this.__attached_resolve()
    },
    detached() {
        this.__detached_resolve();
    }
});