(() => {
  async function ready() {
    const app = $("o-app");
    $("o-app template[page]").remove();
    app.push(`<o-page src="${location.pathname}"></o-page>`);

    app.on("router-change", (e) => {
      const { src, name } = e;

      if (name === "goto") {
        history.pushState({}, "", src);
      } else if (name === "replace") {
      }

      console.log("change => ", e);
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
