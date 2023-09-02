/**
 * `x-if` first replaces all neighboring conditional elements with token elements and triggers the rendering process once; the rendering process is triggered again after each `value` change.
 * The rendering process is as follows:
 * 1. First, collect all conditional elements adjacent to `x-if`.
 * 2. Mark these elements and wait for the `value` of each conditional element to be set successfully before proceeding to the next step.
 * 3. Based on the marking, perform a judgment operation asynchronously, the element that satisfies the condition first will be rendered; after successful rendering, the subsequent conditional elements will clear the rendered content.
 */

import { dataRevoked } from "../../stanz/public.mjs";
import { register } from "../register.mjs";
import { eleX, revokeAll } from "../util.mjs";
import { FakeNode } from "./fake-node.mjs";
import { render } from "./render.mjs";

const regOptions = {
  data: {
    value: null,
    __rendered: false,
  },
  watch: {
    value() {
      if (!this._bindend) {
        return;
      }

      this.refreshValue();
    },
  },
  proto: {
    refreshValue() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        const conditions = [this, ...this._others];

        let isOK = false;

        conditions.forEach((conditionEl) => {
          if (isOK) {
            // A success condition has preceded it, and any subsequent conditional elements should be clear
            conditionEl._clearContent();
            return;
          }

          if (conditionEl.value || conditionEl.tag === "x-else") {
            isOK = true;
            conditionEl._renderContent();
          } else {
            conditionEl._clearContent();
          }
        });

        eleX(this._fake.parentNode).refresh();
      }, 0);
    },
    _renderContent() {
      if (this.__rendered) {
        return;
      }
      this.__rendered = true;

      const result = getRenderData(this._fake);

      if (!result) {
        return;
      }

      const { target, data, temps } = result;

      if (dataRevoked(data)) {
        return;
      }

      this._fake.innerHTML = this.__originHTML;

      render({ target, data, temps });
    },
    _clearContent() {
      this.__rendered = false;

      revokeAll(this._fake);
      this._fake.innerHTML = "";
    },
    init() {
      if (this._bindend) {
        return;
      }

      this._bindend = true;
      const fake = (this._fake = new FakeNode(this.tag));
      this.before(fake);
      fake.init();
      this.remove();

      // 给 else-if 添加 _xif，给 else 初始化
      if (this.tag === "x-if") {
        const others = (this._others = []);

        let next = fake;
        while (true) {
          next = next.nextElementSibling;

          if (!next) {
            break;
          }

          switch (next.tagName) {
            case "X-ELSE": {
              const $el = eleX(next);
              if ($el.init) {
                $el.init();
              } else {
                $el._if_ready = 1;
              }

              others.push($el);
              return;
            }
            case "X-ELSE-IF": {
              const $el = eleX(next);

              $el._xif = this;

              others.push($el);
              break;
            }
            default:
              break;
          }
        }
      }
    },
  },
  created() {
    this.__originHTML = this.$("template[condition]").html;
    this.html = "";
  },
  ready() {
    if (this.ele._bindingRendered) {
      this.init();
    } else {
      this.one("binding-rendered", () => this.init());
    }
  },
};

register({
  tag: "x-if",
  ...regOptions,
});

register({
  tag: "x-else-if",
  ...regOptions,
  watch: {
    value() {
      if (!this._bindend) {
        return;
      }

      if (this._xif) {
        this._xif.refreshValue();
      }
    },
  },
});

register({
  tag: "x-else",
  ...regOptions,
  watch: {},
  ready() {
    if (this._if_ready) {
      this.init();
    }
  },
});

export const getRenderData = (target) => {
  while (target && !target.__render_data) {
    target = target.parentNode;
  }

  if (target) {
    return {
      target,
      data: target.__render_data,
      temps: target.__render_temps,
    };
  }

  return null;
};
