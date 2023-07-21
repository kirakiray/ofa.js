import $ from "../xhear/base.mjs";
import { fixRelate } from "./public.mjs";

// Get child elements within the target element that have the href or src attribute.
function hasNonProtocolElements(element) {
  const eles = element.querySelectorAll("[href], [src]");

  let hasNon = false;

  for (const target of eles) {
    ["href", "src"].forEach((k) => {
      const val = target.getAttribute(k);

      if (val && !/^(https?:)?\/\/\S+/i.test(val)) {
        hasNon = true;
      }
    });
  }

  return hasNon;
}

// Make connections within a shadow support link
const fixLink = async (_this) => {
  const $ele = $(_this);

  if (hasNonProtocolElements(_this)) {
    if (!$ele.host) {
      await new Promise((res) => setTimeout(res));
      if ($ele.host && $ele.host.tag === "o-page") {
        fixRelate(_this, $ele.host.src);
      } else {
        console.warn({
          target: _this,
          desc: "The element does not fulfill the condition of being corrected",
        });
        return;
      }
    }

    // Following the correction function on the extension
    const { link } = $.extensions;
    $ele.all("a").forEach((e) => link(e));
  }
};

$.extensions.render = (e) => {
  fixLink(e.target);
};

export const initLink = (_this) => {
  const $ele = $(_this);

  // olink click to amend
  $ele.on("click", (e) => {
    const { target } = e;

    if (target.attributes.hasOwnProperty("olink")) {
      if ($ele.app) {
        if (e.metaKey || e.shiftKey) {
          return;
        }
        e.preventDefault();

        if (target.tagName === "A") {
          const originHref = target.getAttribute("origin-href");
          // Prioritize the use of origin links
          $ele.app.goto(originHref || target.href);

          e.stopPropagation();
        }
      } else {
        console.warn("olink is only allowed within o-apps");
      }
    }
  });
};
