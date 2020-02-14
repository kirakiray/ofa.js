((glo) => {
    "use strict";
    //<!--../Xhear/dist/xhear-->
    //<!--../drill.js/dist/drill-->

    const getRandomId = () => Math.random().toString(32).substr(2);
    const getType = value => Object.prototype.toString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = val => getType(val).includes("function");

    let globalcss = "";

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
            "^\\$/": "https://kirakiray.github.io/ofa_lib/dollar2/"
        }
    });

    // 配置全局变量
    glo.ofa = {
        set globalcss(val) {
            globalcss = val;
        },
        get globalcss() {
            return globalcss;
        },
        drill,
        $,
        version: 2000000
    };
})(window);