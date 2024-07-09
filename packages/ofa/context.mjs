import $ from "../xhear/base.mjs";
import { SELF } from "../stanz/main.mjs";
import { hyphenToUpperCase, toDashCase } from "../xhear/public.mjs";
import { getErrDesc } from "../ofa-error/main.js";

const temp = `<style>:host{display:contents}</style><slot></slot>`;

const CONSUMERS = Symbol("consumers");
const PROVIDER = Symbol("provider");

$("body").on("update-consumer", (e) => {
  const target = e.composedPath()[0];
  const $tar = $(target);

  if ($tar.tag === "o-consumer") {
    let hasData = false;
    // 清空冒泡到根的 consumer 数据
    Object.keys($tar[SELF]).forEach((key) => {
      if (InvalidKeys.includes(key)) {
        return;
      }
      $tar[key] = undefined;

      hasData = true;
    });

    if (hasData) {
      console.warn(getErrDesc("no_provider", { name: $tar.name }), target);
    }
  }
});

const publicProto = {
  // 向上冒泡，让 provider 和 consumer 绑定
  _update(provider) {
    if (this[PROVIDER] && this[PROVIDER] === provider) {
      return;
    }

    if (this[PROVIDER]) {
      this._clear();
    }

    if (provider) {
      this[PROVIDER] = provider;
      provider[CONSUMERS].add(this);
      return;
    }

    if (this.name) {
      this.emit(`update-consumer`, {
        data: {
          name: this.name,
          consumer: this,
        },
        composed: true,
      });
    }
  },
  _clear() {
    const provider = this[PROVIDER];
    provider[CONSUMERS].delete(this);
    this[PROVIDER] = null;
  },
};

const publicWatch = {
  name() {
    // 是否已经设置过
    if (!this.__named) {
      this.__named = 1;
      return;
    }

    console.warn(
      getErrDesc("context_change_name", {
        compName: ` "${this.tag}" `,
      }),
      this.ele
    );

    this._update();
  },
};

const InvalidKeys = ["tag", "name", "class", "style", "id"];

$.register({
  tag: "o-provider",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    ...publicProto,
    get consumers() {
      return [...Array.from(this[CONSUMERS])];
    },
    get provider() {
      return this[PROVIDER];
    },
    refresh() {
      // 辅助consumer刷新数据
      this.consumers.forEach((e) => e.refresh());
    },
    _setConsumer(name, value, isSelf) {
      if (isSelf || this[name] === undefined || this[name] === null) {
        if (value === undefined || value === null) {
          // 删除属性，则向上层获取对应值，并向下设置
          let parentProvider = this.provider;
          while ((value === undefined || value === null) && parentProvider) {
            value = parentProvider[name];
            if (value) {
              break;
            }
            parentProvider = parentProvider.provider;
          }
        }

        this[CONSUMERS].forEach((consumer) => {
          // 主动设置数据，性能更好
          if (consumer._setConsumer) {
            consumer._setConsumer(name, value);
          } else {
            if (consumer[name] !== value) {
              consumer[name] = value;
            }
          }
        });
      }
    },
  },
  ready() {
    this[CONSUMERS] = new Set();

    this.on("update-consumer", (e) => {
      if (e.target === e.currentTarget) {
        // 给自己出触发的事件，不做处理
        return;
      }

      const { name, consumer } = e.data;

      if (name && this.name === name) {
        this[CONSUMERS].add(consumer);
        consumer[PROVIDER] = this;

        // 查找到对应的provider后，禁止向上冒泡
        e.stopPropagation();

        consumer.refresh();
      }
    });

    this.watch((e) => {
      if (e.target === this && e.type === "set") {
        // 自身的值修改，更新consumer
        const { name, value } = e;

        if (!InvalidKeys.includes(name)) {
          this._setConsumer(name, value, 1);
        }
      }
    });
  },
  attached() {
    // 默认将attributes的值设置到props上
    const needRemoves = [];
    Array.from(this.ele.attributes).forEach((item) => {
      const { name, value } = item;

      if (!InvalidKeys.includes(name)) {
        this[hyphenToUpperCase(name)] = value;
        needRemoves.push(name);
      }
    });
    needRemoves.forEach((name) => this.ele.removeAttribute(name));

    this._update();

    // 组件影子节点内，对应 slot 上冒泡的修正
    if (this.$("slot")) {
      // 重新让所有子级的 consumer 重新刷新冒泡
      const { ele } = this;
      Array.from(ele.children).forEach((childEl) =>
        emitAllConsumer(childEl, this)
      );
    }
  },
});

