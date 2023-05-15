((glo) => {
  "use strict";
  //<!--../Xhear/dist/toofa-->
  //<!--../drill.js/dist/drill-->
  //<!--component-->
  //<!--page-->
  //<!--app-->

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
    // Configure the base information
    get config() {
      return drill.config;
    },
    onState: {
      // Content displayed in loading
      loading(e) {
        return `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:14px;color:#aaa;">Loading</div>`;
      },
      // Contents of the load failure display
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
