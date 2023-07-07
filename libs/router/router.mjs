import { getRandomId } from "../../packages/stanz/public.mjs";
import initRouter from "./init-router.mjs";

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
    this._popstateFunc = initRouter(this.$("o-app"));
  },
  detached() {
    if (this._popstateFunc) {
      window.removeEventListener("popstate", this._popstateFunc);
    }
  },
});
