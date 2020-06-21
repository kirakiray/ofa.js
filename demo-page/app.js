ofa = async () => {
    ofa.config({
        paths: {
            "@ofa/": "../lib/"
        }
    });

    let oapp = $("o-app");

    // 添加首页前设置路由
    if (navigator.userAgent.includes("iPhone") && innerHeight === screen.availHeight) {
        // 判断是iPhone，并且全屏的状态下，启动slider模式
        oapp.router = "slide";
    } else {
        // 普通路由模式
        oapp.router = "1";
    }


    // 添加首页
    oapp.push(`<o-page src="pages/main/main"></o-page>`);
}