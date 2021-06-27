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
    let tempUrl = "";

    // 模板用的加载方法
    let tempLoad = relativeLoad;

    if (defaults.temp) {
        // 判断是否有标签
        if (/\</.test(defaults.temp)) {
            // 拥有换行，是模板字符串
            temp = defaults.temp;
        } else {
            if (defaults.temp === true) {
                tempUrl = `./${fileName}.html`;
            } else {
                tempUrl = defaults.temp;
            }

            // 添加模板加载的地址
            tempUrl = await relativeLoad(tempUrl + " -getLink");
            temp = await relativeLoad(tempUrl);

            // 重构temp用的Load方法
            const relativeDir = tempUrl.replace(/(^.+\/).+/, "$1");
            tempLoad = (...args) => {
                return main.load(main.toUrlObjs(args, relativeDir));
            }
        }
        // 去除备注代码
        temp = temp.replace(/<\!--[\s\S]+?-->/g, "");

        // 修正指定的属性值
        // 主要修复 href 和 src 的值
        await Promise.all(["href", "src"].map(async attr => {
            let tagAttrsKeyReg = `[\\w\\d '"=:#@]`;
            const reg1 = new RegExp(`<[\\w\\d\\-]+${tagAttrsKeyReg}+?${attr}=['"].+['"]${tagAttrsKeyReg}*>`, "g");
            const reg2 = new RegExp(`<[\\w\\d\\-]+${tagAttrsKeyReg}+${attr}=['"](.+?)['"]${tagAttrsKeyReg}*>`);

            // 修正href属性的值
            let hrefs = temp.match(reg1);

            if (hrefs) {
                await Promise.all(hrefs.map(async str => {
                    // 获取href属性内的值
                    let href = str.replace(reg2, "$1");
                    try {
                        let relativeSrc = await tempLoad(`${href} -getLink`);

                        // 修正路径
                        let fixStr = str.replace(new RegExp(` ${attr}=['"]${href}['"]`), ` ${attr}="${relativeSrc}"`);
                        temp = temp.replace(str, fixStr);
                    } catch (err) {
                        console.error(`${attr} request failed =>`, {
                            [attr]: attr,
                            path: err[0].path
                        });
                    }
                }));
            }
        }));

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
                            let relativeUrl = await tempLoad(url.replace(/['"']/g, "") + " -getLink");

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

        if (globalcss) {
            temp = `<link rel="stylesheet" href="${globalcss}" />` + temp;
        }
    }

    defaults.temp = temp;

    if (defaults.ready) {
        let old_ready = defaults.ready;
        defaults.ready = function (...args) {
            this.ele.__xInfo.tempUrl = tempUrl;
            return old_ready.apply(this, args);
        }
    } else {
        defaults.ready = function () {
            this.ele.__xInfo.tempUrl = tempUrl;
        }
    }
}

main.setProcessor("Component", async (packData, d, { relativeLoad }) => {
    let defaults = {
        // 默认模板
        temp: true,
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

            // 添加hostcss
            await Promise.all(hostcssArr.map(async hostcss => {
                hostcss = await relativeLoad(hostcss + " -getLink");
                
                // 获取元素域上的主元素
                let root = this.ele.getRootNode();

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