((glo) => {
    "use strict";
    //<!--../Xhear/dist/xhear-->
    //<!--../drill.js/dist/drill-->

    const getRandomId = () => Math.random().toString(32).substr(2);
    const getType = value => Object.prototype.toString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = val => getType(val).includes("function");

    let globalcss = "";

    const CURRENTS = Symbol("currentPages");
    const APPNAVIGATE = "_navigate";

    // const PAGELOADED = Symbol("pageLoaded");
    const NAVIGATEDATA = Symbol("navigateData");
    const PAGEID = Symbol("pageId");
    const PAGEOPTIONS = Symbol("pageOptions");

    //<!--router-->

    drill.ext(base => {
        let {
            loaders, processors, main
        } = base;
        $.ext(({ renderEle }) => {
            //<!--xd-components-->
            //<!--xd-page-->
            //<!--xd-app-->
        })
    });

    drill.config({
        paths: {
            "@ofa/": "https://kirakiray.github.io/ofa_lib/dollar2/"
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
        version: 2000000
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