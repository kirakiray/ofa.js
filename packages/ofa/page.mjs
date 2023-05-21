import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";
import { convert } from "../xhear/render/render.mjs";
import { isFunction } from "../xhear/public.mjs";
import { fixRelateSource, resolvePath } from "./public.mjs";

$.register({
  tag: "o-page",
  attrs: {
    src: null,
  },
  watch: {
    async src(val) {
      if (this.__init_src && this.__init_src !== val) {
        throw "A page that has already been initialized cannot be set with the src attribute";
      }

      if (!val) {
        return;
      }

      this.__init_src = val;

      const load = lm();

      const moduleData = await load(val);

      let finnalDefault = {};

      const { default: defaultData } = moduleData;

      const selfUrl = resolvePath(val, document.location.href);

      if (isFunction(defaultData)) {
        finnalDefault = await defaultData({
          load: lm({
            url: selfUrl,
          }),
          url: selfUrl,
          get params() {
            const urlObj = new URL(selfUrl);
            return Object.fromEntries(
              Array.from(urlObj.searchParams.entries())
            );
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

      let tempSrc = defaults.temp;

      if (!tempSrc) {
        tempSrc = selfUrl.replace(/\.m?js.*/, ".html");
      }

      defaults.temp = await fetch(tempSrc).then((e) => e.text());

      const template = document.createElement("template");
      template.innerHTML = fixRelateSource(defaults.temp, tempSrc);
      const temps = convert(template);

      renderElement({
        defaults,
        ele: this.ele,
        template,
        temps,
      });
    },
  },
  ready() {
    console.log("page ready =>");
  },
});
