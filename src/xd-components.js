drill.ext(base => {
    let {
        loaders, processors
    } = base;

    // 设置控件类型
    processors.set("component", async packData => {
        let defaults = {
            // 默认模板
            temp: true,
            // 加载外部link
            link: true,
            // 是否加载影子内的link
            shadowLink: false,
            // 当前模块刚加载的时候
            onload() { },
            // 组件初始化完毕时
            inited() { },
        };

        // 合并默认参数
        Object.assign(defaults, base.tempM.d);

        // 获取文件名
        let fileName = packData.path.match(/.+\/(.+)/)[1];
        fileName = fileName.replace(/\.js$/, "");

        // 置换temp
        let temp = "";
        if (defaults.temp) {
            temp = await fetch(`${packData.dir}/${fileName}.html`);
            temp = await temp.text();
        }

        // 判断是否加入shadowLink
        if (defaults.shadowLink) {
            let shadowLink = `${packData.dir}/${fileName}-shadow.css`;
            temp = `<link rel="stylesheet" href="${shadowLink}">\n` + temp;
        }

        // 添加link
        if (defaults.link) {
            await load(`${packData.dir}/${fileName}.css`);
        }

        defaults.temp = temp;

        // 注册节点
        $.register(defaults);
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