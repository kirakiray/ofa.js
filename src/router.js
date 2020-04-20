// 返回路由提前载入量
let ofa_inadvance = 1;

// xd-app路由器初始化
const initRouter = (app) => {
    const launchFun = (e, launched) => {
        if (!launched) {
            return;
        }
        // 注销监听
        app.unwatch("launched", launchFun);

        // 历史路由数组
        let xdHistory = sessionStorage.getItem("xd-app-history");
        if (xdHistory) {
            xdHistory = JSON.parse(xdHistory)
        } else {
            xdHistory = [];
        }

        // 保存路由历史
        const saveXdHistory = () => {
            sessionStorage.setItem("xd-app-history", JSON.stringify(xdHistory));
        }

        if (app.router != 1) {
            return;
        }

        // 监听跳转
        app.on("navigate", (e, opt) => {
            let defs = {
                xdapp: 1,
                src: opt.src,
            };
            let { currentPage } = app;
            switch (opt.type) {
                case "to":
                    debugger
                    break;
                case "replace":
                    debugger
                    break;
                case "back":
                    debugger
                    break;
            }
        });

        // ---前进后退功能监听封装---
        const BANDF = "xd-app-init-back-forward";
        if (!sessionStorage.getItem(BANDF)) {
            // fuck chrome mult pushState invalid
            // 初次替换后退路由
            history.pushState({
                __t: "back"
            }, "back", "?back=1");

            // 进一步正确路由
            history.pushState({
                __t: "current"
            }, "current", "?current=1");

            // 增加一个前进路由
            history.pushState({
                __t: "forward"
            }, "forward", "?forward=1");

            history.back();


            sessionStorage.setItem(BANDF, 1)
        }

        // 延后初始化路由监听
        // 开始监听路由
        window.addEventListener("popstate", e => {
            let { state } = e;

            switch (state.__t) {
                case "back":
                    console.log("返回页");
                    // 还原路由
                    history.forward();
                    alert("back");
                    break;
                case "current":
                    console.log("当前页");
                    break;
                case "forward":
                    console.log("前进ye");
                    // 还原路由
                    history.back();
                    break;
            }
        });
    }
    app.watch("launched", launchFun);
}