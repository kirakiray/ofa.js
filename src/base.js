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
        get config() {
            return drill.config;
        },
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