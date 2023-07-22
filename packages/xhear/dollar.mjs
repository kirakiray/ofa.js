import { eleX, createXEle } from "./util.mjs";
import { getType } from "../stanz/public.mjs";

export default function $(expr) {
  if (getType(expr) === "string" && !/<.+>/.test(expr)) {
    const ele = document.querySelector(expr);

    return eleX(ele);
  }

  return createXEle(expr);
}

export const extensions = {
  render: (e) => {
    // console.log("extensions => ", e);
  },
};

Object.defineProperties($, {
  extensions: {
    value: extensions,
  },
});
