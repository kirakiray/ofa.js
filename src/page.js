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
        }
    },
    watch: {
        async src(src) {
            this[PAGESTATUS] = "loading";

            // 获取渲染数据
            let data = await load(src);

            // 重新修正可修改字段
            const n_keys = new Set([...Array.from(this[CANSETKEYS]), ...data.cansetKeys]);
            n_keys.delete("src");
            this[CANSETKEYS] = n_keys;

            // 再次渲染元素
            renderXEle({
                xele: this,
                defs: data.defaults,
                temps: data.temps,
                _this: this.ele
            });

            this[PAGESTATUS] = "loaded";
        }
    }
});