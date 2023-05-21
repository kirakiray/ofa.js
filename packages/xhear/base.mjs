import { eleX, createXEle } from "./util.mjs";
import { render, convert } from "./render/render.mjs";
import Xhear from "./main.mjs";
import stanz from "../stanz/base.mjs";
import { getType } from "../stanz/public.mjs";
import { register } from "./register.mjs";
import { searchEle } from "./public.mjs";

export default function $(expr) {
  if (getType(expr) === "string" && !/<.+>/.test(expr)) {
    const ele = document.querySelector(expr);

    return eleX(ele);
  }

  return createXEle(expr);
}

Object.assign($, {
  stanz,
  render,
  convert,
  register,
  fn: Xhear.prototype,
  all: (expr) => searchEle(document, expr).map(eleX),
});
