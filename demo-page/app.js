ofa = async () => {
    ofa.config({
        paths: {
            "@ofa/": "../lib/"
        }
    });

    // ofa.offline = true;

    let oapp = $("o-app");

    let isSlideMode = false;

    // iPhone
    if (navigator.userAgent.includes("iPhone")) {
        isSlideMode = true;
    }

    // iPad
    if (navigator.userAgent.includes("Mac OS X") && (window.screen.width == 768 || window.screen.height == 1024)) {
        isSlideMode = true;
    }

    // 添加首页前设置路由
    if (isSlideMode) {
        // 判断是iPhone，并且全屏的状态下，启动slider模式
        oapp.router = "slide";
    } else {
        // 普通路由模式
        oapp.router = "1";
    }


    // 添加首页
    oapp.push(`<o-page src="pages/main/main"></o-page>`);
}