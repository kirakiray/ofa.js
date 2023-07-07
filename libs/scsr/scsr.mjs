import initRouter from "../router/init-router.mjs";

(() => {
  async function ready() {
    const app = $("o-app");
    $("o-app template[page]").remove();

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
