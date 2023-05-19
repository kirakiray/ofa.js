import "./comp.mjs";
import $ from "../xhear/base.mjs";

if (typeof window !== "undefined") {
  window.$ = $;
}

export default $;
