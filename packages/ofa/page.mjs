import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";
import { convert } from "../xhear/render/render.mjs";
import { isFunction, searchEle } from "../xhear/public.mjs";
import { fixRelateSource, resolvePath, wrapErrorCall } from "./public.mjs";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const initSrc = async (_this, val) => {
  if (_this.__init_src) {
    if (_this.__init_src !== val) {
      throw "A page that has already been initialized cannot be set with the src attribute";
    }
    return false;
  }

  if (!val) {
    return false;
  }

  _this.__init_src = val;

  const load = lm();

  const moduleData = await load(val);

  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  const selfUrl = resolvePath(val, document.location.href);

  const relateLoad = lm({
    url: selfUrl,
  });

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: relateLoad,
      url: selfUrl,
      get params() {
        const urlObj = new URL(selfUrl);
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

  return { selfUrl, defaults };
};

$.register({
  tag: "o-page",
  attrs: {
    src: null,
  },
  watch: {
    async src(val) {
      let result;

      if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
        val = resolvePath(val);
        this.ele.setAttribute("src", val);
      }

      await wrapErrorCall(
        async () => {
          result = await initSrc(this, val);
        },
        {
          self: this,
          desc: `Request for ${val} module failed`,
        }
      );

      if (result === false) {
        return;
      }

      const { selfUrl, defaults } = result;

      let tempSrc = defaults.temp;

      if (!/<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/.test(tempSrc)) {
        if (!tempSrc) {
          tempSrc = selfUrl.replace(/\.m?js.*/, ".html");
        }

        await wrapErrorCall(
          async () => {
            defaults.temp = await fetch(tempSrc).then((e) => e.text());
          },
          {
            self: this,
            desc: `${selfUrl} module request for ${tempSrc} template page failed`,
          }
        );
      }

      const template = document.createElement("template");
      template.innerHTML = fixRelateSource(defaults.temp, tempSrc);
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

      const { pageAnime } = app?._module?.defaults || {};

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
