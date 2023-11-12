import { register } from "../register.mjs";
import { render } from "./render.mjs";
import { FakeNode } from "./fake-node.mjs";
import Stanz from "../../stanz/main.mjs";
import { createXEle, eleX, revokeAll } from "../util.mjs";
import { removeArrayValue } from "../public.mjs";
import { getRenderData } from "./condition.mjs";

register({
  tag: "x-fill",
  data: {
    value: null,
  },
  watch: {
    value() {
      this.refreshValue();
    },
  },
  proto: {
    refreshValue() {
      const val = this.value;

      if (!this._bindend) {
        return;
      }

      const childs = this._fake.children;

      if (!val) {
        childs.forEach((e) => revokeAll(e));
        this._fake.innerHTML = "";
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

      const regData = getRenderData(this._fake);

      if (!regData) {
        return;
      }

      const xids = childs.map((e) => e._data_xid || e);

      const { data, temps } = regData;

      const targetTemp = temps[this._name];

      // Adjustment of elements in order
      const len = val.length;
      let currentEl;
      for (let i = 0; i < len; i++) {
        const e = val[i];

        const oldIndex = xids.indexOf(e.xid || e);

        if (oldIndex > -1) {
          if (oldIndex === i) {
            // No data changes
            currentEl = childs[i];
            continue;
          }

          // position change
          const target = childs[oldIndex];
          const $target = eleX(target);
          // fix data index
          $target.__item.$index = i;
          target.__internal = 1;
          if (i === 0) {
            this._fake.insertBefore(target, childs[0]);
          } else {
            this._fake.insertBefore(target, currentEl.nextElementSibling);
          }
          currentEl = target;
          delete target.__internal;
          continue;
        }

        // new data
        const $ele = createItem(e, temps, targetTemp, data.$host || data, i);
        if (!currentEl) {
          if (childs.length) {
            this._fake.insertBefore($ele.ele, childs[0]);
          } else {
            this._fake.appendChild($ele.ele);
          }
        } else {
          this._fake.insertBefore($ele.ele, currentEl.nextSibling);
        }
        currentEl = $ele.ele;
      }

      const newChilds = this._fake.children;

      if (len < newChilds.length) {
        newChilds.slice(len).forEach((e) => {
          e.remove();
          revokeAll(e);
        });
      }

      if (this._fake.parentNode) {
        eleX(this._fake.parentNode).refresh();
      }
      this.emit("rendered", {
        bubbles: false,
      });
    },
    init() {
      if (this._bindend) {
        return;
      }
      this._bindend = true;
      const fake = (this._fake = new FakeNode("x-fill"));
      this.before(fake);
      fake.init();
      this.remove();

      this.refreshValue();
    },
  },
  ready() {
    this._name = this.attr("name");

    if (!this._name) {
      const desc =
        "The target element does not have a template name to populate";
      console.log(desc, this.ele);
      throw new Error(desc);
    }

    if (this.ele._bindingRendered) {
      this.init();
    } else {
      this.one("binding-rendered", () => this.init());
    }
  },
});

const createItem = (data, temps, targetTemp, $host, $index) => {
  const $ele = createXEle(targetTemp.innerHTML);

  const itemData = new Stanz({
    $data: data,
    $ele,
    $host,
    $index,
  });

  render({
    target: $ele.ele,
    data: itemData,
    temps,
    $host,
    isRenderSelf: true,
  });

  const revokes = $ele.ele.__revokes;

  const revoke = () => {
    removeArrayValue(revokes, revoke);
    itemData.revoke();
  };

  revokes.push(revoke);

  $ele.__item = itemData;
  $ele.ele._data_xid = data.xid || data;

  return $ele;
};
