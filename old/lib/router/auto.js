// 根据环境，自动化载入路由相应模块，达到最好的路由体验
// 普通浏览器就使用常规 address 模式
// 主要是针对 safari 的优化
// safari 在 PC端 和 移动端（iPhone,iPad） 的交互，都是不一样的
// 在PC端，触摸板滑动换页会有自身动画，所以要兼容触摸板返回操作
// 在移动端的非webapp的路由模式下，左往右滑返回有自身动画，这时仅保留前进动画，干掉返回动画；
// 在移动端的webapp模式下，路由会导致顶部出现导航条，严重影响体验，这时候就要用 slider + 伪路由模式；
define(async ({ load }) => {
    // 判断当前环境
    const ua = navigator.userAgent.toLowerCase();
    // 是否 safari
    let isSafari = ua.includes("safari") && !ua.includes("chrome");
    // let isSafari = true; // 模拟safari
    console.log("isSafari =>", isSafari);

    // 是否全屏的app模式
    let isAppMode = !!navigator.standalone;

    // 是否移动端
    const canTouch = "ontouchstart" in document;

    let addressInit

    if (!isSafari || !isAppMode) {
        addressInit = await load("./address.js");
    }
    if (!isSafari) {
        return addressInit;
    }
    // -----下面都为safari模式-----

    // safari 下专门优化动画的 slider
    const slider = await load("./slider.js")

    return async (app) => {
        if (!canTouch) {
            // safari PC端模式下
            // 地址栏初始化
            addressInit(app);
            // 滑块动画优化（address已包含路由）
            // slider(app, false);
            // 确认用户的使用习惯，是触摸板就去掉动画
            let f;
            window.addEventListener("mousewheel", f = e => {
                if (e.webkitDirectionInvertedFromDevice) {
                    // 触控板不要动画了
                    $("head").push(`'<style>o-app>o-page{transition:none;}</style>'`);
                }
                window.removeEventListener("mousewheel", f);
            });
            return;
        } else if (isAppMode) {
            // safari webapp模式
            slider(app);
        } else {
            // safari 移动浏览器模式
            addressInit(app);

            let noAnimeStyle = $('<style>o-app>o-page{transition:none;}</style>');

            // 返回的时候就不要动画了
            app.on("back", e => {
                if (app.root.ele === document) {
                    $("head").push(noAnimeStyle);
                    setTimeout(() => {
                        noAnimeStyle.remove();
                    }, 100);
                } else {
                    app.root.unshift(noAnimeStyle);
                    setTimeout(() => {
                        noAnimeStyle.remove();
                    }, 100);
                }
            });
        }
    }
});