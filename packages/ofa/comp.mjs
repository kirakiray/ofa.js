import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { isFunction, toDashCase } from "../xhear/public.mjs";
import { resolvePath } from "./public.mjs";

const COMP = Symbol("Component");

Object.defineProperty($, "COMP", {
  value: COMP,
});

lm.use(async ({ data: moduleData, url }) => {
  if (typeof moduleData !== "object" || moduleData.type !== COMP) {
    return;
  }

  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: lm({
        url,
      }),
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = defaultData;
  }

  const { tag, temp } = { ...moduleData, ...finnalDefault };

  let tagName = tag;
  const matchName = url.match(/\/([^/]+)\.m?js$/);

  if (!tagName) {
    if (matchName) {
      tagName = toDashCase(matchName[1]);
    }
  }

  let tempUrl;
  if (!temp) {
    if (tag) {
      tempUrl = resolvePath(`${tag}.html`, url);
    } else {
      tempUrl = resolvePath(`${matchName[1]}.html`, url);
    }
  } else {
    tempUrl = resolvePath(temp, url);
  }

  const tempContent = await fetch(tempUrl).then((e) => e.text());

  $.register({
    ...moduleData,
    ...finnalDefault,
    tag: tagName,
    temp: tempContent,
  });
});
