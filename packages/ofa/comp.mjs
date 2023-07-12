import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { isFunction, toDashCase } from "../xhear/public.mjs";
import { dispatchLoad, initLink } from "./page.mjs";
import { fixRelateSource, resolvePath } from "./public.mjs";

const COMP = Symbol("Component");

Object.defineProperty($, "COMP", {
  value: COMP,
});

const cacheComps = {};

lm.use(["js", "mjs"], async ({ result: moduleData, url }, next) => {
  if (typeof moduleData !== "object" || moduleData.type !== COMP) {
    next();
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

  const { tag, temp, PATH } = { ...moduleData, ...finnalDefault };

  let tagName = tag;
  const matchName = url.match(/\/([^/]+)\.m?js$/);

  if (!tagName) {
    if (matchName) {
      tagName = toDashCase(matchName[1]);
    }
  }

  const cacheUrl = cacheComps[tagName];
  if (cacheUrl) {
    if (!(cacheUrl === url || cacheUrl === PATH)) {
      throw `${tagName} components have been registered`;
    }

    await next();
    return;
  }

  cacheComps[tagName] = url;

  let tempUrl, tempContent;

  if (/<.+>/.test(temp)) {
    tempUrl = url;
    tempContent = temp;
  } else {
    if (!temp) {
      if (tag) {
        tempUrl = resolvePath(`${tag}.html`, url);
      } else {
        tempUrl = resolvePath(`${matchName[1]}.html`, url);
      }
    } else {
      tempUrl = resolvePath(temp, url);
    }

    tempContent = await fetch(tempUrl).then((e) => e.text());
  }

  const registerOpts = {
    ...moduleData,
    ...finnalDefault,
  };

  const oldReady = registerOpts.ready;
  const { loaded } = registerOpts;
  registerOpts.ready = async function (...args) {
    oldReady && oldReady.apply(this, args);
    loaded && dispatchLoad(this, loaded);
    initLink(this);
  };

  $.register({
    ...registerOpts,
    tag: tagName,
    temp: fixRelateSource(tempContent, PATH || tempUrl),
  });

  await next();
});
