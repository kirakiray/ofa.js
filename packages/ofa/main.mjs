import $ from "../xhear/base.mjs";
import "./inject-host.mjs";
import "./comp.mjs";
import "./page.mjs";
import "./app.mjs";
import "./link.mjs";

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

if (document.currentScript) {
  const isDebug = document.currentScript.attributes.hasOwnProperty("debug");

  Object.defineProperty($, "debugMode", {
    value: isDebug,
  });
}

if (typeof window !== "undefined") {
  window.$ = $;
}

export default $;
