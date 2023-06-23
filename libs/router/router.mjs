import { getRandomId } from "../../packages/stanz/public.mjs";

const FIXBODY = `f-${getRandomId()}`;

$.register({
  tag: "o-router",
  temp: `<style>:host{display:block;width:100%;height:100%;overflow:hidden}::slotted(o-app){display:block;width:100%;height:100%}</style><slot></slot>`,
  attrs: {
    fixBody: null,
  },
  watch: {
    fixBody(val) {
      if (val !== null) {
        const styleEle = document.createElement("style");
        styleEle.setAttribute(FIXBODY, "");
        styleEle.innerHTML = `html,body{margin:0;padding:0;width:100%;height:100%;}`;
        document.head.append(styleEle);
      } else {
        const target = document.head.querySelector(FIXBODY);
        if (target) {
          target.remove();
        }
      }
    },
  },
  attached() {
    const app = this.$("o-app");

    if (history.state && history.state.routerMode) {
      app.routers = history.state.routers;
    }

    let isFixState = 0;

    this.on("router-change", (e) => {
      switch (e.name) {
        case "goto":
          const { routers } = app;
          const { pathname, search } = new URL(e.src);

          if (this._isGoto) {
            delete this._isGoto;
            return;
          }

          history.pushState(
            {
              routerMode: 1,
              routers,
            },
            "",
            `#${pathname}${search}`
          );
          break;
        case "back":
          if (this._isBack) {
            delete this._isBack;
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
          this._isBack = 1;
          app.back(app.routers.length - 1);
          return;
        }

        const { routers: hisRouters } = state;
        const { routers: appRouters } = app;

        if (hisRouters.length < appRouters.length) {
          // history back
          this._isBack = 1;
          app.back(appRouters.length - hisRouters.length);
        } else if (hisRouters.length > appRouters.length) {
          // history forward
          const moreRouters = hisRouters.slice();

          const target = moreRouters.pop();

          if (moreRouters.length > appRouters.length) {
            const canPushRouters = moreRouters.slice(app._history.length);
            app._history.push(...canPushRouters);
          }

          this._isGoto = 1;

          app.goto(target.src);
        } else {
          console.error(`o-router error occurred`);
        }
      })
    );

    this._popstateFunc = popstateFunc;
  },
  detached() {
    if (this._popstateFunc) {
      window.removeEventListener("popstate", this._popstateFunc);
    }
  },
});
