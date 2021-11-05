// 边缘滑动路由模式
// 针对safari在webapp全屏模式下，address变动会让顶部栏重新显示
// 所以就在原有地址上，加入滑动返回的逻辑
define(async ({ load }) => {
    let gloapp;

    return (app, needCache = true) => {
        if (!app) {
            app = ofa.apps[0];
        }

        if (gloapp) {
            return;
        }

        gloapp = app;

        if ("ontouchstart" in document) {
            // 左侧设置滑块元素
            const slideEle = $(`<div></div>`);

            slideEle.style = {
                "z-index": "1000000",
                position: "fixed",
                left: "0",
                // top: "50%",
                // width: "80px",
                // height: "50%",
                // "background-color": "rgba(255,0,0,.1)",
                top: "0",
                width: "30px",
                height: "100%",
            };

            $("body").push(slideEle);

            // 初始的x轴
            let startX;
            // 前一个触控点，判断方向用的
            let beforePointX;

            // 准备执行动画的所有元素
            let needRunPages = [];

            slideEle.on("touchstart", e => {
                e.preventDefault();

                let point = getPoint(e);
                beforePointX = startX = point.clientX;

                if (app.router.length > 1) {
                    // 获取关键页元素
                    let backAreaData = getAreaDataByName("back");
                    let currentAreaData = getAreaDataByName("");
                    let nextAreaData = getAreaDataByName("next");

                    let [a1, a2] = app.router.slice(-2);
                    let prevPage = a1._page.ele, afterPage = a2._page.ele;

                    // 前一页
                    needRunPages.push({
                        target: prevPage,
                        now: backAreaData,
                        after: currentAreaData,
                        backupStyle: prevPage.getAttribute('style')
                    });

                    // 当前页
                    needRunPages.push({
                        target: afterPage,
                        now: currentAreaData,
                        after: nextAreaData,
                        backupStyle: afterPage.getAttribute('style')
                    })

                    // 去除动画样式
                    needRunPages.forEach(e => {
                        e.target.style.transitionDuration = "0s";
                    });
                }
            });
            slideEle.on("touchmove", e => {
                e.preventDefault();

                let point = getPoint(e);
                let tx = point.clientX;

                // 获取百分比
                let percent = Math.abs(tx - startX) / innerWidth;

                // console.log("百分比 => ", percent);
                needRunPages.forEach(e => {
                    // 运行百分比修正
                    const { target, now, after } = e;
                    const now_transform = now.transform;

                    let fix_opacity = percentToValue(now.opacity, after.opacity, percent);
                    let fix_transform = after.transform.map((e, i) => percentToValue(now_transform[i], e, percent));

                    // console.log(after.opacity, now.opacity, fix_opacity);
                    // 根据百分比，计算当前进度
                    Object.assign(target.style, {
                        opacity: fix_opacity,
                        transform: `matrix3d(${fix_transform.join(',')})`
                    });
                });

                // 方向连贯的情况下才能下一页
                if ((tx - beforePointX) > 0 && percent > 0.1) {
                    canBack = true;
                } else {
                    canBack = false;
                }

                beforePointX = tx;
            });
            slideEle.on("touchend", e => {
                e.preventDefault();

                if (canBack) {
                    // 直接返回页面
                    app.back();
                }

                // 清空数据
                needRunPages.forEach(e => {
                    e.target.style.transitionDuration = "";
                    e.target.setAttribute('style', e.backupStyle);
                });
                needRunPages = [];
            });
        }

        // window.addEventListener("mousewheel", e => {
        //     console.log("mousewheel => ", e);
        //     if (e.webkitDirectionInvertedFromDevice) {
        //         e.preventDefault();
        //         // safari 触控板滚动
        //         if (e.deltaX == -1 && e.deltaY == 0) {
        //         }

        //         return false;
        //     }
        // });

        // 获取点对象
        const getPoint = e => e.changedTouches ? e.changedTouches[0] : e.targetTouches ? e.targetTouches[0] : e.touches[0];

        // 两个值间的百分比转化
        const percentToValue = (v1, v2, percent) => {
            return (v2 - v1) * percent + v1
        }

        // 获取元素transform 3d 的数组数据
        const getTrans3dArr = (transform) => {
            let pointArr;
            if (transform && transform !== "none") {
                let name = transform.replace(/(.+)\(.+\)/, "$1");
                pointArr = transform.replace(/.+\((.+)\)/, "$1").split(",").map(e => parseFloat(e.trim()));

                // 转3d
                if (name == "matrix") {
                    pointArr = [pointArr[0], pointArr[1], 0, 0, pointArr[2], pointArr[3], 0, 0, 0, 0, 1, 0, pointArr[4], pointArr[5], 0, 1];
                }
            } else {
                pointArr = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            }

            return pointArr;
        }

        // 获取元素的关键样式数据
        const getEleAreaData = (ele) => {
            const cStyle = getComputedStyle(ele);

            let { transform, opacity } = cStyle;

            let arr = getTrans3dArr(transform);

            return {
                transform: arr,
                opacity: parseFloat(opacity) || 0
            };
        }

        // 根据area name 获取关键样式数据
        const getAreaDataByName = (name) => {
            let fakePageEle = $(`<o-page page-area="${name}"></o-page>`).ele;
            app.ele.appendChild(fakePageEle);

            let areaData = getEleAreaData(fakePageEle);

            app.ele.removeChild(fakePageEle);

            return areaData;
        }

        // -----伪路由相关逻辑------
        if (needCache) {
            load("./cacheRouter.js").then(initCacheRouter => {
                initCacheRouter(app);
            })
        }
    }
});