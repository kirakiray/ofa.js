import $ from "../xhear/base.mjs";
import "./inject-host.mjs";
import "./comp.mjs";
import "./page.mjs";
import "./app.mjs";
import "./extend.mjs";
import "./link.mjs";

const version = "ofa.js@4.3.40";
$.version = version.replace("ofa.js@", "");

if (document.currentScript) {
  const isDebug = document.currentScript.attributes.hasOwnProperty("debug");

  Object.defineProperty($, "debugMode", {
    value: isDebug,
  });
}

if (typeof window !== "undefined") {
  window.$ = $;
}

Object.defineProperty(globalThis, "ofa", {
  value: $,
});

export default $;
