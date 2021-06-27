// 自定义组件
drill.ext(({ addProcess }) => {
    addProcess("Component", async ({ respone, record, relativeLoad }) => {
        let result = respone;

        if (isFunction(respone)) {
            result = await respone({
                load: relativeLoad,
                FILE: record.src
            });
        }

        // 默认数据
        const defaults = {
            // 静态模板地址
            temp: "",
            // 下面都是 xhear 自带的组件数据
            // // 组件名
            // tag: "",
            // // 自带的数据
            // data: {},
            // // 会绑定到 element attribute 的数据
            // attrs: {},
            // // 组件原型链上的数据
            // proto: {},
            // // 组件被创建时触发的函数（数据初始化完成）
            // created() { },
            // // 组件数据初始化完成后触发的函数（初次渲染完毕）
            // ready() { },
            // // 被添加到document触发的函数
            // attached() { },
            // // 被移出document触发的函数
            // detached() { },
            // // 容器元素发生改变
            // slotchange() { }
        };

        Object.assign(defaults, result);

        let defineName = record.src.replace(/.+\/(.+)/, "$1").replace(/\.js$/, "");

        // 组件名修正
        if (!defaults.tag) {
            defaults.tag = defineName;
        }

        // 获取模板
        if (defaults.temp === "") {
            // 获取与模块相同名的temp
            let temp = await relativeLoad(`./${defineName}.html`);

            defaults.temp = await fixRelativeSource(temp, relativeLoad);
        }

        // 注册组件
        register(defaults);
    });
});

// 修正temp内的资源地址
const fixRelativeSource = async (temp, relativeLoad) => {
    // 修正所有资源地址
    let tempEle = document.createElement("template");
    tempEle.innerHTML = temp;

    // 修正所有link
    let hrefEles = tempEle.content.querySelectorAll("[href]");
    let srcEles = tempEle.content.querySelectorAll("[src]");
    let hasStyleEle = tempEle.content.querySelectorAll(`[style*="url("]`);

    // 所有进程
    const pms = [];

    hrefEles && Array.from(hrefEles).forEach(ele => {
        pms.push((async () => {
            let relative_href = await relativeLoad(`${ele.getAttribute("href")} -link`);
            ele.setAttribute("href", relative_href)
        })());
    });

    srcEles && Array.from(srcEles).forEach(ele => {
        pms.push((async () => {
            let relative_src = await relativeLoad(`${ele.getAttribute("src")} -link`);
            ele.setAttribute("src", relative_src)
        })());
    });

    // 修正style资源地址
    hasStyleEle && Array.from(hasStyleEle).forEach(ele => {
        pms.push((async () => {
            ele.setAttribute("style", await fixStyleUrl(ele.getAttribute("style"), relativeLoad));
        })());
    });

    let styles = tempEle.content.querySelectorAll("style");
    styles && Array.from(styles).forEach(style => {
        pms.push((async () => {
            style.innerHTML = await fixStyleUrl(style.innerHTML, relativeLoad);
        })());
    });

    await Promise.all(pms);

    return tempEle.innerHTML;
}

// 修正style字符串上的资源地址
const fixStyleUrl = async (styleStr, relativeLoad) => {
    let m_arr = styleStr.match(/url\(.+?\)/g);

    await Promise.all(m_arr.map(async url => {
        let url_str = url.replace(/url\((.+?)\)/, "$1");
        let n_url = await relativeLoad(`${url_str} -link`);

        styleStr = styleStr.replace(url, `url(${n_url})`);
    }));

    return styleStr;
}