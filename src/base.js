((glo) => {
    "use strict";
    //<!--../Xhear/dist/xhear-->
    //<!--../drill.js/dist/drill-->

    const getRandomId = () => Math.random().toString(32).substr(2);
    const getType = value => Object.prototype.toString.call(value).toLowerCase().replace(/(\[object )|(])/g, '');
    const isFunction = val => getType(val).includes("function");

    drill.ext(base => {
        let {
            loaders, processors, main
        } = base;

        //<!--xd-components-->
        //<!--xd-page-->
    });

    drill.config({
        paths: {
            "^\\$/": "https://kirakiray.github.io/xdframe_lib/dollar2/"
        }
    });

    // 配置全局变量
    glo.XDFrame = {
        drill,
        $,
        version: 2000000
    };
})(window);