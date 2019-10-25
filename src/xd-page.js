const PAGESTAT = Symbol("pageStat");

let xdpageStyle = $(`<style>xd-page{display:block;}</style>`);
$("head").push(xdpageStyle);

// 定义新类型 xd-page
$.register({
    tag: "xd-page",
    // temp: `
    // <style>:host{display:block;}.xd-page-content{width:100%;height:100%;}</style>
    // <div class="xd-page-content" xv-tar="pageContent">xd-page-inner</div>
    // `,
    temp: false,
    attrs: ["src"],
    data: {
        src: "",
    },
    proto: {
        get stat() {
            return this[PAGESTAT];
        }
    },
    watch: {
        src(e, val) {
            if (this[PAGESTAT] != "unload") {
                throw {
                    target: this,
                    desc: `this page is ${this.stat}!`
                };
            }

            if (!val) {
                return;
            }

            this[PAGESTAT] = "loading";

            // 请求文件
            load(val).then(opts => {
                renderEle(this.ele, Object.assign({}, opts, {
                    attrs: []
                }));
                this[PAGESTAT] = "loaded";
            });
        }
    },
    ready() {
        // 自动进入unload状态
        this[PAGESTAT] = "unload";
    }
});

processors.set("page", async packData => {
    let defaults = {
        // 默认模板
        temp: true,
        // 加载组件样式
        link: false,
        // 监听属性函数
        watch: {},
        // 自有属性
        data: {},
        // 页面加载完成
        // onLoad() { },
        // 页面被激活时调用，搭配xd-app使用
        // onActive() { },
        // 页面被关闭时调用
        // onClose() { },
        // 依赖子模块
        use: []
    };

    // load方法
    const load = (...args) => main.load(main.toUrlObjs(args, packData.dir));

    let options = base.tempM.d;

    if (isFunction(options)) {
        options = options(load, {
            DIR: packData.dir,
            FILE: packData.path
        });
        if (options instanceof Promise) {
            options = await options;
        }
    }

    // 合并默认参数
    Object.assign(defaults, options);

    // 获取文件名
    let fileName = packData.path.match(/.+\/(.+)/)[1];
    fileName = fileName.replace(/\.js$/, "");

    // 添加子组件
    if (defaults.use && defaults.use.length) {
        await load(...defaults.use);
    }

    // 置换temp
    let temp = "";
    if (!defaults.temp) {
        console.error("page need template!");
        return;
    }
    // 判断是否有换行
    if (/\n/.test(defaults.temp)) {
        // 拥有换行，是模板字符串
        temp = defaults.temp;
    } else {
        let path;
        if (defaults.temp === true) {
            path = await load(`./${fileName}.html -getPath`)
        } else {
            // path = defaults.temp;
            path = await load(`${defaults.temp} -getPath`);
        }
        temp = await fetch(path);
        temp = await temp.text();
    }

    // 添加link
    let linkPath = defaults.link;
    if (linkPath) {
        if (defaults.link === true) {
            linkPath = await load(`./${fileName}.css -getPath`);
        } else {
            linkPath = await load(`${defaults.link} -getPath`);
        }
        linkPath && (temp = `<link rel="stylesheet" href="${linkPath}">\n` + temp);
    }

    defaults.temp = temp;

    packData.getPack = async () => defaults;

    // 设置模块载入完成
    packData.stat = 3;
});

// 添加新类型
drill.Page = (d, moduleId) => {
    base.tempM = {
        type: "page",
        d,
        moduleId
    };
}

// 添加新类型
glo.Page || (glo.Page = drill.Page);