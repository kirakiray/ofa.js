// 滑动型虚拟路由，仿apple系操作
// 获取相应class的关键有样式
const getPageAnimeData = (animeName, defaultType) => {
    let fakeDiv = animeName;
    let appendInBody = false;
    if (!(animeName instanceof Element)) {
        appendInBody = true;
        fakeDiv = document.createElement("div");
        fakeDiv.setAttribute("xd-page-anime", animeName);
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

        let now = parseFloat(nowParam[k]);
        let next = parseFloat(nextParam[k]);

        pageParam[k] = (next - now) * precent + now;
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
    $('head').push(`<style>#${LEFT},#${RIGHT}{position:fixed;z-index:10000;left:0;top:0;width:40px;height:100%;background-color:rgba(255,0,0,.1);}#${RIGHT}{left:auto;right:0;}</style>`);

    let leftPannel = $(`<div id="${LEFT}"></div>`);
    // let rightPannel = $(`<div id="${RIGHT}"></div>`);

    $("body").push(leftPannel);
    // $("body").push(rightPannel);

    // slidePage使用的页面元素
    let prevPage, currentPage;
    let prevPageBackParam, prevPageActiveParam, currentPageFrontParam, currentPageActiveParam;
    // 构建动画函数
    const buildSlidePage = () => {
        // 确认存在两个以上的页面
        if (app.currentPages.length >= 2) {
            [prevPage, currentPage] = app.currentPages.slice(-2);

            prevPageBackParam = getPageAnimeData(prevPage.ele);
            prevPageActiveParam = getPageAnimeData(prevPage.animeParam.current);
            currentPageFrontParam = getPageAnimeData(currentPage.animeParam.front);
            currentPageActiveParam = getPageAnimeData(currentPage.animeParam.current);
        } else {
            // 没有两个页面就清空
            currentPage = prevPage = null;
        }
    }

    // 监听滑动
    // let count = 1000;
    let startX, aWidth = app.width;
    // 前一个触控点，判断方向用的
    let beforePointX;
    leftPannel.on("touchstart", e => {
        e.preventDefault();

        // 在存在 prevPage 的情况下才执行
        if (!prevPage || !currentPage) {
            return;
        }

        let point = getPoint(e.originalEvent);
        beforePointX = startX = point.clientX;

        // 提前记忆style属性
        currentPage._beforeStyle = currentPage.attrs.style;
        prevPage._beforeStyle = prevPage.attrs.style;

        // 清空动画
        currentPage.style.transition = "none";
        prevPage.style.transition = "none";

        // count = 1000;
    });
    let canNext = false;
    leftPannel.on("touchmove", e => {
        e.preventDefault();

        // 在存在 prevPage 的情况下才执行
        if (!prevPage || !currentPage) {
            return;
        }

        // leftPannel.html = count++;
        let point = getPoint(e.originalEvent);
        let tx = point.clientX;

        // 获取百分比
        let percent = Math.abs(tx - startX) / aWidth;

        let nowPagePram = animeByPrecent(currentPageActiveParam, currentPageFrontParam, percent);
        let nowPageStyle = pageParamToStyle(nowPagePram);
        Object.assign(currentPage.style, nowPageStyle);

        let prevPagePram = animeByPrecent(prevPageBackParam, prevPageActiveParam, percent);
        let prevPageStyle = pageParamToStyle(prevPagePram);
        Object.assign(prevPage.style, prevPageStyle);

        // 方向连贯的情况下才能下一页
        if ((tx - beforePointX) > 0 && percent > 0.1) {
            canNext = true;
        } else {
            canNext = false;
        }

        beforePointX = tx;
    });
    leftPannel.on("touchend", e => {
        e.preventDefault();

        // 在存在 prevPage 的情况下才执行
        if (!prevPage || !currentPage) {
            return;
        }

        // 清空动画和样式，默认情况下会还原操作
        currentPage.attrs.style = currentPage._beforeStyle;
        prevPage.attrs.style = prevPage._beforeStyle;

        if (canNext) {
            // 直接返回页面
            app.back();
        }
    });
    app.on("navigate", e => {
        setTimeout(() => buildSlidePage(), 100);
    })

    // 启动构建
    setTimeout(() => buildSlidePage(), 100);
}