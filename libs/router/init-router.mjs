export default function initRouter(app) {
  if (history.state && history.state.routerMode) {
    app.routers = history.state.routers;
  }

  if (!history.state && window.location.hash) {
    app.$("o-page")?.remove();

    app.goto(location.hash.replace("#", ""));
  }

  let isFixState = 0;
  let _isGoto;
  let _isBack;

  app.on("router-change", (e) => {
    let methodName = "pushState";
    switch (e.name) {
      case "replace":
        methodName = "replaceState";
      case "goto":
        const { routers } = app;
        const { pathname, search } = new URL(e.src, location.href);

        if (_isGoto) {
          _isGoto = null;
          return;
        }

        history[methodName](
          {
            routerMode: 1,
            routers,
          },
          "",
          `#${pathname}${search}`
        );
        break;
      case "back":
        if (_isBack) {
          _isBack = null;
          return;
        }

        isFixState = 1;
        history.go(-e.delta);

        console.log("back => ", e);
        break;
    }
  });

  let popstateFunc;
  window.addEventListener(
    "popstate",
    (popstateFunc = (e) => {
      const { state } = e;

      if (isFixState) {
        isFixState = 0;
        return;
      }

      if (!state) {
        _isBack = 1;
        app.back(app.routers.length - 1);
        return;
      }

      const { routers: hisRouters } = state;
      const { routers: appRouters } = app;

      if (hisRouters.length < appRouters.length) {
        // history back
        _isBack = 1;
        app.back(appRouters.length - hisRouters.length);
      } else if (hisRouters.length > appRouters.length) {
        // history forward
        const moreRouters = hisRouters.slice();

        const target = moreRouters.pop();

        if (moreRouters.length > appRouters.length) {
          const canPushRouters = moreRouters.slice(app._history.length);
          app._history.push(...canPushRouters);
        }

        _isGoto = 1;

        app.goto(target.src);
      } else {
        console.error(`o-router error occurred`);
      }
    })
  );

  return popstateFunc;
}
