import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";
import { convert } from "../xhear/render/render.mjs";
import { searchEle, isFunction } from "../xhear/public.mjs";
import { fixRelateSource, resolvePath, wrapErrorCall } from "./public.mjs";
import { eleX } from "../xhear/util.mjs";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

lm.use("page", async (ctx, next) => {
  if (!ctx.result) {
    const content = await fetch(ctx.url).then((e) => e.text());

    const url = getContentInfo(content, ctx.url);

    ctx.result = await lm()(`${url} .mjs`);
    ctx.resultContent = content;
  }

  await next();
});

lm.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +page *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    const url = getContentInfo(content, ctx.url);

    ctx.result = await lm()(`${url} .mjs`);
    ctx.resultContent = content;
  }

  await next();
});

// const strToBase64DataURI = (str) => `data:application/json;base64,${btoa(str)}`;

export function getContentInfo(content, url, isPage = true) {
  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  const fileContent = `
  export const type = ${isPage ? "$.PAGE" : "$.COMP"};
  export const PATH = '${url}';
  ${isPage && titleEl ? `export const title = '${titleEl.text}';` : ""}
  export const temp = \`${targetTemp.html.replace(/\s+$/, "")}\`;
  ${scriptEl ? scriptEl.html : ""}`;

  const file = new File(
    [fileContent],
    location.pathname.replace(/.+\/(.+)/, "$1"),
    { type: "text/javascript" }
  );

  return URL.createObjectURL(file);
}

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
    async src(val) {
      if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
        val = resolvePath(val);
        this.ele.setAttribute("src", val);
      }

      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw "A page that has already been initialized cannot be set with the src attribute";
        }
        return;
      }

      if (!val) {
        return;
      }

      this.__init_src = val;

      const load = lm();

      let defaults;

      await wrapErrorCall(
        async () => {
          const ctx = await load(`${val} -ctx`);
          const { resultContent } = ctx;

          const tempEl = $({ tag: "template" });
          tempEl.html = resultContent;

          defaults = ctx.result;
          // defaults = await load(val);
        },
        {
          self: this,
          desc: `Request for ${val} module failed`,
        }
      );

      if (!defaults || defaults.type !== PAGE) {
        const err = new Error(
          `The currently loaded module is not a page \nLoaded string => '${val}'`
        );
        this.emit("error", { error: err });
        throw err;
      }

      const parentPath = defaults.parent;

      if (parentPath) {
        await new Promise((resolve) => {
          const newParentPath = resolvePath(parentPath, val);

          // Passing $ is an element generated within the template and does not depart from the component's registered functions.
          // const parentPage = $(`<o-page src="${newParentPath}"></o-page>`);
          let parentPage = document.createElement("o-page");
          parentPage = eleX(parentPage);
          parentPage.src = newParentPath;

          this.wrap(parentPage);

          if (parentPage._loaded) {
            resolve();
            return;
          }

          parentPage.one("page-loaded", resolve);
        });
      }

      this._defaults = defaults;

      const template = document.createElement("template");
      template.innerHTML = fixRelateSource(defaults.temp, val);
      const temps = convert(template);

      renderElement({
        defaults,
        ele: this.ele,
        template,
        temps,
      });

      await dispatchLoad(this, defaults.loaded);

      this._loaded = true;

      this.emit("page-loaded");

      initLink(this);
    },
  },
  proto: {
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
});

export const initLink = (_this) => {
  _this.shadow.on("click", (e) => {
    const { target } = e;
    if (
      _this.app &&
      target.tagName === "A" &&
      target.attributes.hasOwnProperty("olink")
    ) {
      if (e.metaKey || e.shiftKey) {
        return;
      }
      e.preventDefault();
      _this.app.goto(target.href);
    }
  });
};

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
