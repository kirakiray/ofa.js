((glo) => {
    "use strict";
    //<!--../Xhear/dist/xhear-->
    //<!--../drill.js/dist/drill-->
    const getRandomId = () => Math.random().toString(32).substr(2);
    const getType = value => Object.prototype.toString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = val => getType(val).includes("function");
    // function getQueryVariable(variable, query) {
    //     query = query || location.search.substring(1);
    //     let reVal = null;
    //     query.split("&").some(e => {
    //         var pair = e.split("=");
    //         if (pair[0] == variable) {
    //             reVal = pair[1];
    //             return true;
    //         }
    //     });
    //     return reVal;
    // }

    let globalcss = "";

    const CURRENTS = Symbol("currentPages");
    const APPNAVIGATE = "_navigate";

    const NAVIGATEDATA = Symbol("navigateData");
    const PAGEID = Symbol("pageId");
    const PAGEOPTIONS = Symbol("pageOptions");

    //<!--router-->
    //<!--router-slide-->

    drill.ext(base => {
        let {
            main
        } = base;
        $.ext(({ renderComponent }) => {
            //<!--o-components-->
            //<!--o-page-->
            //<!--o-app-->
        })
    });

    drill.config({
        paths: {
            // 有功能和质量要求的官方仓库
            "@ofa/": "https://kirakiray.github.io/ofa.js/lib/",
            // 无功能和质量限制的官方仓库
            "@libs/": "https://kirakiray.github.io/ofa_lib/v2/"
        }
    });

    // 配置全局变量
    const ofa = {
        set globalcss(val) {
            globalcss = val;
        },
        get globalcss() {
            return globalcss;
        },
        drill,
        $,
        get config() {
            return drill.config;
        },
        get offline() {
            return drill.offline;
        },
        set offline(val) {
            this.drill.offline = val;
        },
        get cacheInfo() {
            return this.drill.cacheInfo;
        },
        // 获取40页面的内容
        get404(e) {
            return `
            <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:300px;">
                <div style="margin-bottom:16px;width:45px;height:45px;font-size:30px;line-height:45px;border-radius:32px;text-align:center;font-weight:bold;background-color:#fb4747;color:#fff;">!</div>
                <div style="font-size:13px;color:#888;text-align:center;">
                Failed to load<br>
                path: <a style="color:#477efd;text-decoration: underline;" href="${e.path}" target="_blank">${e.path}</a> <br>
                src: <span style="color:#477efd;text-decoration: underline;">${e.src}</span>
                </div>
            </div>
            `;
        },
        v: "{{versionCode}}",
        version: "{{version}}"
    };

    let oldOfa = glo.ofa;

    const runOFA = (f) => getType(f).includes("function") && f();

    Object.defineProperties(glo, {
        ofa: {
            get() {
                return ofa;
            },
            set(val) {
                runOFA(val);
            }
        }
    });

    oldOfa && runOFA(oldOfa);

})(window);