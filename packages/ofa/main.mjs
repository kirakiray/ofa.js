import $ from "../xhear/base.mjs";
import { isDebug } from "../stanz/public.mjs";
import "./inject-host.mjs";
import "./comp.mjs";
import "./page.mjs";
import "./app.mjs";
import "./extend.mjs";
import "./link.mjs";
import "./context.mjs";

const version = "ofa.js@4.5.5";
$.version = version.replace("ofa.js@", "");

if (document.currentScript) {
  Object.defineProperty($, "debugMode", {
    get: () => isDebug.value,
  });
}

if (typeof window !== "undefined") {
  window.$ = $;
}

Object.defineProperty(globalThis, "ofa", {
  value: $,
});

export default $;
