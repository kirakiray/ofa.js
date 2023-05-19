import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { renderElement } from "../xhear/register.mjs";

// const PAGE = Symbol("Page");

// Object.defineProperty($, "PAGE", {
//   value: PAGE,
// });

// lm.use(async ({ data: moduleData, url }) => {
//   if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
//     return;
//   }

//   debugger;
// });

$.register({
  tag: "o-page",
  attrs: {
    src: null,
  },
  watch: {
    async src(val) {
      if (this.__init_src) {
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

      if (isFunction(defaultData)) {
        finnalDefault = await defaultData({
          load: lm({
            url,
          }),
        });
      } else if (defaultData instanceof Object) {
        finnalDefault = defaultData;
      }

      renderElement({
        defaults,
        ele: this,
        template,
        temps,
      });
    },
  },
  ready() {
    console.log("page ready =>");
  },
});
