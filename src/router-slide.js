// 滑动型虚拟路由，仿apple系操作
// 获取相应class的关键有样式
const getPageAnimeData = (animeName, defaultType) => {
    let fakeDiv = animeName;
    let appendInBody = false;
    if (!(animeName instanceof Element)) {
        appendInBody = true;
        fakeDiv = document.createElement("div");
        // fakeDiv.classList.add("xdpage");
        fakeDiv.setAttribute("xd-page-anime", animeName);
        // $("xd-app").push(fakeDiv);
        $("body").push(fakeDiv);
    }

    let animeData = {};
    let complteStyle = getComputedStyle(fakeDiv);

    // 提取关键元素
    ["opacity"].forEach(k => {
        animeData[k] = complteStyle[k];
    });

    // transform单独抽取
    let transformData = {
        t: defaultType || "2d"
    };
    if (complteStyle.transform && complteStyle.transform != "none") {
        if (complteStyle.transform == "matrix3d") {
            transformData.t = "3d";
        }

        // 获取关键数据，并转换为数组
        transformData.a = complteStyle.transform.replace(/matrix\((.+)\)/, "$1").split(",").map(e => parseFloat(e.trim()))
    }

    if (transformData.t == "2d" && !transformData.a) {
        // 默认2维数据就是这几个
        transformData.a = [1, 0, 0, 1, 0, 0];
    } else if (transformData.t == "3d" && !transformData.a) {
        transformData.a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    // 强行将2d转为3d
    if (transformData.t == "2d") {
        let old_a = transformData.a;
        transformData.t = "3d";
        transformData.a = [old_a[0], old_a[1], 0, 0, old_a[2], old_a[3], 0, 0, 0, 0, 1, 0, old_a[4], old_a[5], 0, 1];
    }

    // 删除样式
    if (appendInBody) {
        fakeDiv.remove();
    }

    // 设置transform数据
    animeData.transform = transformData;

    return animeData;
}

// pageParam转css样式对象
const pageParamToStyle = pageParam => {
    let reobj = Object.assign({}, pageParam);

    // 主要转换transform
    let { transform } = pageParam;
    switch (transform.t) {
        case "2d":
            reobj.transform = `matrix(${transform.a.join(",")})`;
            break;
        case "3d":
            reobj.transform = `matrix3d(${transform.a.join(",")})`;
            break;
    }

    return reobj;
}

// 根据当前页状态、下一步状态和当前进度，计算当前进度pageParam数据
const animeByPrecent = (nowParam, nextParam, precent) => {
    let pageParam = {};

    Object.keys(nowParam).forEach(k => {
        if (k === "transform") {
            // transform 单独处理
            return;
        }

        // 后缀
        let suffix = nowParam[k].replace(/[\d\.]+(\D*)/, "$1");

        // 带px的修正px
        let now = parseFloat(nowParam[k]);
        let next = parseFloat(nextParam[k]);

        pageParam[k] = (next - now) * precent + now + suffix;
    });

    let now_trans = nowParam.transform;
    let next_trans = nextParam.transform;

    if (now_trans && next_trans) {
        // 确保类型一致
        if (now_trans.t !== next_trans.t) {
            console.error("animeByPrecent transform type unequal");
            return;
        }

        let trans = pageParam.transform = {
            t: now_trans.t,
            a: []
        };

        now_trans.a.forEach((now, i) => {
            let next = next_trans.a[i];
            trans.a.push((next - now) * precent + now);
        });
    }

    return pageParam;
}

const getPoint = e => e.changedTouches ? e.changedTouches[0] : e.targetTouches ? e.targetTouches[0] : e.touches[0];

const initSlideRouter = (app) => {
    if (app.router != "slide") {
        return;
    }

    // 公用软路由初始化
    fakeRouter(app);

    const LEFT = "_left" + getRandomId(), RIGHT = "_right" + getRandomId();
    // 在全局加入两个边缘监听元素
    $('head').push(`<style>#${LEFT},#${RIGHT}{position:fixed;z-index:10000;left:0;top:0;width:20px;height:100%;background-color:rgba(255,0,0,0);}#${RIGHT}{left:auto;right:0;}</style>`);

    let leftPannel = $(`<div id="${LEFT}"></div>`);
    // let rightPannel = $(`<div id="${RIGHT}"></div>`);

    $("body").push(leftPannel);
    // $("body").push(rightPannel);

    // slidePage使用的页面元素
    // let prevPage, currentPage;
    // let prevPageBackParam, prevPageActiveParam, currentPageFrontParam, currentPageActiveParam;

    // 需要修正动画的页面
    let needFixPages = [];

    // 构建动画函数
    const buildSlidePage = () => {
        // 清空数据
        needFixPages.length = 0;

        if (app.currents.length <= 1) {
            // 只有首页的情况就没有滑动动画了
            return;
        }

        // 遍历所有页面，提取并设置好编译状态
        let curs = app.currents.map(e => {
            let obj = e.object;
            obj.page = e._page;
            return obj;
        });

        let lastId = curs.length - 1;
        curs.forEach((pageData, index) => {
            let { page } = pageData;
            let { animeParam } = page;
            let backAnimes = animeParam.back;

            // 当前页动画数据获取
            if (index == lastId) {
                needFixPages.push({
                    currentAnimeParam: getPageAnimeData(page.animeParam.current),
                    nextAnimeParam: getPageAnimeData(page.animeParam.front),
                    page
                });
                return;
            } else {
                // 相应页面前一页的动画设定
                let targetAnimeName = lastId - index - 2 < 0 ? animeParam.current : backAnimes[lastId - index - 2];
                if (targetAnimeName) {
                    needFixPages.push({
                        currentAnimeParam: getPageAnimeData(backAnimes[lastId - index - 1]),
                        nextAnimeParam: getPageAnimeData(targetAnimeName),
                        page
                    });
                }
            }
        });
    }

    // 监听滑动
    let startX, aWidth = app.width;
    // 前一个触控点，判断方向用的
    let beforePointX;
    leftPannel.on("touchstart", e => {
        e.preventDefault();

        if (!needFixPages.length) return;

        let point = getPoint(e.originalEvent);
        beforePointX = startX = point.clientX;

        needFixPages.forEach(e => {
            // 提前记忆style属性
            e._beforeStyle = e.page.attrs.style;
            // 清空动画，避免影响touchmove的操作
            e.page.style.transition = "none";
        });
    });
    let canBack = false;
    leftPannel.on("touchmove", e => {
        e.preventDefault();

        if (!needFixPages.length) return;

        let point = getPoint(e.originalEvent);
        let tx = point.clientX;

        // 获取百分比
        let percent = Math.abs(tx - startX) / aWidth;

        // 修正实时样式
        needFixPages.forEach(e => {
            let nowPagePram = animeByPrecent(e.currentAnimeParam, e.nextAnimeParam, percent);
            let nowPageStyle = pageParamToStyle(nowPagePram);
            Object.assign(e.page.style, nowPageStyle)
        });

        // 方向连贯的情况下才能下一页
        if ((tx - beforePointX) > 0 && percent > 0.1) {
            canBack = true;
        } else {
            canBack = false;
        }

        beforePointX = tx;
    });
    leftPannel.on("touchend", e => {
        e.preventDefault();

        if (!needFixPages.length) return;

        // 还原style
        needFixPages.forEach(e => {
            // 清空动画和样式，默认情况下会还原操作
            e.page.attrs.style = e._beforeStyle;
        });

        if (canBack) {
            // 直接返回页面
            app.back();
        }
    });

    app.watch("currents", e => {
        setTimeout(() => buildSlidePage(), 100);
    });

    // 启动构建
    setTimeout(() => buildSlidePage(), 100);
}