/**
 * 递归地触发所有consumer组件的更新。
 *
 * 此函数会检查传入的DOM元素，如果该元素是consumer组件，它将更新该组件。
 * 如果元素具有shadowRoot，函数将递归地通知影子节点内的元素。
 * 如果元素是slot元素，并且emitSlot参数为true，它将检查slot的名称，并通知具有相同slot名称的元素。
 *
 * @param {HTMLElement} ele - 要检查和触发更新的DOM元素。
 * @param {HTMLElement} rootProvider - 根provider元素，consumer将使用此元素作为数据源。
 * @param {boolean} [emitSlot=true] - 是否应该触发slot元素对应的子元素的更新。
 * @returns {void}
 */
const emitAllConsumer = (ele, rootProvider, emitSlot = true) => {
  if (ele.tagName === "O-CONSUMER" || ele.tagName === "O-PROVIDER") {
    // 重新冒泡
    const $ele = $(ele);
    $ele._update(rootProvider);
    $ele.refresh();
  } else if (ele.tagName === "SLOT" && emitSlot) {
    const slotName = ele.getAttribute("name") || "";
    const host = ele?.getRootNode()?.host;
    Array.from(host.children).forEach((e) => {
      const selfSlotName = e.getAttribute("slot") || "";
      if (selfSlotName === slotName) {
        // 继续递归符合插槽的元素
        emitAllConsumer(e, rootProvider);
      }
    });
    return;
  } else if (ele.shadowRoot) {
    // 通知影子节点内的元素
    Array.from(ele.shadowRoot.children).forEach((childEl) =>
      emitAllConsumer(childEl, rootProvider, false)
    );
  }

  // 不符合的元素继续递归
  Array.from(ele.children).forEach((childEl) =>
    emitAllConsumer(childEl, rootProvider)
  );
};

$.register({
  tag: "o-consumer",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  proto: {
    ...publicProto,
    get provider() {
      return this[PROVIDER];
    },
    // 更新自身数据
    refresh() {
      const data = {};
      const keys = [];

      let { provider } = this;
      while (provider) {
        Object.keys(provider[SELF]).forEach((key) => {
          if (key === "tag" || key === "name") {
            return;
          }

          if (data[key] === undefined || data[key] === null) {
            data[key] = provider[key];
            keys.push(key);
          }
        });

        provider = provider.provider;
      }

      // 需要删除自身不存在的数据
      Object.keys(this[SELF]).forEach((key) => {
        if (InvalidKeys.includes(key) || keys.includes(key)) {
          return;
        }

        this[key] = undefined;
      });

      // 设置值
      for (let [key, value] of Object.entries(data)) {
        this[key] = value;
      }
    },
  },
  ready() {
    // 记录自身的 attributes
    const existKeys = (this._existAttrKeys = Object.values(this.ele.attributes)
      .map((e) => e.name)
      .filter((e) => !InvalidKeys.includes(e)));

    // 更新 attributes
    this.watch((e) => {
      if (e.target === this && e.type === "set") {
        const attrName = toDashCase(e.name);

        if (existKeys.includes(attrName)) {
          if (e.value === null || e.value === undefined) {
            this.ele.removeAttribute(attrName);
          } else {
            this.ele.setAttribute(attrName, e.value);
          }
        }
      }
    });
  },
  attached() {
    this._update();
  },
});
