((glo) => {
    "use strict";
    //<!--../Xhear/dist/toofa-->
    //<!--../drill.js/dist/drill-->
    //<!--component-->
    //<!--page-->
    //<!--app-->
    //<!--address-->

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
                return `<div style="text-align:center;"><h2>load Error</h2><div style="color:#aaa;">${e.error.desc} <br>${e.src}</div></div>`;
            }
        }
    };

    defineProperties(glo, {
        ofa: {
            set(val) {
                val(ofa);
            },
            get() {
                return ofa;
            }
        }
    });

    init_ofa && init_ofa(ofa);

    glo.$ = $;
})(window);