import { nextTick } from "../stanz/public.mjs";
import $ from "../xhear/base.mjs";

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
      }
    });

    this.watch((e) => {
      if (e.target === this) {
        // 自身的值修改，更新consumer
        const { name, value } = e;

        if (value === null) {
          this.ele.removeAttribute(name);
        } else if (this.ele.getAttribute(name) !== String(value)) {
          this.ele.setAttribute(name, value);
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

        if (name === "name") {
          return;
        }

        if (String(this[name]) !== value) {
          this[name] = value;
        }
      });

      // 删除属性
      Object.keys(this).forEach((key) => {
        if (key === "name" || key === "tag" || !/\D/.test(key)) {
          return;
        }

        const val = this.ele.getAttribute(key);

        if (val === null && this[key] !== null) {
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
    nextTick(() => refreshToProps());
  },
  detached() {
    this._obs && this._obs.disconnect();
  },
});

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
    _update() {
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
