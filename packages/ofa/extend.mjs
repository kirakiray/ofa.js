import $ from "../xhear/base.mjs";
import { isFunction } from "../xhear/public.mjs";
import { COMPONENT_PATH } from "./comp.mjs";

const oldAttr = $.fn.attr;

function attr(...args) {
  let [name, value, options] = args;

  if (isFunction(value)) {
    value = value();
  }

  const { host } = this;

  if (host && ["href", "src"].includes(name) && /^\./.test(value)) {
    const { PATH } = host;

    if (PATH) {
      const { href } = new URL(value, PATH);

      return oldAttr.call(this, name, href);
    }
  }

  return oldAttr.call(this, ...args);
}

attr.always = oldAttr.always;

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
  get PATH() {
    // component or page file path
    return this[COMPONENT_PATH] || this.src || null;
  },
  attr,
});
