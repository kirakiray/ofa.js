import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";
import { convert } from "../xhear/render/render.mjs";
import { searchEle, isFunction } from "../xhear/public.mjs";
import {
  fixRelatePathContent,
  resolvePath,
  wrapErrorCall,
  getPagesData,
  createPage,
} from "./public.mjs";
import { initLink } from "./link.mjs";

import { drawUrl } from "./draw-template.mjs";
import { nextTick } from "../stanz/public.mjs";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +page *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    const url = await drawUrl(content, ctx.url);

    ctx.result = await lm()(`${url} .mjs`);
    ctx.resultContent = content;
  }

  await next();
});

lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
    await next();
    return;
  }

  const defaultsData = await getDefault(moduleData, url);

  let tempSrc = defaultsData.temp;

  if (!/<.+>/.test(tempSrc)) {
    if (!tempSrc) {
      tempSrc = url.replace(/\.m?js.*/, ".html");
    }

    await wrapErrorCall(
      async () => {
        defaultsData.temp = await fetch(tempSrc).then((e) => e.text());
      },
      {
        targetModule: import.meta.url,
        desc: `${url} module request for ${tempSrc} template page failed`,
      }
    );
  }

  ctx.result = defaultsData;

  await next();
});

$.register({
  tag: "o-page",
  attrs: {
    src: null,
  },
  watch: {
    async src(src) {
      if (src && !src.startsWith("//") && !/[a-z]+:\/\//.test(src)) {
        src = resolvePath(src);
        this.ele.setAttribute("src", src);
      }

      if (this.__init_src) {
        if (this.__init_src !== src) {
          throw "A page that has already been initialized cannot be set with the src attribute";
        }
        return;
      }

      if (!src) {
        return;
      }

      this.__init_src = src;

      if (this._defaults || this._pause_init) {
        return;
      }

      const pagesData = await getPagesData(src);

      const target = pagesData.pop();

      pagesData.forEach((e, i) => {
        const parentPage = createPage(e.src, e.defaults);

        if (this.parent) {
          this.wrap(parentPage);
        } else {
          const needWraps = this.__need_wraps || (this.__need_wraps = []);
          needWraps.push(parentPage);
        }
      });

      this._renderDefault(target.defaults);
    },
  },
  attached() {
    const needWraps = this.__need_wraps;
    if (needWraps) {
      needWraps.forEach((page) => {
        this.wrap(page);
      });
    }
  },
  proto: {
    async _renderDefault(defaults) {
      const { src } = this;

      if (this._defaults) {
        throw "The current page has already been rendered";
      }

      this._defaults = defaults;

      if (defaults.pageAnime) {
        this._pageAnime = defaults.pageAnime;
      }

      if (!defaults || defaults.type !== PAGE) {
        const err = new Error(
          `The currently loaded module is not a page \nLoaded string => '${src}'`
        );
        this.emit("error", { error: err });
        this.__reject(err);
        throw err;
      }

      const template = document.createElement("template");
      template.innerHTML = fixRelatePathContent(defaults.temp, src);
      const temps = convert(template);

      renderElement({
        defaults,
        ele: this.ele,
        template,
        temps,
      });

      await dispatchLoad(this, defaults.loaded);

      initLink(this.shadow);

      this._loaded = true;

      this.emit("page-loaded");

      this.__resolve();
    },
    back() {
      this.app.back();
    },
    goto(src) {
      this.app.goto(resolvePath(src, this.src));
    },
    replace(src) {
      this.app.replace(resolvePath(src, this.src));
    },
    get pageAnime() {
      const { app, _pageAnime } = this;

      const { pageAnime } = app?._module || {};

      return clone({ ...pageAnime, ...(_pageAnime || {}) });
    },
    set pageAnime(val) {
      this._pageAnime = val;
    },
  },

  ready() {
    this._rendered = new Promise((resolve, reject) => {
      this.__resolve = () => {
        delete this.__resolve;
        delete this.__reject;
        resolve();
      };
      this.__reject = () => {
        delete this.__resolve;
        delete this.__reject;
        reject();
      };
    });
  },
});

export const dispatchLoad = async (_this, loaded) => {
  const shadow = _this.ele.shadowRoot;
  if (shadow) {
    const srcEles = searchEle(shadow, `l-m,load-module`);
    await Promise.all(
      srcEles.map(
        (el) =>
          new Promise((res) => {
            el.addEventListener("load", (e) => {
              res();
            });
          })
      )
    );
  }

  if (loaded) {
    loaded.call(_this);
  }
};

export const getDefault = async (moduleData, oriUrl) => {
  let finnalDefault = {};

  const { default: defaultData, PATH } = moduleData;

  const url = PATH || oriUrl;

  const relateLoad = lm({
    url,
  });

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: relateLoad,
      url,
      get query() {
        const urlObj = new URL(url);
        return Object.fromEntries(Array.from(urlObj.searchParams.entries()));
      },
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = defaultData;
  }

  const defaults = {
    proto: {},
    ...moduleData,
    ...finnalDefault,
  };

  return defaults;
};
