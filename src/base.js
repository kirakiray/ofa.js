((glo) => {
    "use strict";
    //<!--../Xhear/dist/toofa-->
    //<!--../drill.js/dist/drill-->
    //<!--component-->
    //<!--page-->
    //<!--app-->
    //<!--message-->

    $.fn.extend({
        get page() {
            let host = this;
            while (host && !host.is("o-page")) {
                host = host.host;
            }
            return host;
        },
    });

    let init_ofa = glo.ofa;

    const ofa = {
        v: "{{versionCode}}",
        version: "{{version}}",
        // 配置基础信息
        get config() {
            return drill.config;
        },
        onState: {
            // 加载中临时模板callback
            loading(e) {
                return `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:14px;color:#aaa;">Loading</div>`;
            },
            // 加载失败的临时模板
            loadError(e) {
                return `<div style="text-align:center;"><h2>load Error</h2><div style="color:#aaa;">error expr:${e.expr} <br>error src:${e.src}</div></div>`;
            },
        },
        get apps() {
            return apps.slice();
        },
    };

    defineProperties(glo, {
        ofa: {
            set(val) {
                val(ofa);
            },
            get() {
                return ofa;
            },
        },
    });

    init_ofa && init_ofa(ofa);

    drill.config({
        paths: {
            "@lib/": "https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/lib/",
        },
    });

    glo.$ = $;
})(window);
