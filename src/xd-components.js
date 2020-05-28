main.setProcessor("Component", async (packData, d, { relativeLoad }) => {
    let defaults = {
        // 默认模板
        temp: false,
        // 加载组件样式
        css: false,
        // 与组件同域下的样式
        hostcss: "",
        // 组件初始化完毕时
        ready() { },
    };

    let options = d;

    if (isFunction(options)) {
        options = options(relativeLoad, {
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

    // 置换temp
    let temp = "";
    if (defaults.temp) {
        // 判断是否有换行
        if (/\n/.test(defaults.temp)) {
            // 拥有换行，是模板字符串
            temp = defaults.temp;
        } else {
            if (defaults.temp === true) {
                temp = await relativeLoad(`./${fileName}.html`);
            } else {
                temp = await relativeLoad(`${defaults.temp}`);
            }
        }

        // 添加css
        let cssPath = defaults.css;
        if (cssPath) {
            if (defaults.css === true) {
                cssPath = await relativeLoad(`./${fileName}.css -getLink`);
            } else {
                cssPath = await relativeLoad(`${defaults.css} -getLink`);
            }
            cssPath && (temp = `<link rel="stylesheet" href="${cssPath}">\n` + temp);
        }

        if (globalcss) {
            temp = `<link rel="stylesheet" href="${globalcss}" />` + temp;
        }
    }

    defaults.temp = temp;

    // ready钩子
    if (defaults.hostcss) {
        let oldReady = defaults.ready;

        let hostcssArr = getType(defaults.hostcss) == "string" ? [defaults.hostcss] : defaults.hostcss;;

        defaults.ready = async function (...args) {
            // 获取元素域上的主元素
            let root = this.ele.getRootNode();

            // 添加hostcss
            await Promise.all(hostcssArr.map(async hostcss => {
                hostcss = await relativeLoad(hostcss + " -getLink");

                // 查找是否已经存在该css
                let targetCssEle = root.querySelector(`link[href="${hostcss}"]`)

                if (!targetCssEle) {
                    let linkEle = $(`<link rel="stylesheet" href="${hostcss}">`);
                    if (root === document) {
                        root.querySelector("head").appendChild(linkEle.ele);
                    } else {
                        root.appendChild(linkEle.ele);
                    }
                }
            }));

            // 执行ready方法
            oldReady.apply(this, args);
        }
    }

    // 注册节点
    $.register(defaults);
});