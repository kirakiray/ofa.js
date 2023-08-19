import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { isFunction, toDashCase } from "../xhear/public.mjs";
import { dispatchLoad } from "./page.mjs";
import { drawUrl } from "./draw-template.mjs";
import { fixRelatePathContent, resolvePath } from "./public.mjs";
import { initLink } from "./link.mjs";
import { getRandomId } from "../stanz/public.mjs";

const COMP = Symbol("Component");

Object.defineProperty($, "COMP", {
  value: COMP,
});

const cacheComps = {};

lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +component *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    const url = await drawUrl(content, ctx.url, false);

    try {
      ctx.result = await lm()(`${url} .mjs`);
    } catch (err) {
      const error = new Error(`Error loading Component module: ${ctx.url}\n ${err.stack}`);

      throw error;
    }
    ctx.resultContent = content;
  }

  await next();
});

lm.use(["js", "mjs"], async ({ result: moduleData, url }, next) => {
  if (typeof moduleData !== "object" || moduleData.type !== COMP) {
    next();
    return;
  }

  let finnalDefault = {};

  const { default: defaultData, PATH } = moduleData;

  const path = PATH || url;

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: lm({
        url: path,
      }),
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = defaultData;
  }

  const { tag, temp } = { ...moduleData, ...finnalDefault };

  let tagName = tag;
  const matchName = path.match(/\/([^/]+)\.m?(js|htm|html)$/);

  if (!tagName) {
    if (matchName) {
      tagName = toDashCase(matchName[1]);
    }
  }

  const cacheUrl = cacheComps[tagName];
  if (cacheUrl) {
    if (path !== cacheUrl) {
      throw `${tagName} components have been registered`;
    }

    await next();
    return;
  }

  cacheComps[tagName] = path;

  let tempUrl, tempContent;

  if (/<.+>/.test(temp)) {
    tempUrl = path;
    tempContent = temp;
  } else {
    if (!temp) {
      tempUrl = resolvePath(`${matchName[1]}.html`, path);
    } else {
      tempUrl = resolvePath(temp, path);
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
    initLink(this.shadow);
  };

  let regTemp = fixRelatePathContent(tempContent, PATH || tempUrl);

  const fixResult = fixHostCSS(regTemp, tagName);

  if (fixResult) {
    regTemp = fixResult.temp;
    const { hostLinks } = fixResult;

    const { attached: oldAttached, detached: oldDetached } = registerOpts;

    Object.assign(registerOpts, {
      attached(...args) {
        const target = this.root;
        // Finds out if the item already exists; if not, adds it; if it does, adds a tag to it.
        const injectedLinks = [];

        hostLinks.forEach((link) => {
          let realLink;

          if (link.tagName === "LINK") {
            realLink = target.$(`link[href="${link.href}"][inject-host]`);
          } else {
            realLink = target.$(
              `style[inject-id="${link.getAttribute(
                "inject-id"
              )}"][inject-host]`
            );
          }

          if (realLink) {
            realLink = realLink.ele;
            realLink.__operators.push(this.ele);
          } else {
            realLink = link.cloneNode(true);
            realLink.__operators = [this.ele];
            if (target.ele === document) {
              target.$("head").push(realLink);
            } else {
              target.unshift(realLink);
            }
          }

          injectedLinks.push(realLink);
        });

        this.__injectedLinks = injectedLinks;

        oldAttached && oldAttached.call(this, ...args);
      },
      detached(...args) {
        const injectedLinks = this.__injectedLinks;
        this.__injectedLinks = null;
        if (injectedLinks) {
          injectedLinks.forEach((link) => {
            const operators = link.__operators;
            const targetIndex = operators.indexOf(this.ele);

            if (targetIndex > -1) {
              if (operators.length === 1) {
                link.remove();
              }
              operators.splice(targetIndex, 1);
            }
          });
        }

        oldDetached && oldDetached.call(this, ...args);
      },
    });
  }

  $.register({
    ...registerOpts,
    tag: tagName,
    temp: regTemp,
  });

  await next();
});

const fixHostCSS = (temp, tagName) => {
  const tempEl = $(`<template>${temp}</template>`);
  const links = tempEl.all("link,style");

  const hostLinks = [];

  links.forEach((e) => {
    if (typeof e.attr("host") === "string") {
      hostLinks.push(e.ele);
      e.remove();
      e.attr("host", null);
      e.attr("inject-host", "");

      if (e.tag === "style") {
        e.attr("inject-id", `${tagName}-${getRandomId()}`);
      }
    }
  });

  if (hostLinks.length) {
    return {
      hostLinks,
      temp: tempEl.html,
    };
  }
};
