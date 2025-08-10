import $ from "../xhear/base.mjs";
import { SELF } from "../stanz/main.mjs";
import { hyphenToUpperCase, toDashCase } from "../xhear/public.mjs";
import { getErr, getErrDesc } from "../ofa-error/main.js";

const InvalidKeys = [
  "tag",
  "name",
  "class",
  "style",
  "id",
  "x-bind-data",
  "is-root",
];

// 根provider
const rootProviders = {};

const temp = `<style>:host{display:contents}</style><slot></slot>`;

Object.defineProperty($, "getRootProvider", {
  value(name) {
    return rootProviders[name];
  },
});

const publicWatch = {
  name(name) {
    const oldName = this.__oldName;
    this.__oldName = name;

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

    debugger;
  },
};

const updateProvider = (provider) => {
  if (!provider.name) {
    return;
  }

  // 更新底层的所有consumer
  const pool = consumers[provider.name];
  if (pool) {
    // 通知对应name所有的consumer更新数据
    pool.forEach((item) => item._refresh());
  }
};

// 初始化 provider
const initProvider = async (provider) => {
  // 将 attributes 上的属性设置到 provider 上
  for (const key of provider.ele.attributes) {
    if (InvalidKeys.includes(key.name)) {
      continue;
    }
    provider[key.name] = key.value;
  }

  // 监听数据变化升级consumer
  provider._init_tid = provider.watchTick(() => updateProvider(provider));

  updateProvider(provider); // 尝试初次更新 consumer
};

$.register({
  tag: "o-root-provider",
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  attached() {
    initProvider(this);
    rootProviders[this.name] = this;
  },
  detached() {
    this.unwatch(this._init_tid);
    delete rootProviders[this.name];
  },
});

// 获取对应 name 的上一级 provider 元素
$.fn.getProvider = function (name) {
  const ancestors = this.composedPath();

  // 获取最近的 provider 元素
  let provider = ancestors.find((element) => {
    return (
      element.tagName &&
      element.tagName.toLowerCase() === "o-provider" &&
      element.getAttribute("name") === name
    );
  });

  if (!provider) {
    provider = rootProviders[name];
  }

  if (!provider) {
    return null;
  }

  return $(provider);
};

const providers = {}; // 存储所有的provider元素
const consumers = {}; // 存储所有的consumer元素

/**
 * 创建元素池操作函数
 * @param {Object} poolObj - 元素池对象
 * @returns {Object} 包含添加和移除元素的方法
 */
function createPoolOperations(poolObj) {
  /**
   * 向元素池中添加元素
   * @param {$ele} $ele - 要添加的元素
   */
  const add = ($ele) => {
    if (!poolObj[$ele.name]) {
      poolObj[$ele.name] = new Set();
    }
    poolObj[$ele.name].add($ele);
  };

  /**
   * 从元素池中移除元素
   * @param {$ele} $ele - 要移除的元素
   */
  const remove = ($ele) => {
    const pool = poolObj[$ele.name];
    if (pool) {
      pool.delete($ele);
    }
  };

  return { add, remove };
}

const { add: addProvider, remove: removeProvider } =
  createPoolOperations(providers);
const { add: addConsumer, remove: removeConsumer } =
  createPoolOperations(consumers);

$.register({
  tag: "o-provider",
  temp,
  attrs: {
    name: null,
  },
  watch: {
    ...publicWatch,
  },
  attached() {
    addProvider(this);
    initProvider(this);
  },
  detached() {
    this.unwatch(this._init_tid);
    removeProvider(this);
  },
});

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
    // 更新自身的数据
    _refresh() {
      const provider = this.getProvider(this.name);

      if (!provider) {
        // 应该清空自身的数据
        for (let name of Object.keys(this)) {
          if (InvalidKeys.includes(name) || !/\D/.test(name)) {
            // 跳过默认key和数字
            continue;
          }
          this[name] = undefined;
        }
        return;
      }

      // 更新自身的数据
      for (let name of Object.keys(provider)) {
        const value = provider[name];
        if (InvalidKeys.includes(name) || !/\D/.test(name)) {
          // 跳过默认key和数字
          continue;
        }

        if (this[name] !== value) {
          this[name] = value;
        }
      }

      // 删除 consumer 上 provider没有的数据
      for (let name of Object.keys(this)) {
        if (InvalidKeys.includes(name) || !/\D/.test(name)) {
          // 跳过默认key和数字
          continue;
        }

        if (provider[name] === undefined) {
          this[name] = undefined;
        }
      }
    },
  },
  attached() {
    addConsumer(this);
    this._refresh();
  },
  detached() {
    removeConsumer(this);
  },
});
