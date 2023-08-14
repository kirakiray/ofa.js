import { register } from "../register.mjs";
import { render } from "./render.mjs";
import { proto as conditionProto } from "./condition.mjs";
import { getType, nextTick } from "../../stanz/public.mjs";
import Stanz from "../../stanz/main.mjs";
import { createXEle, revokeAll } from "../util.mjs";
import {
  hyphenToUpperCase,
  moveArrayValue,
  isArrayEqual,
  removeArrayValue,
} from "../public.mjs";

const createItem = (d, targetTemp, temps, $host) => {
  const $ele = createXEle(targetTemp.innerHTML);
  const { ele } = $ele;

  const itemData = new Stanz({
    $data: d,
    $ele,
    $host,
  });

  render({
    target: ele,
    data: itemData,
    temps,
    $host,
    isRenderSelf: true,
  });

  const revokes = ele.__revokes;

  const revoke = () => {
    removeArrayValue(revokes, revoke);
    itemData.revoke();
  };

  revokes.push(revoke);

  return { ele, itemData };
};

const proto = {
  _getRenderData: conditionProto._getRenderData,
  _renderMarked: conditionProto._renderMarked,
  _getChilds() {
    const childs = [];

    const { __marked_end, __marked_start } = this;

    if (!__marked_start) {
      return [];
    }

    let target = __marked_start;

    while (true) {
      target = target.nextSibling;

      if (!target || target === __marked_end) {
        break;
      }
      if (target instanceof Element) {
        childs.push(target);
      }
    }

    return childs;
  },
};

register({
  tag: "x-fill",
  data: {
    value: null,
  },
  watch: {
    value(val) {
      const childs = this._getChilds();

      if (!val) {
        childs &&
          childs.forEach((el) => {
            revokeAll(el);
            el.remove();
          });
        return;
      }

      if (!(val instanceof Array)) {
        console.warn(
          `The value of x-fill component must be of type Array, and the type of the current value is ${getType(
            val
          )}`
        );

        childs &&
          childs.forEach((el) => {
            revokeAll(el);
            el.remove();
          });
        return;
      }

      const newVal = Array.from(val);
      const oldVal = childs.map((e) => e.__render_data.$data);

      if (isArrayEqual(oldVal, newVal)) {
        return;
      }

      const tempName = this._name;

      const { data, temps } = this._getRenderData();

      if (!temps) {
        return;
      }

      // const targetTemp = temps[hyphenToUpperCase(tempName)];
      const targetTemp = temps[tempName];

      const markEnd = this.__marked_end;
      const parent = markEnd.parentNode;
      const backupChilds = childs.slice();
      const $host = data.$host || data;

      for (let i = 0, len = val.length; i < len; i++) {
        const current = val[i];
        const cursorEl = childs[i];

        if (!cursorEl) {
          const { ele } = createItem(current, targetTemp, temps, $host);
          parent.insertBefore(ele, markEnd);
          continue;
        }

        const cursorData = cursorEl.__render_data.$data;

        if (current === cursorData) {
          continue;
        }

        if (oldVal.includes(current)) {
          // Data displacement occurs
          const oldEl = childs.find((e) => e.__render_data.$data === current);
          oldEl.__internal = 1;
          parent.insertBefore(oldEl, cursorEl);
          delete oldEl.__internal;
          moveArrayValue(childs, oldEl, i);
        } else {
          // New elements added
          const { ele } = createItem(current, targetTemp, temps, $host);
          parent.insertBefore(ele, cursorEl);
          childs.splice(i, 0, ele);
        }
      }

      backupChilds.forEach((current, i) => {
        const data = oldVal[i];

        // need to be deleted
        if (!newVal.includes(data)) {
          revokeAll(current);
          current.remove();
        }
      });
    },
  },
  proto,
  ready() {
    this.__originHTML = "origin";
    this._name = this.attr("name");
    this._renderMarked();

    nextTick(() => this.ele.remove());
  },
});
