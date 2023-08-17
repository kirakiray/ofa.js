/**
 * `x-if` first replaces all neighboring conditional elements with token elements and triggers the rendering process once; the rendering process is triggered again after each `value` change.
 * The rendering process is as follows:
 * 1. First, collect all conditional elements adjacent to `x-if`.
 * 2. Mark these elements and wait for the `value` of each conditional element to be set successfully before proceeding to the next step.
 * 3. Based on the marking, perform a judgment operation asynchronously, the element that satisfies the condition first will be rendered; after successful rendering, the subsequent conditional elements will clear the rendered content.
 */

import { register } from "../register.mjs";
import { render, renderExtends } from "./render.mjs";
import { revokeAll } from "../util.mjs";

const RENDERED = Symbol("already-rendered");

const oldRenderable = renderExtends.renderable;
renderExtends.renderable = (el) => {
  const bool = oldRenderable(el);

  if (!bool) {
    return false;
  }

  let t = el;
  while (true) {
    t = t.parentNode;
    if (!t) {
      break;
    }

    let tag = t.tagName;

    if (tag && (tag === "X-IF" || tag === "X-ELSE-IF" || tag === "X-ELSE")) {
      return false;
    }
  }

  return true;
};

// Find other condition elements before and after
// isEnd: Retrieves the subsequent condition element
function getConditionEles(_this) {
  const $eles = [];

  if (_this.parent) {
    _this.remove();
  }

  let target = _this.__marked_end;
  while (true) {
    if (!target) {
      break;
    }

    target = target.nextSibling;
    if (target instanceof Comment) {
      const { __$ele } = target;
      if (__$ele) {
        const eleTag = __$ele.tag;

        if (eleTag === "x-else-if" || eleTag === "x-else") {
          $eles.push(__$ele);
        }

        target = target.__end;
      }
    } else {
      if (target) {
        const $target = $(target);
        const targetTag = $target.tag;

        if (target instanceof Text) {
          if (target.data.replace(/\n/g, "").trim()) {
            break;
          }
        } else if (targetTag === "x-else-if" || targetTag === "x-else") {
          $target._renderMarked();
          $target.remove();
          target = $target.__marked_start;
          $target._xif = _this;
        }
      } else {
        break;
      }
    }
  }

  return $eles;
}
export const proto = {
  _getRenderData() {
    let target = this.__marked_end;
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
  },
  _renderMarked() {
    if (this.__marked_start) {
      return;
    }

    const { ele } = this;
    const { parentNode } = ele;

    const markedText = `${this.tag}: ${this.__originHTML
      .trim()
      .slice(0, 20)
      .replace(/\n/g, "")} ...`;

    const markedStart = document.createComment(markedText + " --start");
    const markedEnd = document.createComment(markedText + " --end");
    markedStart.__end = markedEnd;
    markedEnd.__start = markedStart;
    markedEnd.__$ele = markedStart.__$ele = this;
    parentNode.insertBefore(markedStart, ele);
    parentNode.insertBefore(markedEnd, ele);
    this.__marked_start = markedStart;
    this.__marked_end = markedEnd;

    Object.defineProperties(ele, {
      __revokes: {
        set(val) {
          markedStart.__revokes = val;
        },
        get() {
          return markedStart.__revokes;
        },
      },
    });
  },
  _renderContent() {
    if (this[RENDERED]) {
      return;
    }

    const e = this._getRenderData();

    if (!e) {
      return;
    }

    const { target, data, temps } = e;

    const markedEnd = this.__marked_end;

    const temp = document.createElement("template");
    temp.innerHTML = this.__originHTML;
    markedEnd.parentNode.insertBefore(temp.content, markedEnd);

    render({ target, data, temps });

    this[RENDERED] = true;
  },
  _revokeRender() {
    const markedStart = this.__marked_start;
    const markedEnd = this.__marked_end;

    let target = markedEnd.previousSibling;

    while (true) {
      if (!target || target === markedStart) {
        break;
      }

      revokeAll(target);
      const oldTarget = target;
      target = target.previousSibling;
      oldTarget.remove();
    }

    this[RENDERED] = false;
  },
};

const xifComponentOpts = {
  tag: "x-if",
  data: {
    value: null,
  },
  watch: {
    async value() {
      this._refreshCondition();
    },
  },
  proto: {
    async _refreshCondition() {
      await this.__init_rendered;

      // Used to store adjacent conditional elements
      const $eles = [this];

      // Pull in the remaining sibling conditional elements as well
      $eles.push(...getConditionEles(this));

      let isOK = false;
      $eles.forEach(($ele) => {
        if (isOK) {
          $ele._revokeRender();
          return;
        }

        if ($ele.value || $ele.tag === "x-else") {
          $ele._renderContent();
          isOK = true;
          return;
        }

        $ele._revokeRender();
      });
    },
    ...proto,
  },
  created() {
    this.__originHTML = this.html;
    this.html = "";
  },
  ready() {
    let resolve;
    this.__init_rendered = new Promise((res) => (resolve = res));
    this.__init_rendered_res = resolve;
  },
  attached() {
    // Because it needs to have a parent element, the logo is added after attached.
    this._renderMarked();
    this.__init_rendered_res();
  },
};

register(xifComponentOpts);

register({
  tag: "x-else-if",
  watch: {
    value() {
      this._xif && this._xif._refreshCondition();
    },
  },
  created: xifComponentOpts.created,
  proto,
});

register({
  tag: "x-else",
  created: xifComponentOpts.created,
  proto,
});
