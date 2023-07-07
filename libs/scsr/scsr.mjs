import initRouter from "../router/init-router.mjs";

(() => {
  async function ready() {
    const app = $("o-app");
    $("o-app template[page]").remove();

    app.on("page-loaded", (e) => {
      const { _defaults } = $(e.target);

      if (typeof _defaults.title === "string") {
        const titleEl = $("head title");
        titleEl && (titleEl.text = _defaults.title);
      }
    });

    app.push(`<o-page src="${location.pathname}"></o-page>`);

    initRouter(app, (pathname, search) => {
      return `${pathname}${search}`;
    });
  }

  if (document.readyState === "complete") {
    ready();
  } else {
    $(window).one("load", () => {
      ready();
    });
  }
})();
