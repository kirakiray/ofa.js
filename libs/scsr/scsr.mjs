(() => {
  async function ready() {
    $("o-app template[page]").remove();
    $("o-app").push(`<o-page src="${location.pathname}"></o-page>`);
  }

  if (document.readyState === "complete") {
    ready();
  } else {
    $(window).one("load", () => {
      ready();
    });
  }
})();
