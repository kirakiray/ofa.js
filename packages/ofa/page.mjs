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
  ISERROR,
} from "./public.mjs";
import { initLink } from "./link.mjs";

import { drawUrl } from "./draw-template.mjs";

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
    try {
      const url = await drawUrl(content, ctx.url);
      ctx.result = await lm()(`${url} .mjs --real:${ctx.url}`);
    } catch (error) {
      const err = new Error(
        `Error loading Page module: ${ctx.url}\n ${error.stack}`
      );
      err.error = error;
      throw err;
    }
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
    if (tempSrc) {
      tempSrc = resolvePath(tempSrc, url);
    } else {
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
      if (!src) {
        return;
      }

      if (!src.startsWith("//") && !/[a-z]+:\/\//.test(src)) {
        src = resolvePath(src);
        this.src = src;
        return;
      }

      if (this.__init_src) {
        if (this.__init_src !== src) {
          throw "A page that has already been initialized cannot be set with the src attribute";
        }
        return;
      }

      this.__init_src = src;

      if (this._defaults || this._pause_init) {
        return;
      }

      const pagesData = await getPagesData(src);

      if (this._defaults) {
        // debugger;
        return;
      }

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

      if (target.ISERROR === ISERROR) {
        const failContent = getFailContent(
          src,
          target,
          this?.app?._module?.fail
        );

        this._renderDefault({
          type: PAGE,
          temp: failContent,
        });
      } else {
        this._renderDefault(target.defaults);
      }
    },
  },
  attached() {
    this.css.display = "block";

    const needWraps = this.__need_wraps;
    if (needWraps) {
      needWraps.forEach((page) => {
        this.wrap(page);
      });
      delete this.__need_wraps;
    }

    if (this.__not_run_attached) {
      if (this._defaults.attached) {
        this._defaults.attached.call(this);
      }
      delete this.__not_run_attached;
    }
  },
  detached() {
    const { _defaults } = this;

    if (_defaults && _defaults.detached) {
      _defaults.detached.call(this);
    }
  },
  proto: {
    async _renderDefault(defaults) {
      const { src } = this;

      if (this._defaults) {
        throw new Error("The current page has already been rendered");
      }

      this._defaults = defaults;

      if (defaults.pageAnime) {
        this._pageAnime = defaults.pageAnime;
      }

      if (!defaults || defaults.type !== PAGE) {
        const err = new Error(
          `The currently loaded module is not a page \nLoaded string => '${src}'`
        );
        this.emit("error", { data: { error: err } });
        this.__reject(err);
        throw err;
      }

      const template = document.createElement("template");
      template.innerHTML = fixRelatePathContent(defaults.temp, src);
      const temps = convert(template);

      try {
        renderElement({
          defaults,
          ele: this.ele,
          template,
          temps,
        });
      } catch (error) {
        const err = new Error(`Failed to render page:${src} \n ${error.stack}`);
        err.error = error;
        console.error(err);
      }

      await dispatchLoad(this, defaults.loaded);

      initLink(this.shadow);

      this._loaded = true;

      this.emit("page-loaded");

      this.__resolve();

      if (this.ele.isConnected) {
        if (defaults.attached) {
          defaults.attached.call(this);
        }
      } else {
        this.__not_run_attached = 1;
      }
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
    const pms = srcEles.map(
      (el) =>
        new Promise((res) => {
          el.addEventListener("load", (e) => {
            res();
          });
        })
    );

    const links = searchEle(shadow, `link`);

    links.forEach((link) => {
      if (link.rel === "stylesheet") {
        pms.push(
          new Promise((res) => {
            let resolve = () => {
              clearInterval(timer);
              link.removeEventListener("load", resolve);
              link.removeEventListener("error", resolve);
              res();
            };
            const timer = setInterval(() => {
              if (!link.parentNode) {
                resolve();
              }
            }, 100);

            if (link.sheet) {
              resolve();
            } else {
              link.addEventListener("load", resolve);
              link.addEventListener("error", resolve);
            }
          })
        );
      }
    });

    await Promise.all(pms);
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
    finnalDefault = { ...defaultData };
  }

  const defaults = {
    proto: {},
    ...moduleData,
    ...finnalDefault,
  };

  return defaults;
};

export const getFailContent = (src, target, fail) => {
  let failContent;

  if (fail) {
    failContent = fail({
      src,
      error: target.error,
    });
  } else {
    failContent = `<div style="padding:20px;color:red;">${target.error.stack
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;")}</div>`;
  }

  return failContent;
};
