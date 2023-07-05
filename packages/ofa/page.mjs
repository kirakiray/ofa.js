import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";
import { convert } from "../xhear/render/render.mjs";
import { searchEle } from "../xhear/public.mjs";
import { fixRelateSource, resolvePath, wrapErrorCall } from "./public.mjs";
import { getDefault } from "./app.mjs";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

lm.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
    await next();
    return;
  }

  const defaultsData = await getDefault(moduleData, url);

  let tempSrc = defaultsData.temp;

  if (!/<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/.test(tempSrc)) {
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
          defaults = await load(val);
        },
        {
          self: this,
          desc: `Request for ${val} module failed`,
        }
      );

      const template = document.createElement("template");
      template.innerHTML = fixRelateSource(defaults.temp, val);
      const temps = convert(template);

      renderElement({
        defaults,
        ele: this.ele,
        template,
        temps,
      });

      dispatchLoad(this, defaults.loaded);
    },
  },
  proto: {
    back() {
      this.app.back();
    },
    goto(src) {
      this.app.goto(new URL(src, this.src).href);
    },
    replace(src) {
      this.app.replace(new URL(src, this.src).href);
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
