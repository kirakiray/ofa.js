drill.ext(base => {
    let {
        loaders, processors, main
    } = base;

    // 设置控件类型
    processors.set("component", async packData => {
        let defaults = {
            // 默认模板
            temp: true,
            // 加载组件样式
            link: true,
            // 与组件同域下的样式
            hostlink: "",
            // 当前模块刚加载的时候
            onload() { },
            // 组件初始化完毕时
            inited() { },
            // 依赖子模块
            use: []
        };

        // load方法
        const load = (...args) => main.load(main.toUrlObjs(args, packData.dir));

        // 合并默认参数
        Object.assign(defaults, base.tempM.d);

        // 执行onload
        await defaults.onload({
            load,
            DIR: packData.dir,
            FILE: packData.path
        });

        // 获取文件名
        let fileName = packData.path.match(/.+\/(.+)/)[1];
        fileName = fileName.replace(/\.js$/, "");

        // 添加子组件
        if (defaults.use && defaults.use.length) {
            await load(...defaults.use);
        }

        // 置换temp
        let temp = "";
        if (defaults.temp) {
            let path = await load(`./${fileName}.html -getPath`);
            temp = await fetch(path);
            temp = await temp.text();
        }

        // 添加link
        if (defaults.link) {
            let linkPath = await load(`./${fileName}.css -getPath`);
            temp = `<link rel="stylesheet" href="${linkPath}">\n` + temp;
        }

        defaults.temp = temp;

        // inited钩子
        let oldInited = defaults.inited;
        defaults.inited = async function (...args) {
            // 添加hostlink
            if (defaults.hostlink) {
                // 获取元素域上的主
                let root = this.ele.getRootNode();

                let hostlink = await load(defaults.hostlink + " -getPath");

                // 查找是否已经存在该link
                let targetLinkEle = root.querySelector(`link[href="${hostlink}"]`)

                if (!targetLinkEle) {
                    let linkEle = $(`<link rel="stylesheet" href="${hostlink}">`);
                    if (root === document) {
                        root.querySelector("head").appendChild(linkEle.ele);
                    } else {
                        root.appendChild(linkEle.ele);
                    }
                }
            }

            // 执行inited方法
            oldInited.apply(this, args);
        }

        // 注册节点
        $.register(defaults);

        // 设置模块载入完成
        packData.stat = 3;
    });

    // 添加新类型
    drill.Component = (d, moduleId) => {
        base.tempM = {
            type: "component",
            d,
            moduleId
        };
    }

    // 添加新类型
    glo.Component || (glo.Component = drill.Component);
});