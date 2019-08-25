((glo) => {
    "use strict";
    //<!--../Xhear/dist/xhear-->
    //<!--../drill.js/dist/drill-->

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