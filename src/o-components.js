const componentBuildDefault = async ({ defaults, packData, options, relativeLoad }) => {
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
        // 判断是否有标签
        if (/\</.test(defaults.temp)) {
            // 拥有换行，是模板字符串
            temp = defaults.temp;
        } else {
            if (defaults.temp === true) {
                temp = await relativeLoad(`./${fileName}.html`);
            } else {
                temp = await relativeLoad(`${defaults.temp}`);
            }
        }
        // 去除备注代码
        temp = temp.replace(/<\!--[\s\S]+?-->/g, "");

        // 修正src属性的值
        let srcs = temp.match(/( src=".+?"| src='.+')/g);
        if (srcs) {
            await Promise.all(srcs.map(async str => {
                // 获取src属性内的值
                let src = str.replace(/ src=['"](.+)['"]$/, "$1");
                try {
                    let relativeSrc = await relativeLoad(`${src} -getLink`);

                    // 修正路径
                    let fixStr = str.replace(src, relativeSrc);
                    temp = temp.replace(str, fixStr);
                } catch (err) {
                    console.error(`src request failed =>`, {
                        src,
                        path: err[0].path
                    });
                }
            }));
        }

        // 修正style内url的值
        let styles = temp.match(/<style>[\s\S]+?<\/style>/g);
        if (styles) {
            await Promise.all(styles.map(async (styleStr) => {
                let backupStyleStr = styleStr;
                let urlArr = styleStr.match(/url\(.+?\)/g);

                if (urlArr) {
                    await Promise.all(urlArr.map(async urlStr => {
                        let url = urlStr.replace(/url\((.+?)\)/, "$1");

                        try {
                            let relativeUrl = await relativeLoad(url.replace(/['"']/g, "") + " -getLink");

                            let fixurlStr = urlStr.replace(url, relativeUrl);
                            styleStr = styleStr.replace(urlStr, fixurlStr);
                        } catch (err) {
                            console.error(`style url request failed =>`, {
                                url,
                                path: err[0].path
                            });
                        }
                    }));
                }

                temp = temp.replace(backupStyleStr, styleStr);
            }));
        }

        // 添加css
        let cssPath = defaults.css;
        if (cssPath) {
            let needLoadUrl = `${defaults.css} -getLink`;
            if (defaults.css === true) {
                needLoadUrl = `./${fileName}.css -getLink`;
            }
            // 缓存文件，并获取地址
            await relativeLoad(needLoadUrl + " -unAppend");
            cssPath = await relativeLoad(needLoadUrl);

            cssPath && (temp = `<link rel="stylesheet" href="${cssPath}">\n` + temp);
        }

        if (globalcss) {
            temp = `<link rel="stylesheet" href="${globalcss}" />` + temp;
        }
    }

    defaults.temp = temp;
}

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

    await componentBuildDefault({ defaults, packData, options: d, relativeLoad });

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