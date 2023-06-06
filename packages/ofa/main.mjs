import "./comp.mjs";
import "./page.mjs";
import "./app.mjs";
import $ from "../xhear/base.mjs";

$.fn.extend({
  get app() {
    let target = this;

    while (target && target !== "o-app") {
      if (target.tag === "o-page") {
        const result = target.parents.find((el) => el.tag === "o-app");

        if (result) {
          target = result;
          break;
        }
      }

      target = target.host;

      if (!target) {
        break;
      }
    }

    return target;
  },
});

if (typeof window !== "undefined") {
  window.$ = $;
}

export default $;
