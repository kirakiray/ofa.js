import { nextTick } from "../stanz/public.mjs";
import $ from "../xhear/base.mjs";
import { hyphenToUpperCase, toDashCase } from "../xhear/public.mjs";

const temp = `<style>:host{display:contents}</style><slot></slot>`;

const CONSUMERS = Symbol("consumers");

$.register({
  tag: "o-provider",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    name() {
      this.consumers.forEach((item) => {
        item._update();
      });
    },
  },
  proto: {
    get consumers() {
      return [...Array.from(this[CONSUMERS])];
    },
  },
  ready() {
    this[CONSUMERS] = new Set();

    // 通过监听事件，更新consumer
    this.on(`update-consumer`, (e) => {
      const { name, consumer } = e.data;

      if (name && this.name === name) {
        consumer[PROVIDER] = this.ele;
        this[CONSUMERS].add(consumer.ele);

        // 查找到对应的provider后，禁止向上冒泡
        e.stopPropagation();

        if (this._refreshed) {
          // 刷新过后，consumer直接开始重置数据
          Object.keys(this).forEach((key) => {
            if (key === "name" || key === "tag" || !/\D/.test(key)) {
              return;
            }

            consumer[key] = this[key];
          });
        }
      }
    });

    this.watch((e) => {
      if (e.target === this && e.type === "set") {
        // 自身的值修改，更新consumer
        const { name, value } = e;

        const attrName = toDashCase(name);

        if (value === null || value === undefined) {
          this.ele.removeAttribute(attrName);
        } else if (this.ele.getAttribute(attrName) !== String(value)) {
          this.ele.setAttribute(attrName, value);
        }

        if (name !== "name") {
          this[CONSUMERS].forEach((el) => {
            const consumer = $(el);
            if (consumer[name] !== value) {
              consumer[name] = value;
            }
          });
        }
      }
    });
  },
  attached() {
    // 将 attributes 的值绑定到 props 上
    const refreshToProps = () => {
      // 更新（添加）属性
      Array.from(this.ele.attributes).forEach((item) => {
        const { name, value } = item;

        const propName = hyphenToUpperCase(name);

        if (name === "name") {
          return;
        }

        if (String(this[propName]) !== value) {
          this[propName] = value;
        }
      });

      // 删除属性
      Object.keys(this).forEach((key) => {
        if (key === "name" || key === "tag" || !/\D/.test(key)) {
          return;
        }

        const attrName = toDashCase(key);

        const val = this.ele.getAttribute(attrName);

        if (
          (val === null || val === undefined) &&
          (this[key] !== null || this[key] !== undefined)
        ) {
          this[key] = null;
        }
      });
    };

    // 将元素的所有 attributes 和 props 进行绑定
    const obs = (this._obs = new MutationObserver((e) => {
      // 更新数据
      refreshToProps();
    }));

    obs.observe(this.ele, {
      attributes: true,
    });

    // 初次更新数据
    nextTick(() => {
      refreshToProps();
      this._refreshed = 1;

      // 组件影子节点内，对应 slot 上冒泡的修正
      if (this.$("slot")) {
        // 重新让所有子级的 consumer 重新刷新冒泡
        const { ele } = this;
        Array.from(ele.children).forEach((childEl) =>
          emitAllConsumer(childEl, ele)
        );
      }
    });
  },
  detached() {
    this._refreshed = null;
    this._obs && this._obs.disconnect();
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
  if (ele.tagName === "O-PROVIDER") {
    return;
  }

  if (ele.tagName === "O-CONSUMER") {
    // 重新冒泡
    $(ele)._update(rootProvider);
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

const PROVIDER = Symbol("provider");

$.register({
  tag: "o-consumer",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    name() {
      this._update();
    },
  },
  proto: {
    get provider() {
      return this[PROVIDER];
    },
    _update(provider) {
      if (provider) {
        if (this[PROVIDER] === provider) {
          // 相同的 provider 发送的通知，不用再继续冒泡查找
          return true;
        }

        // 切换 provider 操作，删除不存在的属性
        const $provider = $(provider);
        const keys = Object.keys($provider);
        Object.keys(this).forEach((key) => {
          if (!/\D/.test(key)) {
            return;
          }
          if (!keys.includes(key)) {
            this[key] = null;
          }
        });
      }

      this.clearProvider();

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
    clearProvider() {
      if (this[PROVIDER]) {
        // 刷新前清除旧的附身provider
        const provider = $(this[PROVIDER]);
        provider[CONSUMERS].delete(this.ele);
      }
    },
  },
  ready() {
    this[PROVIDER] = null;

    // 最开始带有 attribute 的 key，在 provider 更新后，也同步到 consumer 的 attributes 上
    const names = Array.from(this.ele.attributes)
      .map((e) => {
        if (e.name !== "name") {
          return e.name;
        }
      })
      .filter((e) => !!e);

    if (names.length) {
      this.watch((e) => {
        let { name } = e;
        const attrName = toDashCase(name);

        if (e.target === this && e.type === "set" && names.includes(attrName)) {
          if (e.value === null || e.value === undefined) {
            this.ele.removeAttribute(attrName);
            return;
          }
          this.ele.setAttribute(attrName, String(e.value));
        }
      });
    }
  },
  attached() {
    if (!this[PROVIDER]) {
      this._update();
    }
  },
  detached() {
    this.clearProvider();
  },
});
