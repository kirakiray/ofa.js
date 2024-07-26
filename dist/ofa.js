//! ofa.js - v4.5.8 https://github.com/kirakiray/ofa.js  (c) 2018-2024 YAO
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.$ = factory());
})(this, (function () { 'use strict';

  // const error_origin = "http://127.0.0.1:5793/errors";
  const error_origin = "https://ofajs.github.io/ofa-errors/errors";

  // 存放错误信息的数据对象
  const errors = {};

  if (globalThis.navigator && navigator.language) {
    let langFirst = navigator.language.toLowerCase().split("-")[0];

    if (langFirst === "zh" && navigator.language.toLowerCase() !== "zh-cn") {
      langFirst = "zhft";
    }

    (async () => {
      if (localStorage["ofa-errors"]) {
        const targetLangErrors = JSON.parse(localStorage["ofa-errors"]);
        Object.assign(errors, targetLangErrors);
      }

      const errCacheTime = localStorage["ofa-errors-time"];

      if (!errCacheTime || Date.now() > Number(errCacheTime) + 5 * 60 * 1000) {
        const targetLangErrors = await fetch(`${error_origin}/${langFirst}.json`)
          .then((e) => e.json())
          .catch(() => null);

        if (targetLangErrors) {
          localStorage["ofa-errors"] = JSON.stringify(targetLangErrors);
          localStorage["ofa-errors-time"] = Date.now();
        } else {
          targetLangErrors = await fetch(`${error_origin}/en.json`)
            .then((e) => e.json())
            .catch((error) => {
              console.error(error);
              return null;
            });
        }

        Object.assign(errors, targetLangErrors);
      }
    })();
  }

  let isSafari = false;
  if (globalThis.navigator) {
    isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
  }

  /**
   * 根据键、选项和错误对象生成错误对象。
   *
   * @param {string} key - 错误描述的键。
   * @param {Object} [options] - 映射相关值的选项对象。
   * @param {Error} [error] - 原始错误对象。
   * @returns {Error} 生成的错误对象。
   */
  const getErr = (key, options, error) => {
    let desc = getErrDesc(key, options);

    let errObj;
    if (error) {
      if (isSafari) {
        desc += `\nCaused by: ${error.toString()}\n  ${error.stack.replace(
        /\n/g,
        "\n    "
      )}`;
      }
      errObj = new Error(desc, { cause: error });
    } else {
      errObj = new Error(desc);
    }
    errObj.code = key;
    return errObj;
  };

  /**
   * 根据键、选项生成错误描述
   *
   * @param {string} key - 错误描述的键。
   * @param {Object} [options] - 映射相关值的选项对象。
   * @returns {string} 生成的错误描述。
   */
  const getErrDesc = (key, options) => {
    if (!errors[key]) {
      return `Error code: "${key}", please go to https://github.com/ofajs/ofa-errors to view the corresponding error information`;
    }

    let desc = errors[key];

    // 映射相关值
    if (options) {
      for (let k in options) {
        desc = desc.replace(new RegExp(`{${k}}`, "g"), options[k]);
      }
    }

    return desc;
  };

  const getRandomId = () => Math.random().toString(32).slice(2);

  const objectToString = Object.prototype.toString;
  const getType$1 = (value) =>
    objectToString
      .call(value)
      .toLowerCase()
      .replace(/(\[object )|(])/g, "");

  const isObject = (obj) => {
    const type = getType$1(obj);
    return type === "array" || type === "object";
  };

  const isDebug = {
    value: null,
  };

  if (typeof document !== "undefined") {
    if (document.currentScript) {
      isDebug.value = document.currentScript.attributes.hasOwnProperty("debug");
    } else {
      isDebug.value = true;
    }
  }

  const TICKERR = "nexttick_thread_limit";

  let asyncsCounter = 0;
  let afterTimer;
  const tickSets = new Set();
  function nextTick(callback) {
    clearTimeout(afterTimer);
    afterTimer = setTimeout(() => {
      asyncsCounter = 0;
    });

    if (isDebug.value) {
      Promise.resolve().then(() => {
        asyncsCounter++;
        if (asyncsCounter > 100000) {
          const err = getErr(TICKERR);
          console.warn(err, "lastCall => ", callback);
          throw err;
        }

        callback();
      });
      return;
    }

    const tickId = `t-${getRandomId()}`;
    tickSets.add(tickId);
    Promise.resolve().then(() => {
      asyncsCounter++;
      // console.log("asyncsCounter => ", asyncsCounter);
      if (asyncsCounter > 50000) {
        tickSets.clear();

        const err = getErr(TICKERR);
        console.warn(err, "lastCall => ", callback);
        throw err;
      }
      if (tickSets.has(tickId)) {
        callback();
        tickSets.delete(tickId);
      }
    });
    return tickId;
  }

  // export const clearTick = (id) => tickSets.delete(id);

  function debounce(func, wait = 0) {
    let timeout = null;
    let hisArgs = [];

    return function (...args) {
      hisArgs.push(...args);

      if (wait > 0) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.call(this, hisArgs);
          hisArgs = [];
          timeout = null;
        }, wait);
      } else {
        if (timeout === null) {
          timeout = 1;
          nextTick(() => {
            timeout = null;
            const args = hisArgs.slice();
            hisArgs = [];
            func.call(this, args);
          });
        }
      }
    };
  }

  // Enhanced methods for extending objects
  const extend = (_this, proto, descriptor = {}) => {
    [
      ...Object.getOwnPropertyNames(proto),
      ...Object.getOwnPropertySymbols(proto),
    ].forEach((k) => {
      const result = Object.getOwnPropertyDescriptor(proto, k);
      const { configurable, enumerable, writable, get, set, value } = result;

      if ("value" in result) {
        if (_this.hasOwnProperty(k)) {
          _this[k] = value;
        } else {
          Object.defineProperty(_this, k, {
            enumerable,
            configurable,
            writable,
            ...descriptor,
            value,
          });
        }
      } else {
        Object.defineProperty(_this, k, {
          enumerable,
          configurable,
          ...descriptor,
          get,
          set,
        });
      }
    });

    return _this;
  };

  function dataRevoked(data) {
    try {
      data.xid;
    } catch (err) {
      return isRevokedErr(err);
    }

    return false;
  }

  function isRevokedErr(error) {
    const firstLine = error.stack.split(/\\n/)[0].toLowerCase();
    if (firstLine.includes("proxy") && firstLine.includes("revoked")) {
      return true;
    }

    return false;
  }

  const isFunction = (val) => getType$1(val).includes("function");

  const hyphenToUpperCase = (str) =>
    str.replace(/-([a-z])/g, (match, p1) => {
      return p1.toUpperCase();
    });

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const toDashCase = (str) => {
    return str.replace(/[A-Z]/g, function (match) {
      return "-" + match.toLowerCase();
    });
  };

  // Determine if an element is eligible
  const meetsEle = (ele, expr) => {
    const temp = document.createElement("template");
    temp.content.append(ele.cloneNode());
    return !!temp.content.querySelector(expr);
  };

  function isEmptyObject(obj) {
    if (!obj) {
      return false;
    }
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  const removeArrayValue = (arr, target) => {
    const index = arr.indexOf(target);
    if (index > -1) {
      arr.splice(index, 1);
    }
  };

  const searchEle = (el, expr) => {
    if (el instanceof HTMLTemplateElement) {
      return Array.from(el.content.querySelectorAll(expr));
    }
    return Array.from(el.querySelectorAll(expr));
  };

  function mergeObjects(obj1, obj2) {
    for (let key of Object.keys(obj1)) {
      if (!obj2.hasOwnProperty(key)) {
        delete obj1[key];
      }
    }

    for (let [key, value] of Object.entries(obj2)) {
      obj1[key] = value;
    }
  }

  const isSafariBrowser = () =>
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const { assign: assign$1, freeze } = Object;

  class Watcher {
    constructor(opts) {
      assign$1(this, opts);
      freeze(this);
    }

    hasModified(k) {
      if (this.type === "array") {
        return this.path.includes(this.currentTarget.get(k));
      }

      const keys = k.split(".");

      if (this.currentTarget === this.target && this.name === keys[0]) {
        return true;
      }

      const modifieds = getModifieds(this, keys);

      const positionIndex = modifieds.indexOf(this.target);
      if (positionIndex > -1) {
        const currentKeys = keys.slice(positionIndex + 1);

        if (!currentKeys.length) {
          // This is listening for changes in the child object itself
          return true;
        }

        return this.name === currentKeys[0];
      }

      // Data belonging to the chain of change
      return this.path.includes(this.currentTarget[k]);
    }

    hasReplaced(k) {
      if (this.type !== "set") {
        return false;
      }

      const keys = k.split(".");

      if (this.target === this.currentTarget && this.name === keys[0]) {
        return true;
      }

      const modifieds = getModifieds(this, keys);

      const positionIndex = modifieds.indexOf(this.target);

      if (positionIndex > -1) {
        const currentKeys = keys.slice(positionIndex + 1);

        return currentKeys[0] === this.name;
      }

      return false;
    }
  }

  const getModifieds = (_this, keys) => {
    const modifieds = [];

    const cloneKeys = keys.slice();
    let target = _this.currentTarget;
    while (cloneKeys.length) {
      const targetKey = cloneKeys.shift();
      if (target) {
        target = target[targetKey];
      }

      modifieds.push(target);
    }

    return modifieds;
  };

  class Watchers extends Array {
    constructor(arr) {
      super(...arr);
    }

    hasModified(key) {
      return this.some((e) => e.hasModified(key));
    }

    hasReplaced(key) {
      return this.some((e) => e.hasReplaced(key));
    }
  }

  const emitUpdate = ({
    type,
    currentTarget,
    target,
    name,
    value,
    oldValue,
    args,
    path = [],
  }) => {
    if (path && path.includes(currentTarget)) {
      const err = getErr("circular_data");

      console.warn(err, {
        currentTarget,
        target,
        path,
      });

      return;
    }

    let options = {
      type,
      target,
      name,
      oldValue,
      value,
    };

    if (type === "array") {
      delete options.value;
      options.args = args;
    }

    if (currentTarget._hasWatchs) {
      const watcher = new Watcher({
        currentTarget,
        ...options,
        path: [...path],
      });

      currentTarget[WATCHS].forEach((func) => {
        func(watcher);
      });
    }

    currentTarget._update &&
      currentTarget.owner.forEach((parent) => {
        emitUpdate({
          currentTarget: parent,
          ...options,
          path: [currentTarget, ...path],
        });
      });
  };

  var watchFn = {
    watch(callback) {
      if (!(callback instanceof Function)) {
        throw getErr("not_func", { name: "watch" });
      }

      const wid = "w-" + getRandomId();

      this[WATCHS].set(wid, callback);

      return wid;
    },

    unwatch(wid) {
      return this[WATCHS].delete(wid);
    },

    watchTick(callback, wait) {
      if (!(callback instanceof Function)) {
        throw getErr("not_func", { name: "watchTick" });
      }

      return this.watch(
        debounce((arr) => {
          if (dataRevoked(this)) {
            // console.warn(`The revoked object cannot use watchTick : `, this);
            return;
          }
          arr = arr.filter((e) => {
            try {
              e.path.forEach((item) => item.xid);
            } catch (err) {
              return false;
            }

            return true;
          });

          callback(new Watchers(arr));
        }, wait || 0)
      );
    },
    // For manual use of emitUpdate
    refresh(opts) {
      const options = {
        ...opts,
        type: "refresh",
        target: this,
        currentTarget: this,
      };
      emitUpdate(options);
    },
    watchUntil(func) {
      return new Promise((resolve) => {
        let f;
        const tid = this.watch(
          (f = () => {
            const bool = func();
            if (bool) {
              this.unwatch(tid);
              resolve(this);
            }
          })
        );

        f();
      });
    },
  };

  const mutatingMethods$1 = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "reverse",
    "sort",
    "fill",
    "copyWithin",
  ];

  const holder = Symbol("placeholder");

  function compareArrays(oldArray, newArray) {
    const backupNewArray = Array.from(newArray);
    const backupOldArray = Array.from(oldArray);
    const deletedItems = [];
    const addedItems = new Map();

    const oldLen = oldArray.length;
    for (let i = 0; i < oldLen; i++) {
      const oldItem = oldArray[i];
      const newIndex = backupNewArray.indexOf(oldItem);
      if (newIndex > -1) {
        backupNewArray[newIndex] = holder;
      } else {
        deletedItems.push(oldItem);
      }
    }

    const newLen = newArray.length;
    for (let i = 0; i < newLen; i++) {
      const newItem = newArray[i];
      const oldIndex = backupOldArray.indexOf(newItem);
      if (oldIndex > -1) {
        backupOldArray[oldIndex] = holder;
      } else {
        addedItems.set(i, newItem);
      }
    }

    return { deletedItems, addedItems };
  }

  const fn$1 = {};

  const arrayFn$1 = Array.prototype;

  mutatingMethods$1.forEach((methodName) => {
    if (arrayFn$1[methodName]) {
      fn$1[methodName] = function (...args) {
        const backupArr = Array.from(this);

        const reval = arrayFn$1[methodName].apply(this[SELF], args);

        const { deletedItems, addedItems } = compareArrays(backupArr, this);

        // Refactoring objects as proxy instances
        for (let [key, value] of addedItems) {
          if (isxdata(value)) {
            value._owner.push(this);
          } else if (isObject(value)) {
            this.__unupdate = 1;
            this[key] = value;
            delete this.__unupdate;
          }
        }

        for (let item of deletedItems) {
          clearData(item, this);
        }

        emitUpdate({
          type: "array",
          currentTarget: this,
          target: this,
          args,
          name: methodName,
          oldValue: backupArr,
        });

        if (reval === this[SELF]) {
          return this[PROXY];
        }

        return reval;
      };
    }
  });

  // Object.getOwnPropertyNames(Array.prototype).forEach((methodName) => {
  ["concat", "filter", "slice", "flatMap", "map"].forEach((methodName) => {
    if (methodName === "constructor" || mutatingMethods$1.includes(methodName)) {
      return;
    }

    const oldFunc = Array.prototype[methodName];
    if (oldFunc instanceof Function) {
      fn$1[methodName] = function (...args) {
        return oldFunc.call(Array.from(this), ...args);
      };
    }
  });

  const { defineProperties: defineProperties$2, getOwnPropertyDescriptor, entries } = Object;

  const SELF = Symbol("self");
  const PROXY = Symbol("proxy");
  const WATCHS = Symbol("watchs");
  const ISXDATA = Symbol("isxdata");

  const isxdata = (val) => val && !!val[ISXDATA];

  function constructor(data, handler = handler$1) {
    // const proxySelf = new Proxy(this, handler);
    let { proxy: proxySelf, revoke } = Proxy.revocable(this, handler);

    // Determines the properties of the listener bubble
    proxySelf._update = 1;

    let watchs;

    defineProperties$2(this, {
      xid: { value: data.xid || getRandomId() },
      // Save all parent objects
      _owner: {
        value: [],
      },
      owner: {
        configurable: true,
        get() {
          return new Set(this._owner);
        },
      },
      [ISXDATA]: {
        value: true,
      },
      [SELF]: {
        configurable: true,
        get: () => this,
      },
      [PROXY]: {
        configurable: true,
        get: () => proxySelf,
      },
      // Save the object of the listener function
      [WATCHS]: {
        get: () => watchs || (watchs = new Map()),
      },
      _hasWatchs: {
        get: () => !!watchs,
      },
      _revoke: {
        value: revoke,
      },
    });

    Object.keys(data).forEach((key) => {
      const descObj = getOwnPropertyDescriptor(data, key);
      let { value, get, set } = descObj;

      if (get || set) {
        defineProperties$2(this, {
          [key]: descObj,
        });
      } else {
        // Set the function directly
        proxySelf[key] = value;
      }
    });

    return proxySelf;
  }

  class Stanz extends Array {
    constructor(data) {
      super();

      return constructor.call(this, data);
    }

    // This method is still in the experimental period
    revoke() {
      const self = this[SELF];

      if (self._onrevokes) {
        self._onrevokes.forEach((f) => f());
        self._onrevokes.length = 0;
      }

      self.__unupdate = 1;

      self[WATCHS].clear();

      entries(this).forEach(([name, value]) => {
        if (isxdata(value)) {
          this[name] = null;
        }
      });

      self._owner.forEach((parent) => {
        entries(parent).forEach(([name, value]) => {
          if (value === this) {
            parent[name] = null;
          }
        });
      });

      delete self[SELF];
      delete self[PROXY];
      self._revoke();
    }

    toJSON() {
      let obj = {};

      let isPureArray = true;
      let maxId = -1;

      Object.keys(this).forEach((k) => {
        let val = this[k];

        if (!/\D/.test(k)) {
          k = parseInt(k);
          if (k > maxId) {
            maxId = k;
          }
        } else {
          isPureArray = false;
        }

        if (isxdata(val)) {
          val = val.toJSON();
        }

        obj[k] = val;
      });

      if (isPureArray) {
        obj.length = maxId + 1;
        obj = Array.from(obj);
      }

      const xid = this.xid;
      defineProperties$2(obj, {
        xid: {
          get: () => xid,
        },
      });

      return obj;
    }

    toString() {
      return JSON.stringify(this.toJSON());
    }

    extend(obj, desc) {
      return extend(this, obj, desc);
    }

    get(key) {
      if (/\./.test(key)) {
        const keys = key.split(".");
        let target = this;
        for (let i = 0, len = keys.length; i < len; i++) {
          try {
            target = target[keys[i]];
          } catch (error) {
            const err = getErr(
              "failed_to_get_data",
              {
                key: keys.slice(0, i).join("."),
              },
              error
            );

            console.warn(err, {
              key,
              self: this,
            });

            throw err;
          }
        }

        return target;
      }

      return this[key];
    }
    set(key, value) {
      if (/\./.test(key)) {
        const keys = key.split(".");
        const lastKey = keys.pop();
        let target = this;
        for (let i = 0, len = keys.length; i < len; i++) {
          try {
            target = target[keys[i]];
          } catch (error) {
            const err = getErr(
              "failed_to_get_data",
              {
                key: keys.slice(0, i).join("."),
              },
              error
            );

            console.warn(err, {
              key,
              self: this,
            });

            throw err;
          }
        }

        return (target[lastKey] = value);
      }

      return (this[key] = value);
    }
  }

  Stanz.prototype.extend(
    { ...watchFn, ...fn$1 },
    {
      enumerable: false,
    }
  );

  const { defineProperties: defineProperties$1 } = Object;

  const setData = ({ target, key, value, receiver, type, succeed }) => {
    const oldValue = receiver[key];

    let data = value;
    if (isxdata(data)) {
      if (oldValue === value) {
        return true;
      }
      data._owner.push(receiver);
    } else if (isObject(value)) {
      const desc = Object.getOwnPropertyDescriptor(target, key);
      if (!desc || desc.hasOwnProperty("value")) {
        data = new Stanz(value);
        data._owner.push(receiver);
      }
    }

    const isSame = oldValue === value;

    if (!isSame && isxdata(oldValue)) {
      clearData(oldValue, receiver);
    }

    const reval = succeed(data);

    !isSame &&
      // __unupdate: Let the system not trigger an upgrade, system self-use attribute
      !target.__unupdate &&
      emitUpdate({
        type: type || "set",
        target: receiver,
        currentTarget: receiver,
        name: key,
        value,
        oldValue,
      });

    return reval;
  };

  const clearData = (val, target) => {
    if (isxdata(val)) {
      const index = val._owner.indexOf(target);
      if (index > -1) {
        val._owner.splice(index, 1);
      } else {
        const err = getErr("error_no_owner");
        console.warn(err, {
          target,
          mismatch: val,
        });
        console.error(err);
      }
    }
  };

  const handler$1 = {
    set(target, key, value, receiver) {
      if (typeof key === "symbol") {
        return Reflect.set(target, key, value, receiver);
      }

      // Set properties with _ prefix directly
      if (/^_/.test(key)) {
        if (!target.hasOwnProperty(key)) {
          defineProperties$1(target, {
            [key]: {
              writable: true,
              configurable: true,
              value,
            },
          });
        } else {
          Reflect.set(target, key, value, receiver);
        }
        return true;
      }

      try {
        return setData({
          target,
          key,
          value,
          receiver,
          succeed(data) {
            return Reflect.set(target, key, data, receiver);
          },
        });
      } catch (error) {
        const err = getErr(
          "failed_to_set_data",
          {
            key,
          },
          error
        );

        console.warn(err, { target, value });

        throw err;
      }
    },
    deleteProperty(target, key) {
      if (/^_/.test(key) || typeof key === "symbol") {
        return Reflect.deleteProperty(target, key);
      }

      return setData({
        target,
        key,
        value: undefined,
        receiver: target[PROXY],
        type: "delete",
        succeed() {
          return Reflect.deleteProperty(target, key);
        },
      });
    },
  };

  // const tempEl = document.createElement("template");

  const handler = {
    set(target, key, value, receiver) {
      if (!/\D/.test(String(key))) {
        return Reflect.set(target, key, value, receiver);
      }

      if (target[key] === value) {
        // Optimise performance;
        // fix focus remapping caused by 'text' being reset
        return true;
      }

      if (key === "html") {
        // When setting HTML values that contain single quotes, they become double quotes when set, leading to an infinite loop of updates.
        // tempEl.innerHTML = value;
        // value = tempEl.innerHTML;

        // If custom elements are stuffed, the html values may remain inconsistent
        return Reflect.set(target, key, value, receiver);
      }

      return handler$1.set(target, key, value, receiver);
    },
    get(target, key, receiver) {
      if (!/\D/.test(String(key))) {
        return eleX(target.ele.children[key]);
      }

      return Reflect.get(target, key, receiver);
    },
    ownKeys(target) {
      let keys = Reflect.ownKeys(target);
      let len = target.ele.children.length;
      for (let i = 0; i < len; i++) {
        keys.push(String(i));
      }
      return keys;
    },
    getOwnPropertyDescriptor(target, key) {
      if (typeof key === "string" && !/\D/.test(key)) {
        return {
          enumerable: true,
          configurable: true,
        };
      }
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  };

  const renderExtends = {
    beforeRender() {},
    render() {},
  };

  const getRevokes = (target) => target.__revokes || (target.__revokes = []);
  const addRevoke = (target, revoke) => getRevokes(target).push(revoke);

  const convertToFunc = (expr, data, opts) => {
    const funcStr = `
const isRevokedErr = ${isRevokedErr.toString()}
const [$event] = $args;
const {data, errCall} = this;
try{
  with(data){
    return ${expr};
  }
}catch(error){
  if(isRevokedErr(error)){
    return;
  }
  if(data.ele && !data.ele.isConnected){
    return;
  }
  if(errCall){
    const result = errCall(error);
    if(result !== false){
      console.error(error);
    }
  }else{
    console.error(error);
  }
}
`;
    return new Function("...$args", funcStr).bind({ data, ...opts });
  };

  function render({
    data,
    target,
    template,
    temps,
    isRenderSelf,
    ...otherOpts
  }) {
    const content = template && template.innerHTML;

    if (content) {
      target.innerHTML = content;
    }

    renderExtends.beforeRender({
      target,
    });

    const texts = searchEle(target, "xtext");

    const tasks = [];
    const revokes = getRevokes(target);

    // Styles with data() function to monitor and correct rendering
    searchEle(target, "style").forEach((el) => {
      const originStyle = el.innerHTML;

      if (/data\(.+\)/.test(originStyle)) {
        const matchs = Array.from(new Set(originStyle.match(/data\(.+?\)/g))).map(
          (dataExpr) => {
            const expr = dataExpr.replace(/data\((.+)\)/, "$1");
            const func = convertToFunc(expr, data);

            return {
              dataExpr,
              func,
            };
          }
        );

        const renderStyle = () => {
          let afterStyle = originStyle;

          matchs.forEach(({ dataExpr, func }) => {
            afterStyle = afterStyle.replace(dataExpr, func());
          });

          if (el.innerHTML !== afterStyle) {
            el.innerHTML = afterStyle;
          }
        };
        tasks.push(renderStyle);

        const revokeStyle = () => {
          matchs.length = 0;
          removeArrayValue(tasks, renderStyle);
          removeArrayValue(getRevokes(el), revokeStyle);
          removeArrayValue(revokes, revokeStyle);
        };

        addRevoke(el, revokeStyle);
        revokes.push(revokeStyle);
      }
    });

    // Render text nodes
    texts.forEach((el) => {
      const textEl = document.createTextNode("");
      const { parentNode } = el;
      parentNode.insertBefore(textEl, el);
      parentNode.removeChild(el);

      const func = convertToFunc(el.getAttribute("expr"), data);
      const renderFunc = () => {
        const content = func();
        if (textEl.textContent !== String(content)) {
          textEl.textContent = content;
        }
      };
      tasks.push(renderFunc);

      const textRevoke = () => {
        removeArrayValue(revokes, textRevoke);
        removeArrayValue(tasks, renderFunc);
        removeArrayValue(getRevokes(textEl), textRevoke);
      };
      revokes.push(textRevoke);
      addRevoke(textEl, textRevoke);
    });

    const eles = searchEle(target, `[x-bind-data]`);

    if (isRenderSelf && meetsEle(target, `[x-bind-data]`)) {
      eles.unshift(target);
    }

    // Render properties based on expressions
    eles.forEach((el) => {
      const bindData = JSON.parse(el.getAttribute("x-bind-data"));

      const $el = eleX(el);

      for (let [actionName, arr] of Object.entries(bindData)) {
        arr.forEach((args) => {
          try {
            const { always } = $el[actionName];
            let afterArgs = [];

            let workResult;

            const work = () => {
              const [key, expr] = args;

              const func = convertToFunc(expr, data, {
                errCall: (error) => {
                  const errorExpr = `:${key}="${expr}"`;
                  const err = getErr(
                    "render_el_error",
                    {
                      expr: errorExpr,
                    },
                    error
                  );

                  console.warn(err, {
                    target: $el.ele,
                    errorExpr,
                  });
                  console.error(err);

                  return false;
                },
              });

              afterArgs = [key, func];

              const reval = $el[actionName](...afterArgs, {
                actionName,
                target: $el,
                data,
                beforeArgs: args,
                args: afterArgs,
              });

              renderExtends.render({
                step: "refresh",
                args,
                name: actionName,
                target: $el,
              });

              return reval;
            };

            let clearRevs = () => {
              const { revoke: methodRevoke } = $el[actionName];

              if (methodRevoke) {
                methodRevoke({
                  actionName,
                  target: $el,
                  data,
                  beforeArgs: args,
                  args: afterArgs,
                  result: workResult,
                });
              }

              removeArrayValue(revokes, clearRevs);
              removeArrayValue(getRevokes(el), clearRevs);
              removeArrayValue(tasks, work);
              clearRevs = null;
            };

            if (always) {
              // Run every data update
              tasks.push(work);
            } else {
              workResult = work();
            }

            revokes.push(clearRevs);
            if (el !== target) {
              addRevoke(el, clearRevs);
            }
          } catch (error) {
            const err = getErr(
              "xhear_eval",
              {
                name: actionName,
                arg0: args[0],
                arg1: args[1],
              },
              error
            );
            console.warn(err, el);
            throw err;
          }
        });
      }

      el.removeAttribute("x-bind-data");

      el._bindingRendered = true;
      el.dispatchEvent(new Event("binding-rendered"));
    });

    if (!target.__render_temps && !isEmptyObject(temps)) {
      target.__render_temps = temps;
    }

    if (tasks.length) {
      if (target.__render_data && target.__render_data !== data) {
        const err = getErr("xhear_listen_already");

        console.warn(err, {
          element: target,
          old: target.__render_data,
          new: data,
        });

        throw err;
      }

      target.__render_data = data;

      tasks.forEach((f) => f());

      // After the data changes, traverse the rendering tasks
      const wid = data.watchTick((e) => {
        if (tasks.length) {
          tasks.forEach((f) => f());
        } else {
          data.unwatch(wid);
        }
      });
    }

    renderExtends.render({ step: "init", target });
  }

  const convertEl = (el) => {
    const { tagName } = el;

    if (tagName === "TEMPLATE") {
      return;
    }

    if (tagName) {
      // Converting elements
      const obj = {};

      Array.from(el.attributes).forEach((attr) => {
        const matchData = /(.*):(.+)/.exec(attr.name);

        if (!matchData) {
          return;
        }

        let [, actionName, param0] = matchData;

        if (!actionName) {
          actionName = "prop";
        }

        const targetActions = obj[actionName] || (obj[actionName] = []);

        targetActions.push([param0, attr.value]);

        el.removeAttribute(attr.name);
      });

      const keys = Object.keys(obj);

      if (keys.length) {
        el.setAttribute("x-bind-data", JSON.stringify(obj));
      }
    }

    Array.from(el.children).forEach(convertEl);
  };

  const searchTemp = (template, expr, func) => {
    const rearr = Array.from(template.content.querySelectorAll(expr));

    if (func) {
      rearr.forEach(func);
    }

    return rearr;
  };

  let isWarned;

  const convert = (template) => {
    let temps = {};
    const codeEls = {};

    searchTemp(template, "code", (code) => {
      const cid = getRandomId();
      code.setAttribute("code-id", cid);

      codeEls[cid] = code.innerHTML;
      code.innerHTML = "";
    });

    template.innerHTML = template.innerHTML.replace(
      /{{(.+?)}}/g,
      (str, match) => {
        return `<xtext expr="${match}"></xtext>`;
      }
    );

    const tempName = template.getAttribute("name");

    if (tempName) {
      const tempChilds = template.content.children;
      if (tempChilds.length > 1) {
        if (!isWarned) {
          const err = getErr("temp_multi_child");
          console.warn(err, {
            content: template.content,
          });
          isWarned = 1;
        }

        const wrapName = `wrapper-${tempName}`;
        template.innerHTML = `<div ${wrapName} style="display:contents">${template.innerHTML}</div>`;
        console.warn(
          getErr("temp_wrap_child", {
            tempName,
            len: tempChilds.length,
            wrapName,
          })
        );
      }
      temps[tempName] = template;
      template.remove();
    }

    searchTemp(template, "x-fill:not([name])", (fillEl) => {
      if (fillEl.querySelector("x-fill:not([name])")) {
        throw getErr("xhear_dbfill_noname");
      }

      if (fillEl.innerHTML.trim()) {
        const tid = `t${getRandomId()}`;
        fillEl.setAttribute("name", tid);

        const temp = document.createElement("template");
        temp.setAttribute("name", tid);
        temp.innerHTML = fillEl.innerHTML;
        fillEl.innerHTML = "";
        fillEl.appendChild(temp);
      }
    });

    searchTemp(template, "x-if,x-else-if,x-else", (condiEl) => {
      const firstChild = condiEl.children[0];
      if (!firstChild || firstChild.tagName !== "TEMPLATE") {
        condiEl.innerHTML = `<template condition>${condiEl.innerHTML}</template>`;
      }
    });

    searchTemp(template, "template", (e) => {
      const newTemps = convert(e);

      Object.keys(newTemps).forEach((tempName) => {
        if (temps[tempName]) {
          throw getErr("xhear_temp_exist", {
            name: tempName,
          });
        }
      });

      temps = { ...temps, ...newTemps };
    });

    Array.from(template.content.children).forEach((el) => convertEl(el));

    // Restore the contents of the code
    for (let [key, value] of Object.entries(codeEls)) {
      searchTemp(template, `[code-id="${key}"]`, (el) => {
        el.removeAttribute("code-id");
        // el.innerHTML = htmlEncode(value);
        el.innerHTML = value;
      });
    }

    return temps;
  };

  const getVal = (val) => {
    if (isFunction(val)) {
      return val();
    }

    return val;
  };

  const defaultData = {
    prop(...args) {
      let [name, value] = args;

      if (args.length === 1) {
        return this[name];
      }

      value = getVal(value);
      name = hyphenToUpperCase(name);

      this.set(name, value);
    },
    attr(...args) {
      let [name, value] = args;

      if (args.length === 1) {
        return this.ele.getAttribute(name);
      }

      value = getVal(value);

      if (value === false) {
        value = null;
      } else if (value === true) {
        value = "";
      }

      if (value === null || value === undefined) {
        this.ele.removeAttribute(name);
      } else {
        this.ele.setAttribute(name, value);
      }
    },
    class(...args) {
      let [name, value] = args;

      if (args.length === 1) {
        return this.ele.classList.contains(name);
      }

      value = getVal(value);

      if (value) {
        this.ele.classList.add(name);
      } else {
        this.ele.classList.remove(name);
      }
    },
    watch(...args) {
      if (args.length < 3) {
        return watchFn.watch.apply(this, args);
      }

      const options = args[2];
      const { beforeArgs, data: target } = options;
      const [selfPropName, targetPropName] = beforeArgs;
      const propName = hyphenToUpperCase(selfPropName);

      const setData = () => {
        let val = this.get(propName);
        target.set(targetPropName, val);
      };

      const wid = this.watch((e) => {
        if (e.hasModified(propName)) {
          setData();
        }
      });

      // Initialize once
      setData();

      return () => {
        this.unwatch(wid);
      };
    },
  };

  defaultData.prop.always = true;
  defaultData.attr.always = true;
  defaultData.class.always = true;

  defaultData.prop.revoke = ({ target, args, $ele, data }) => {
    const propName = args[0];
    target.set(propName, null);
  };

  defaultData.watch.revoke = (e) => {
    e.result();
    const propName = e.beforeArgs[1];
    e.data.set(propName, null);
  };

  const syncFn = {
    sync(propName, targetName, options) {
      if (!options) {
        throw getErr("xhear_sync_no_options");
      }

      [propName, targetName] = options.beforeArgs;

      propName = hyphenToUpperCase(propName);
      targetName = hyphenToUpperCase(targetName);

      const { data } = options;

      const val = data.get(targetName);

      if (val instanceof Object) {
        const err = getErr("xhear_sync_object_value", { targetName });
        console.warn(err, data);
        throw err;
      }

      this[propName] = data.get(targetName);

      const wid1 = this.watch((e) => {
        if (e.hasModified(propName)) {
          try {
            const value = this.get(propName);
            data.set(targetName, value);
          } catch (err) {
            // Errors are reported when a proxy is revoked.
            // console.warn(err);
          }
        }
      });

      const wid2 = data.watch((e) => {
        if (e.hasModified(targetName)) {
          try {
            const value = data.get(targetName);
            this.set(propName, value);
          } catch (err) {
            // Errors are reported when a proxy is revoked.
            // console.warn(err);
          }
        }
      });

      return () => {
        this.unwatch(wid1);
        if (!dataRevoked(data)) {
          data.unwatch(wid2);
        }
      };
    },
  };

  syncFn.sync.revoke = (e) => {
    e.result();
  };

  function getBindOptions(name, func, options) {
    let revoker;
    if (options) {
      const beforeValue = options.beforeArgs[1];

      if (!/[^\d\w_\$\.]/.test(beforeValue)) {
        func = options.data.get(beforeValue);
        if (!func) {
          const tag = options.data.tag;
          const err = getErr("not_found_func", {
            name: beforeValue,
            tag: tag ? `"${tag}"` : "",
          });
          console.warn(err, " target =>", options.data);
          throw err;
        }
        func = func.bind(options.data);
      }

      revoker = () => this.ele.removeEventListener(name, func);
    }

    return { revoker, name, func };
  }

  const eventFn = {
    on(...args) {
      const { revoker, name, func } = getBindOptions.call(this, ...args);

      this.ele.addEventListener(name, func);

      if (revoker) {
        return revoker;
      }

      return this;
    },
    one(...args) {
      const { revoker, name, func } = getBindOptions.call(this, ...args);

      let callback = (e) => {
        this.off(name, callback);
        func(e);
      };

      this.ele.addEventListener(name, callback);

      if (revoker) {
        return revoker;
      }

      return this;
    },
    off(name, func) {
      this.ele.removeEventListener(name, func);
      return this;
    },
    emit(name, opts) {
      const options = { ...opts };

      let data;
      if (options.hasOwnProperty("data")) {
        data = options.data;
        delete options.data;
      }

      let event;

      if (name instanceof Event) {
        event = name;
      } else if (name) {
        event = new Event(name, { bubbles: true, ...options });
      }

      data && (event.data = data);

      this.ele.dispatchEvent(event);

      return this;
    },
  };

  eventFn.on.revoke = (e) => {
    e.result();
  };

  eventFn.one.revoke = (e) => {
    e.result();
  };

  const originSplice = (ele, start, count, ...items) => {
    const { children } = ele;
    if (start < 0) {
      start += ele.children.length;
    }

    if (count === undefined) {
      count = ele.children.length - start;
    }

    const removes = [];
    for (let i = start, len = start + count; i < len; i++) {
      const target = children[i];
      removes.push(target);
    }

    removes.forEach((el) => el && el.remove());

    if (items.length) {
      const frag = document.createDocumentFragment();
      items.forEach((e) => frag.append(createXEle(e).ele));

      const positionEle = children[start];
      if (positionEle) {
        ele.insertBefore(frag, positionEle);
      } else {
        ele.appendChild(frag);
      }
    }

    return removes;
  };

  const mutatingMethods = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "reverse",
    "sort",
    "fill",
    "copyWithin",
  ];

  const likeArrayFn = {
    push(...args) {
      const { ele } = this;

      originSplice(ele, ele.children.length, 0, ...args);

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "push",
      });

      return ele.children.length;
    },

    pop(...args) {
      const { ele } = this;

      const targets = originSplice(ele, ele.children.length - 1, 1, ...args);

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "pop",
      });

      return eleX(targets[0]);
    },

    shift(...args) {
      const { ele } = this;

      const targets = originSplice(ele, 0, 1, ...args);

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "shift",
      });

      return eleX(targets[0]);
    },

    unshift(...args) {
      const { ele } = this;

      originSplice(ele, 0, 0, ...args);

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "unshift",
      });

      return ele.children.length;
    },
    splice(...args) {
      const reVal = originSplice(this.ele, ...args);

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "splice",
      });

      return reVal.map(eleX);
    },
    reverse(...args) {
      const childs = Array.from(this.ele.childNodes);

      arrayFn.reverse.call(childs, ...args);

      const frag = document.createDocumentFragment();

      childs.forEach((ele) => {
        // Identify internal operations to prevent detached corrections
        ele.__internal = 1;
        frag.append(ele);
      });

      this.ele.append(frag);

      childs.forEach((ele) => {
        delete ele.__internal;
      });

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "reverse",
      });

      return this;
    },
    sort(...args) {
      const childs = Array.from(this.ele.children).map(eleX);

      arrayFn.sort.call(childs, ...args);

      const frag = document.createDocumentFragment();

      childs.forEach((e) => {
        e.ele.__internal = 1;
        frag.append(e.ele);
      });

      this.ele.append(frag);

      childs.forEach((e) => {
        delete e.ele.__internal;
      });

      emitUpdate({
        type: "array",
        currentTarget: this,
        target: this,
        args,
        name: "sort",
      });

      return this;
    },
  };

  const arrayFn = Array.prototype;

  Object.keys(Object.getOwnPropertyDescriptors(arrayFn)).forEach((key) => {
    if (
      key === "constructor" ||
      key === "length" ||
      mutatingMethods.includes(key)
    ) {
      return;
    }

    const targetFunc = arrayFn[key];

    if (isFunction(targetFunc)) {
      likeArrayFn[key] = function (...args) {
        return targetFunc.apply(Array.from(this.ele.children).map(eleX), args);
      };
    }
  });

  class LikeArray {}

  for (let [name, value] of Object.entries(likeArrayFn)) {
    Object.defineProperty(LikeArray.prototype, name, {
      value,
    });
  }

  const stanz = (data) => {
    return new Stanz(data);
  };

  Object.assign(stanz, { is: isxdata });

  const { defineProperty, assign } = Object;

  const hasValueEleNames = ["input", "textarea", "select"];

  const setKeys = (keys, $ele) => {
    const { ele } = $ele;

    keys.forEach((k) => {
      if (k in ele) {
        let isNum = false;
        defineProperty($ele, k, {
          enumerable: true,
          get: () => {
            let val = ele[k];
            if (isNum) {
              if (/\D/.test(val)) {
                isNum = false;
              } else {
                val = Number(val);
              }
            }
            return val;
          },
          set: (val) => {
            isNum = typeof val === "number";
            ele[k] = val;
          },
        });
      }
    });
  };

  const formEleNames = new Set([
    ...hasValueEleNames,
    "option",
    "button",
    "label",
    "fieldset",
    "legend",
    "form",
  ]);

  const bindProp = ($ele, opts = {}) => {
    const { name: keyName, type } = opts;

    const { ele } = $ele;
    let old = ele[keyName];

    $ele.on(type, () => {
      emitUpdate({
        type: "set",
        target: $ele,
        currentTarget: $ele,
        name: keyName,
        value: ele[keyName],
        oldValue: old,
      });

      old = ele[keyName];
    });
  };

  const initFormEle = ($ele) => {
    const { tag } = $ele;

    if (!formEleNames.has(tag)) {
      return;
    }

    setKeys(["type", "name", "disabled"], $ele);

    switch (tag) {
      case "input":
        initInput($ele);
        break;
      case "textarea":
        setKeys(["value"], $ele);
        bindProp($ele, { name: "value", type: "input" });
        break;
      case "option":
        setKeys(["selected", "value"], $ele);
        break;
      case "select":
        {
          const { ele } = $ele;
          $ele.__unupdate = 1;
          $ele.value = ele.value;
          delete $ele.__unupdate;

          $ele.watch(() => {
            ele.value = $ele.value;
          });
          $ele.on("change", () => {
            $ele.value = ele.value;
          });
        }
        break;
    }
  };

  const initInput = ($ele) => {
    const type = $ele.attr("type");

    switch (type) {
      case "file":
        setKeys(["multiple", "files"], $ele);
        bindProp($ele, { name: "files", type: "change" });
        break;
      case "checkbox":
        setKeys(["checked", "multiple", "value"], $ele);
        bindProp($ele, { name: "checked", type: "change" });
        break;
      case "radio":
        setKeys(["checked", "value"], $ele);
        bindProp($ele, { name: "checked", type: "change" });
        break;
      case "text":
      default:
        setKeys(["placeholder", "value"], $ele);
        bindProp($ele, { name: "value", type: "input" });
        break;
    }
  };

  const getFormData = (target, expr) => {
    const data = {};

    target.all(expr).forEach(($el) => {
      const { name, tag, ele } = $el;

      if (tag === "input") {
        switch ($el.type) {
          case "checkbox":
            if (!(name in data)) {
              data[name] = [];
            }

            if (ele.checked) {
              data[name].push(ele.value);
            }
            break;
          case "radio":
            if (ele.checked) {
              data[name] = ele.value;
            }
            break;
          case "file":
            data[name] = ele.files;
            break;
          default:
            data[name] = ele.value;
        }
      } else if (tag === "textarea") {
        data[name] = ele.value;
      } else if (tag === "select") {
        const selectedsOpt = searchEle(ele, `option:checked`);

        if (ele.multiple) {
          data[name] = selectedsOpt.map((e) => e.value || e.textContent);
        } else {
          const [e] = selectedsOpt;
          data[name] = e.value || e.textContent;
        }
      } else {
        // custom element
        data[name] = $el.value;
      }
    });

    return data;
  };

  var formFn = {
    // This method is still being tested
    formData(expr, opts = { wait: 200 }) {
      const data = stanz({});

      assign(data, getFormData(this, expr || "input,select,textarea"));

      const wid1 = this.watchTick((e) => {
        const newData = getFormData(this, expr || "input,select,textarea");
        mergeObjects(data, newData);
      }, opts.wait);

      const wid2 = data.watchTick((e) => {
        resetValue(this, expr || "input,select,textarea", data);
      });

      const _this = this;

      const oldRevoke = data.revoke;
      data.extend({
        revoke() {
          _this.unwatch(wid1);
          data.unwatch(wid2);
          oldRevoke.call(this);
        },
      });

      return data;
    },
  };

  function resetValue(el, expr, data) {
    const eles = el.all(expr);

    Object.keys(data).forEach((name) => {
      const targets = eles.filter((e) => e.attr("name") === name);

      if (targets.length === 0) {
        return;
      }

      const val = data[name];
      const target = targets[0];
      const type = target.attr("type");
      if (targets.length === 1) {
        let isUseValue = true;

        if (target.tag === "input" && (type === "radio" || type === "checkbox")) {
          isUseValue = false;
        }

        if (isUseValue) {
          if (target.value !== val) {
            target.value = val;
          }
          return;
        }
      }

      // checkbox or radio
      targets.forEach((e) => {
        switch (e.attr("type")) {
          case "radio":
            if (e.value === val) {
              e.checked = true;
            } else {
              e.checked = false;
            }
            break;
          case "checkbox":
            e.checked = val.includes(e.value);
            break;
        }
      });
    });
  }

  const cssHandler = {
    set(target, key, value, receiver) {
      target._ele.style[key] = value;
      Reflect.set(target, key, value, receiver);
      return true;
    },
    get(target, key, receiver) {
      if (key === "length") {
        return 0;
      }

      const { style } = target._ele;
      if (Array.from(style).includes(key)) {
        return style[key];
      }

      return getComputedStyle(target._ele)[key];
    },
  };

  class XhearCSS {
    constructor($el) {
      const obj = {};

      Object.defineProperty(obj, "_ele", {
        enumerable: false,
        get: () => $el.ele,
      });

      const { style } = $el.ele;

      Array.from(style).forEach((key) => {
        obj[key] = style[key];
      });

      return ($el._css = new Proxy(obj, cssHandler));
    }
  }

  var cssFn = {
    get css() {
      return new XhearCSS(this);
    },
    set css(d) {
      if (getType$1(d) == "string") {
        this.ele.style = d;
        return;
      }

      let { style } = this;

      // Covering the old style
      let nextKeys = Object.keys(d);

      // Clear the unused key
      Array.from(style).forEach((k) => {
        if (!nextKeys.includes(k)) {
          style[k] = "";
        }
      });

      Object.assign(style, d);
    },
  };

  function $(expr) {
    if (getType$1(expr) === "string" && !/<.+>/.test(expr)) {
      const ele = document.querySelector(expr);

      return eleX(ele);
    }

    return createXEle(expr);
  }

  Object.defineProperties($, {
    // Convenient objects for use as extensions
    extensions: {
      value: {},
    },
  });

  const COMPS = {};

  const renderElement = ({ defaults, ele, template, temps }) => {
    let $ele;

    try {
      const data = {
        ...deepCopyData(defaults.data, defaults.tag),
        ...defaults.attrs,
      };

      defaults.attrs &&
        Object.keys(defaults.attrs).forEach((name) => {
          const value = ele.getAttribute(toDashCase(name));
          if (value !== null && value !== undefined) {
            data[name] = value;
          }
        });

      $ele = eleX(ele);

      defaults.proto && $ele.extend(defaults.proto, { enumerable: false });

      for (let [key, value] of Object.entries(data)) {
        if (!$ele.hasOwnProperty(key)) {
          $ele[key] = value;
        }
      }

      if (defaults.temp) {
        const root = ele.attachShadow({ mode: "open" });

        root.innerHTML = template.innerHTML;

        render({
          target: root,
          data: $ele,
          temps,
        });
      }

      defaults.ready && defaults.ready.call($ele);
    } catch (error) {
      throw getErr(
        "xhear_reander_err",
        {
          tag: ele.tagName.toLowerCase(),
        },
        error
      );
    }

    if (defaults.watch) {
      const wen = Object.entries(defaults.watch);

      $ele.watchTick((e) => {
        for (let [name, func] of wen) {
          const names = name.split(",");

          if (names.length >= 2) {
            if (names.some((name) => e.hasModified(name))) {
              func.call(
                $ele,
                names.map((name) => $ele[name]),
                {
                  watchers: e,
                }
              );
            }
          } else {
            if (e.hasModified(name)) {
              func.call($ele, $ele[name], {
                watchers: e,
              });
            }
          }
        }
      });

      for (let [name, func] of wen) {
        const names = name.split(",");
        if (names.length >= 2) {
          func.call(
            $ele,
            names.map((name) => $ele[name]),
            {}
          );
        } else {
          func.call($ele, $ele[name], {});
        }
      }
    }

    // {
    //   // 将组件上的变量重定义到影子节点内的css变量上
    //   const { tag } = $ele;

    //   if ($ele.__rssWid) {
    //     $ele.unwatch($ele.__rssWid);
    //   }

    //   // 排除掉自定义组件
    //   if (tag !== "x-if" && tag !== "x-fill" && ele.shadowRoot) {
    //     // 需要更新的key
    //     const keys = Object.keys({
    //       ...defaults.data,
    //       ...defaults.attrs,
    //     });

    //     for (let [key, item] of Object.entries(
    //       Object.getOwnPropertyDescriptors(defaults.proto)
    //     )) {
    //       if (item.writable || item.get) {
    //         keys.push(key);
    //       }
    //     }

    //     const refreshShadowStyleVar = () => {
    //       let shadowVarStyle = ele.shadowRoot.querySelector("#shadow-var-style");

    //       if (!shadowVarStyle) {
    //         shadowVarStyle = document.createElement("style");
    //         shadowVarStyle.id = "shadow-var-style";
    //         ele.shadowRoot.appendChild(shadowVarStyle);
    //       }

    //       // 更新所有变量
    //       let content = "";
    //       let slotContent = "";
    //       keys.forEach((key) => {
    //         const val = $ele[key];
    //         const valType = getType(val);
    //         if (valType === "number" || valType === "string") {
    //           content += `--${key}:${val};`;
    //           slotContent += `--${key}:;`;
    //         }
    //       });

    //       const styleContent = `:host > *:not(slot) {${content}} slot{${slotContent}}`;

    //       if (shadowVarStyle.innerHTML !== styleContent) {
    //         shadowVarStyle.innerHTML = styleContent;
    //       }
    //     };

    //     $ele.__rssWid = $ele.watchTick(() => refreshShadowStyleVar());

    //     refreshShadowStyleVar();
    //   }
    // }
  };

  const register = (opts = {}) => {
    const defaults = {
      // Registered component name
      tag: "",
      // Body content string
      temp: "",
      // Initialization data after element creation
      data: {},
      // Values that will not be traversed
      proto: {},
      // Keys bound to attributes
      // attrs: {},
      // The listener function for the element
      // watch: {},
      // Function triggered when the component is created (data initialization complete)
      // created() { },
      // Function triggered after component data initialization is complete (initial rendering completed)
      // ready() { },
      // Functions that are added to the document trigger
      // attached() { },
      // Functions triggered by moving out of the document
      // detached() { },
      // The container element is changed
      // slotchange() { }
      ...opts,
    };

    const { fn } = $;
    if (fn) {
      // 检查 proto 和 data 上的key，是否和fn上的key冲突
      Object.keys(defaults.data).forEach((name) => {
        if (fn.hasOwnProperty(name)) {
          throw getErr("invalid_key", {
            compName: defaults.tag,
            targetName: "data",
            name,
          });
        }
      });
      Object.keys(defaults.proto).forEach((name) => {
        if (fn.hasOwnProperty(name)) {
          console.warn(
            getErrDesc("invalid_key", {
              compName: defaults.tag,
              targetName: "proto",
              name,
            }),
            opts
          );
        }
      });
    }

    let template, temps, name;

    try {
      validateTagName(defaults.tag);

      defaults.data = deepCopyData(defaults.data, defaults.tag);

      name = capitalizeFirstLetter(hyphenToUpperCase(defaults.tag));

      if (COMPS[name]) {
        throw getErr("xhear_register_exists", { name });
      }

      template = document.createElement("template");
      template.innerHTML = defaults.temp;
      temps = convert(template);
    } catch (error) {
      throw getErr("xhear_register_err", { tag: defaults.tag }, error);
    }

    const getAttrKeys = (attrs) => {
      let attrKeys;

      if (attrs instanceof Array) {
        attrKeys = [...attrs];
      } else {
        attrKeys = Object.keys(attrs);
      }

      return attrKeys;
    };

    const XElement = (COMPS[name] = class extends HTMLElement {
      constructor(...args) {
        super(...args);

        const $ele = eleX(this);

        defaults.created && defaults.created.call($ele);

        if (defaults.attrs) {
          const attrKeys = getAttrKeys(defaults.attrs);

          // fix self attribule value
          $ele.watchTick((e) => {
            attrKeys.forEach((key) => {
              if (e.hasModified(key)) {
                const val = $ele[key];
                const attrName = toDashCase(key);
                const oldVal = this.getAttribute(attrName);
                if (val === null || val === undefined) {
                  this.removeAttribute(attrName);
                } else if (oldVal !== val) {
                  let reval = val;

                  const valType = getType$1(val);

                  if (valType === "number" && oldVal === String(val)) {
                    // Setting the number will cause an infinite loop
                    return;
                  }
                  if (valType === "object") {
                    // Setting the object will cause an infinite loop
                    reval = JSON.stringify(reval);
                    if (reval === oldVal) {
                      return;
                    }
                  }

                  this.setAttribute(attrName, reval);
                }
              }
            });
          });

          // The data set before initialization needs to be reflected in attrs
          attrKeys.forEach((key) => {
            if (
              $ele[key] !== null &&
              $ele[key] !== undefined &&
              $ele[key] !== defaults.attrs[key]
            ) {
              this.setAttribute(toDashCase(key), $ele[key]);
            }
          });
        }

        renderElement({
          defaults,
          ele: this,
          template,
          temps,
        });
      }

      connectedCallback() {
        if (isInternal(this)) {
          return;
        }

        defaults.attached && defaults.attached.call(eleX(this));
      }

      disconnectedCallback() {
        if (isInternal(this)) {
          return;
        }

        defaults.detached && defaults.detached.call(eleX(this));
      }

      attributeChangedCallback(name, oldValue, newValue) {
        const $ele = eleX(this);

        if (!/[^\d.]/.test(newValue) && typeof $ele[name] === "number") {
          newValue = Number(newValue);
        }

        $ele[hyphenToUpperCase(name)] = newValue;
      }

      static get observedAttributes() {
        return getAttrKeys(defaults.attrs || {}).map((e) => toDashCase(e));
      }
    });

    if (document.readyState !== "loading") {
      customElements.define(defaults.tag, XElement);
    } else {
      const READYSTATE = "readystatechange";
      let f;
      document.addEventListener(
        READYSTATE,
        (f = () => {
          customElements.define(defaults.tag, XElement);
          document.removeEventListener(READYSTATE, f);
        })
      );
    }
  };

  function isInternal(ele) {
    let target = ele;

    while (target) {
      if (target.__internal) {
        return true;
      }

      target = target.parentNode || target.host;

      if (!target || (target.tagName && target.tagName === "BODY")) {
        break;
      }
    }

    return false;
  }

  function validateTagName(str) {
    // Check if the string has at least one '-' character
    if (!str.includes("-")) {
      throw getErr("xhear_tag_noline", { str });
    }

    // Check if the string starts or ends with '-'
    if (str.charAt(0) === "-" || str.charAt(str.length - 1) === "-") {
      throw getErr("xhear_validate_tag", { str });
    }

    // Check if the string has consecutive '-' characters
    for (let i = 0; i < str.length - 1; i++) {
      if (str.charAt(i) === "-" && str.charAt(i + 1) === "-") {
        throw getErr("xhear_validate_tag", { str });
      }
    }

    return true;
  }

  function deepCopyData(obj, tag = "") {
    if (obj instanceof Set || obj instanceof Map) {
      throw getErr("xhear_regster_data_noset", { tag });
    }

    if (obj instanceof Function) {
      throw getErr("xhear_regster_data_nofunc", { tag });
    }

    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const copy = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepCopyData(obj[key], tag);
      }
    }

    return copy;
  }

  class FakeNode extends Comment {
    constructor(markname) {
      const tagText = `Fake Node${markname ? ": " + markname : ""}`;

      super(` ${tagText} --end `);

      this._mark = markname;
      this._inited = false;

      const startCom = new Comment(` ${tagText} --start `);
      startCom.__fake_end = this;

      Object.defineProperty(this, "_start", {
        value: startCom,
      });
    }

    init() {
      if (this._inited) {
        return;
      }

      this.parentNode.insertBefore(this._start, this);
      this._inited = true;
    }

    querySelector(expr) {
      return this.__searchEl(expr, "find");
    }

    querySelectorAll(expr) {
      return this.__searchEl(expr);
    }

    __searchEl(expr, funcName = "filter") {
      const startParent = this.parentNode;
      if (!startParent) return [];

      const childs = this.children;

      return Array.from(startParent.querySelectorAll(expr))[funcName]((e) => {
        let par = e;
        while (true) {
          if (childs.includes(par)) {
            return true;
          }

          par = par.parentNode;

          if (!par) {
            break;
          }
        }
      });
    }

    insertBefore(newEle, target) {
      const { parentNode } = this;

      if (Array.from(parentNode.children).includes(target)) {
        parentNode.insertBefore(newEle, target);
      } else {
        parentNode.insertBefore(newEle, this);
      }
    }

    appendChild(newEle) {
      this.parentNode.insertBefore(newEle, this);
    }

    get children() {
      const childs = [];

      let prev = this;
      while (true) {
        prev = prev.previousSibling;

        if (prev) {
          if (prev instanceof HTMLElement) {
            childs.unshift(prev);
          } else if (prev === this._start) {
            break;
          }
        } else {
          throw getErr("xhear_fakenode_unclose", { name: "children" });
        }
      }

      return childs;
    }

    get childNodes() {
      const childs = [];

      let prev = this;
      while (true) {
        prev = prev.previousSibling;

        if (prev) {
          if (prev === this._start) {
            break;
          }
          childs.unshift(prev);
        } else {
          throw getErr("xhear_fakenode_unclose", { name: "childNodes" });
        }
      }

      return childs;
    }

    set innerHTML(val) {
      this.childNodes.forEach((e) => {
        e.remove();
      });

      const temp = document.createElement("template");
      temp.innerHTML = val;

      Array.from(temp.content.childNodes).forEach((e) => {
        this.appendChild(e);
      });
    }

    get innerHTML() {
      const { children } = this;
      let content = "";

      children.forEach((e) => {
        content += e.outerHTML + "\n";
      });

      return content;
    }

    get nextElementSibling() {
      let next = this.nextSibling;

      if (!next) {
        return null;
      }

      if (next.__fake_end) {
        return next.__fake_end;
      }

      if (next && !(next instanceof Element)) {
        next = next.nextElementSibling;
      }

      return next;
    }

    get previousElementSibling() {
      const { _start } = this;
      let prev = _start.previousSibling;

      if (!prev) {
        return null;
      }

      if (prev instanceof FakeNode) {
        return prev;
      }

      return _start.previousElementSibling;
    }
  }

  const replaceTempInit = (_this) => {
    const parent = _this.parentNode;
    if (parent) {
      const parent = _this.parentNode;
      Array.from(_this.content.children).forEach((e) => {
        parent.insertBefore(e, _this);
      });

      _this.remove();
    }
  };

  if (isSafariBrowser()) {
    renderExtends.beforeRender = ({ target }) => {
      let replaces = [];
      while (true) {
        replaces = Array.from(
          target.querySelectorAll('template[is="replace-temp"]')
        );

        if (!replaces.length) {
          break;
        }

        replaces.forEach((temp) => {
          replaceTempInit(temp);
        });
      }
    };
  } else {
    class ReplaceTemp extends HTMLTemplateElement {
      constructor() {
        super();
        this.init();
      }

      init() {
        replaceTempInit(this);
      }

      connectedCallback() {
        this.init();
      }
    }

    customElements.define("replace-temp", ReplaceTemp, {
      extends: "template",
    });
  }

  /**
   * `x-if` first replaces all neighboring conditional elements with token elements and triggers the rendering process once; the rendering process is triggered again after each `value` change.
   * The rendering process is as follows:
   * 1. First, collect all conditional elements adjacent to `x-if`.
   * 2. Mark these elements and wait for the `value` of each conditional element to be set successfully before proceeding to the next step.
   * 3. Based on the marking, perform a judgment operation asynchronously, the element that satisfies the condition first will be rendered; after successful rendering, the subsequent conditional elements will clear the rendered content.
   */


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
          if (this._fake.parentNode) {
            eleX(this._fake.parentNode).refresh();
          }

          // const fakeParent = eleX(this._fake.parentNode);
          // fakeParent.refresh();
          // fakeParent.host && fakeParent.host.refresh({ unupdate: 1 });
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

        this.emit("rendered", {
          bubbles: false,
        });
      },
      _clearContent() {
        if (!this.__rendered) {
          return;
        }

        this.__rendered = false;

        revokeAll(this._fake);
        this._fake.innerHTML = "";

        this.emit("clear", {
          bubbles: false,
        });
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

  const getRenderData = (target) => {
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

  register({
    tag: "x-fill",
    data: {
      value: null,
    },
    watch: {
      value(value, t) {
        this.refreshValue(t?.watchers);
      },
    },
    proto: {
      refreshValue(watchers) {
        const arrayData = this.value;

        if (!this._bindend) {
          return;
        }

        const childs = this._fake.children;

        if (!arrayData) {
          childs.forEach((e) => revokeAll(e));
          this._fake.innerHTML = "";
          return;
        }

        if (!(arrayData instanceof Array)) {
          console.warn(
            getErr("fill_type", {
              type: getType(arrayData),
            })
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

        const { data, temps } = regData;

        const targetTemp = temps[this._name];

        const keyName = this.attr("fill-key") || "xid";

        if (!childs.length) {
          const frag = document.createDocumentFragment();

          arrayData.forEach((e, i) => {
            const $ele = createItem(
              e,
              temps,
              targetTemp,
              data.$host || data,
              i,
              keyName
            );
            frag.appendChild($ele.ele);
          });

          this._fake.appendChild(frag);
        } else {
          if (watchers) {
            const isReplaced = watchers.some((e) => e.path.length <= 1);

            if (!isReplaced) {
              // It is not a replacement, it can be corrected by binding the item internally.
              return;
            }
          }

          const vals = arrayData.slice();
          const valsKeys = new Set(
            vals.map((e) => {
              const val = e[keyName];
              return val === undefined ? e : val;
            })
          );

          const { parentNode } = this._fake;

          if (keyName !== "xid" && vals.length !== valsKeys.size) {
            const err = getErr("fill_key_duplicates");
            console.error(err);
            console.warn(err, {
              parentNode,
              host: eleX(parentNode)?.host?.ele,
            });
          }

          // const positionKeys = childs.map((e) => e._data_xid || e);
          // Delete non-existing projects in advance (used to improve performance, this step can be removed and the above comment is turned on)
          const positionKeys = [];
          for (let i = 0, len = childs.length; i < len; i++) {
            const e = childs[i];
            const key = e._data_xid || e;

            if (!valsKeys.has(key)) {
              // If it no longer exists, delete it in advance.
              revokeAll(e);
              e.remove();
              childs.splice(i, 1);
              len--;
              i--;
            } else {
              positionKeys.push(key);
            }
          }

          let target = this._fake._start;

          const needRemoves = [];

          let count = 0;

          while (target) {
            if (target === this._fake) {
              if (vals.length) {
                // We have reached the end, add all elements directly to the front
                vals.forEach((item) => {
                  const $ele = createItem(
                    item,
                    temps,
                    targetTemp,
                    data.$host || data,
                    count,
                    keyName
                  );

                  count++;

                  // target.parentNode.insertBefore($ele.ele, target);
                  parentNode.insertBefore($ele.ele, target);
                });
              }
              break;
            }
            if (!(target instanceof Element)) {
              target = target.nextSibling;
              continue;
            }
            const currentVal = vals.shift();
            const isObj = currentVal instanceof Object;
            const $tar = eleX(target);
            const item = $tar.__item;

            if (currentVal === undefined && !vals.length) {
              // There will be no follow-up, just delete it directly
              needRemoves.push(target);
              target = target.nextSibling;
              continue;
            }

            const oldId = positionKeys.indexOf(
              isObj ? currentVal[keyName] : currentVal
            );
            if (oldId > -1) {
              // If the key originally exists, perform key displacement.
              const oldItem = childs[oldId];
              if (
                isObj
                  ? currentVal[keyName] !== item.$data[keyName]
                  : currentVal !== item.$data
              ) {
                // Adjust position
                oldItem.__internal = 1;
                // target.parentNode.insertBefore(oldItem, target);
                parentNode.insertBefore(oldItem, target);
                delete oldItem.__internal;
                target = oldItem;
              }

              // Update object
              const $old = eleX(oldItem);
              if ($old.__item.$data !== currentVal) {
                $old.__item.$data = currentVal;
              }
              $old.__item.$index = count;
            } else {
              // Add new element
              const $ele = createItem(
                currentVal,
                temps,
                targetTemp,
                data.$host || data,
                count,
                keyName
              );

              // target.parentNode.insertBefore($ele.ele, target);
              parentNode.insertBefore($ele.ele, target);
              target = $ele.ele;
            }

            count++;
            target = target.nextSibling;
          }

          if (needRemoves.length) {
            needRemoves.forEach((e) => {
              revokeAll(e);
              e.remove();
            });
          }
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
        const err = getErr("xhear_fill_tempname", { name: this._name });
        console.warn(err, this.ele);
        throw err;
      }

      if (this.ele._bindingRendered) {
        this.init();
      } else {
        this.one("binding-rendered", () => this.init());
      }
    },
  });

  const createItem = ($data, temps, targetTemp, $host, $index, keyName) => {
    const $ele = createXEle(targetTemp.innerHTML);

    const itemData = new Stanz({
      $data,
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
    $ele.ele._data_xid = $data[keyName] || $data;

    return $ele;
  };

  const { defineProperties } = Object;

  const GET_COMPOSE_PATH = `get-${Math.random()}`;

  const init = ({ _this, ele, proxySelf }) => {
    const descs = {
      owner: {
        get() {
          const { parentNode } = ele;
          const { _owner } = _this;
          const arr = parentNode ? [eleX(parentNode), ..._owner] : [..._owner];
          return new Set(arr);
        },
      },
      ele: {
        get: () => ele,
      },
    };

    const tag = ele.tagName && ele.tagName.toLowerCase();

    if (tag) {
      descs.tag = {
        enumerable: true,
        value: tag,
      };
    }

    defineProperties(_this, descs);

    initFormEle(proxySelf);
  };

  class Xhear extends LikeArray {
    constructor({ ele }) {
      super();

      const proxySelf = constructor.call(this, {}, handler);

      init({
        _this: this,
        ele,
        proxySelf,
      });

      ele.__xhear__ = proxySelf;

      return proxySelf;
    }

    get length() {
      return this.ele && this.ele.children.length;
    }

    $(expr) {
      let { ele } = this;
      if (ele instanceof HTMLTemplateElement) {
        ele = ele.content;
      }

      const target = ele.querySelector(expr);
      return target ? eleX(target) : null;
    }

    all(expr) {
      return searchEle(this.ele, expr).map(eleX);
    }

    extend(obj, desc) {
      return extend(this, obj, desc);
    }

    get text() {
      return this.ele.textContent;
    }

    set text(val) {
      this.ele.textContent = val;
    }

    get html() {
      return this.ele.innerHTML;
    }

    set html(val) {
      this.ele.innerHTML = val;
    }

    get classList() {
      return this.ele.classList;
    }

    get data() {
      return this.ele.dataset;
    }

    get shadow() {
      return eleX(this.ele.shadowRoot);
    }

    get root() {
      const rootNode = this.ele.getRootNode();
      return rootNode ? eleX(rootNode) : null;
    }
    get host() {
      let root = this.ele.getRootNode();
      let { host } = root;
      return host instanceof Node ? eleX(host) : null;
    }

    get parent() {
      let { parentNode } = this.ele;
      return !parentNode || parentNode === document ? null : eleX(parentNode);
    }

    get parents() {
      const parents = [];
      let target = this;
      while (target.parent) {
        target = target.parent;
        parents.push(target);
      }
      return parents;
    }

    get hosts() {
      const hosts = [];
      let target = this;
      while (target.host) {
        target = target.host;
        hosts.push(target);
      }
      return hosts;
    }

    composedPath() {
      let paths = [];
      this.one(GET_COMPOSE_PATH, (e) => {
        paths = e.composedPath();
        e.stopPropagation();
      });
      this.emit(GET_COMPOSE_PATH, {
        composed: true,
      });
      return paths;
    }

    get next() {
      const nextEle = this.ele.nextElementSibling;
      return nextEle ? eleX(nextEle) : null;
    }

    after(val) {
      const { next: nextEl } = this;

      if (nextEl) {
        nextEl.before(val);
      } else {
        this.parent.push(val);
      }
    }

    get nexts() {
      const { parent } = this;
      const selfIndex = this.index;
      return parent.filter((e, i) => i > selfIndex);
    }

    get prev() {
      const prevEle = this.ele.previousElementSibling;
      return prevEle ? eleX(prevEle) : null;
    }

    before(val) {
      const $el = createXEle(val);
      this.parent.ele.insertBefore($el.ele, this.ele);
    }

    get prevs() {
      const { parent } = this;
      const selfIndex = this.index;
      return parent.filter((e, i) => i < selfIndex);
    }

    get siblings() {
      return this.parent.filter((e) => e !== this);
    }

    get index() {
      let { parentNode } = this.ele;

      if (!parentNode) {
        return null;
      }

      return Array.prototype.indexOf.call(parentNode.children, this.ele);
    }

    get style() {
      return this.ele.style;
    }

    get width() {
      return parseInt(getComputedStyle(this.ele).width) || 0;
    }

    get height() {
      return parseInt(getComputedStyle(this.ele).height) || 0;
    }

    get clientWidth() {
      return this.ele.clientWidth;
    }

    get clientHeight() {
      return this.ele.clientHeight;
    }

    get offsetWidth() {
      return this.ele.offsetWidth;
    }

    get offsetHeight() {
      return this.ele.offsetHeight;
    }

    get outerWidth() {
      let computedStyle = getComputedStyle(this.ele);
      return (
        this.ele.offsetWidth +
        parseInt(computedStyle["margin-left"]) +
        parseInt(computedStyle["margin-right"])
      );
    }

    get outerHeight() {
      let computedStyle = getComputedStyle(this.ele);
      return (
        this.ele.offsetHeight +
        parseInt(computedStyle["margin-top"]) +
        parseInt(computedStyle["margin-bottom"])
      );
    }

    is(expr) {
      return meetsEle(this.ele, expr);
    }

    remove() {
      const { parent } = this;
      if (parent) {
        parent.splice(parent.indexOf(this), 1);
      }
      // this.ele.remove();
    }

    clone(bool = true) {
      return eleX(this.ele.cloneNode(bool));
    }

    wrap(content) {
      const $el = createXEle(content);

      const { ele } = this;

      if (!ele.parentNode) {
        throw getErr("xhear_wrap_no_parent");
      }

      ele.parentNode.insertBefore($el.ele, ele);

      ele.__internal = 1;

      $el.ele.appendChild(ele);

      delete ele.__internal;

      return this;
    }

    unwrap() {
      const { ele } = this;

      const target = ele.parentNode;

      if (target.children.length > 1) {
        throw getErr("xhear_unwrap_has_siblings");
      }

      ele.__internal = 1;

      target.parentNode.insertBefore(ele, target);

      target.remove();

      delete ele.__internal;

      return this;
    }
  }

  const sfn = Stanz.prototype;
  const fn = Xhear.prototype;

  fn.extend(
    {
      get: sfn.get,
      set: sfn.set,
      toJSON: sfn.toJSON,
      toString: sfn.toString,
      ...watchFn,
      ...eventFn,
      ...defaultData,
      ...syncFn,
      ...formFn,
    },
    {
      enumerable: false,
    }
  );

  fn.extend(cssFn);

  const eleX = (ele) => {
    if (!ele) return null;

    if (ele.__xhear__) {
      return ele.__xhear__;
    }

    return new Xhear({ ele });
  };

  const objToXEle = (obj) => {
    const data = { ...obj };

    if (!obj.tag) {
      return null;
    }

    const ele = document.createElement(obj.tag);
    delete data.tag;
    const $ele = eleX(ele);

    Object.assign($ele, data);

    return $ele;
  };

  const temp$1 = document.createElement("template");

  const strToXEle = (str) => {
    temp$1.innerHTML = str;
    const ele = temp$1.content.children[0] || temp$1.content.childNodes[0];
    temp$1.innerHTML = "";

    return eleX(ele);
  };

  const createXEle = (expr, exprType) => {
    if (expr instanceof Xhear) {
      return expr;
    }

    if (expr instanceof Node || expr === window) {
      return eleX(expr);
    }

    const type = getType$1(expr);

    switch (type) {
      case "object":
        return objToXEle(expr);
      case "string":
        return strToXEle(expr);
    }
  };

  const revokeAll = (target) => {
    if (target.__revokes) {
      Array.from(target.__revokes).forEach((f) => f && f());
    }
    target.childNodes &&
      Array.from(target.childNodes).forEach((el) => {
        revokeAll(el);
      });

    const revokes = target?.shadowRoot?.__revokes;

    if (revokes) {
      [...revokes].forEach((f) => f());
    }
  };

  Object.assign($, {
    stanz,
    render,
    convert,
    register,
    nextTick,
    fn: Xhear.prototype,
    all: (expr) => searchEle(document, expr).map(eleX),
    frag: () => $(document.createDocumentFragment()),
  });

  $.register({
    tag: "inject-host",
    temp: `<slot></slot>`,
    data: {},
    proto: {
      init() {
        if (!this.ele.isConnected) {
          return;
        }

        this.forEach((e) => this._init(e));
      },

      _init(e) {
        if (e.ele.__inited) {
          return;
        }

        switch (e.tag) {
          case "link":
            this._initLink(e);
            break;
          case "style":
            this._initStyle(e);
            break;
          case "x-if":
          case "x-else-if":
          case "x-else":
          case "x-fill":
            // Components of a rendered nature do not need to be alerted
            break;
          default:
            const err = getErr("invalidated_inject_host");
            console.warn(err, e);
        }
      },

      _initLink(e) {
        const href = e.attr("href");

        const rel = e.attr("rel");

        if (rel !== "stylesheet" && rel !== "host") {
          throw getErr("inject-link-rel");
        }

        let { ele } = e;

        if (rel !== "host") {
          e.attr("rel", "host");
          // It needs to be reset or it will contaminate itself
          e.attr("href", href);
        }

        ele.__inited = true;

        ele._revoke = () => {
          revokeLink(ele);
          ele._revoke = null;
        };

        initInjectEle(
          this,
          href,
          () => {
            const newEl = e.clone();
            newEl.attr("rel", "stylesheet");
            return newEl;
          },
          ele
        );
      },
      async _initStyle(e) {
        if (/data\(.+?\)/.test(e.html)) {
          const err = getErr("use-data-inject");
          console.warn(err, e.ele);
          throw err;
        }

        // Use only the text inside the style to prevent contaminating yourself
        const com = new Comment(e.html);
        com.__inited = true;

        com._revoke = () => {
          revokeLink(e.ele);
          delete com.__inited;
          delete e.ele.__inited;
          com._revoke = null;
          e.ele._revoke = null;
        };

        e.html = "";
        e.push(com);
        e.ele.__inited = true;
        e.ele._revoke = com._revoke;

        // const hash = await getHash(com.data);
        const hash = getStringHash(com.data);

        initInjectEle(this, hash, () => $(`<style>${com.data}</style>`), e.ele);
      },
    },
    attached() {
      const observer = (this._obs = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
          if (mutation.type === "attributes") {
            if (mutation.attributeName === "x-bind-data") {
              // x component render
              continue;
            }

            // Logic for handling attribute changes
            const { target } = mutation;

            if (target.__inited) {
              target._revoke();
              this._init(eleX(target));
            }
          } else if (mutation.type === "childList") {
            mutation.removedNodes.forEach((e) => {
              if (e.__inited) {
                e._revoke();
              }
            });

            mutation.addedNodes.forEach((e) => {
              if (!e.__inited) {
                if (e instanceof Text) {
                  if (e.parentElement.tagName === "STYLE") {
                    // change style text
                    this.init(e.parentNode);
                  }
                }

                if (e.__inited) {
                  // Don't get involved if you've been initialized.
                  return;
                }

                if (e instanceof Text || e instanceof Comment) {
                  // Invalid content
                  return;
                }

                this._init(eleX(e));
              }
            });
          }
        }
      }));

      const config = { attributes: true, childList: true, subtree: true };

      observer.observe(this.ele, config);

      this.init();
    },
    detached() {
      this.forEach((e) => revokeLink(e.ele));

      this._obs.disconnect();
    },
  });

  function getStringHash(str) {
    let hash = 0;
    let len = str.length;
    for (let i = 0; i < len; i++) {
      const charCode = str.charCodeAt(i);
      hash = ((hash << 5) - hash) ^ charCode;
      hash = (hash << 13) | (hash >>> 19);
      hash = hash * 7 - hash * 3;
    }
    return hash.toString(36) + "--" + len;
  }

  function initInjectEle(injectEl, mark, cloneFunc, item) {
    const hostRoot = injectEl.host.root;

    let clink = hostRoot.$(`[inject-host="${mark}"]`);

    if (clink) {
      clink.ele.__items.add(item);
      item.__host_link = clink;
      return;
    }

    clink = cloneFunc();

    clink.attr("inject-host", mark);

    clink.ele.__items = new Set([item]);
    item.__host_link = clink;

    const { root } = injectEl.host;
    if (root.ele === document) {
      document.head.appendChild(clink.ele);
    } else {
      root.root.push(clink);
    }
  }

  function revokeLink(item) {
    if (item.__inited && item.__host_link) {
      const items = item.__host_link.ele.__items;
      items.delete(item);

      if (!items.size) {
        item.__host_link.remove();
      }

      delete item.__inited;
    }
  }

  const getOid = () => Math.random().toString(32).slice(2);

  class Onion {
    constructor() {
      this._middlewares = new Map();
    }

    use(middleware) {
      const oid = getOid();
      this._middlewares.set(oid, middleware);
      return oid;
    }

    unuse(oid) {
      return this._middlewares.delete(oid);
    }

    async run(context) {
      let index = -1;

      const middlewares = Array.from(this._middlewares.values());

      const next = async () => {
        index++;
        if (index < middlewares.length) {
          await middlewares[index](context, next);
        }
      };

      await next();
    }
  }

  const caches = new Map();
  const wrapFetch = async (url, params) => {
    const d = new URL(url);

    const reUrl = params.includes("-direct") ? url : `${d.origin}${d.pathname}`;

    let fetchObj = caches.get(reUrl);

    if (!fetchObj) {
      fetchObj = fetch(reUrl);
      caches.set(reUrl, fetchObj);
    }

    const resp = await fetchObj;

    return resp.clone();
  };

  const processor = {};

  const addHandler = (name, handler) => {
    const oni = processor[name] || (processor[name] = new Onion());
    oni.use(handler);
  };

  const use = (name, handler) => {
    if (name instanceof Function) {
      handler = name;
      name = ["js", "mjs"];
    }

    if (name instanceof Array) {
      name.forEach((name) => {
        addHandler(name, handler);
      });
      return;
    }

    addHandler(name, handler);
  };

  use(["mjs", "js"], async (ctx, next) => {
    if (!ctx.result) {
      const { url, params } = ctx;
      const d = new URL(url);

      const notHttp = /^blob:/.test(url) || /^data:/.test(url);
      try {
        if (notHttp || params.includes("-direct")) {
          ctx.result = await import(url);
        } else {
          ctx.result = await import(`${d.origin}${d.pathname}`);
        }
      } catch (error) {
        const err = getErr(
          "load_module",
          {
            url: ctx.realUrl || url,
          },
          error
        );

        if (notHttp) {
          console.warn(err, ctx);
        }

        throw err;
      }
    }

    await next();
  });

  use(["txt", "html", "htm"], async (ctx, next) => {
    if (!ctx.result) {
      const { url, params } = ctx;

      let resp;
      try {
        resp = await wrapFetch(url, params);
      } catch (error) {
        throw getErr("load_fail", { url }, error);
      }

      if (!/^2.{2}$/.test(resp.status)) {
        throw getErr("load_fail_status", {
          url,
          status: resp.status,
        });
      }

      ctx.result = await resp.text();
    }

    await next();
  });

  use("json", async (ctx, next) => {
    if (!ctx.result) {
      const { url, params } = ctx;

      ctx.result = await wrapFetch(url, params).then((e) => e.json());
    }

    await next();
  });

  use("wasm", async (ctx, next) => {
    if (!ctx.result) {
      const { url, params } = ctx;

      const data = await wrapFetch(url, params).then((e) => e.arrayBuffer());

      const module = await WebAssembly.compile(data);
      const instance = new WebAssembly.Instance(module);

      ctx.result = instance.exports;
    }

    await next();
  });

  use("css", async (ctx, next) => {
    if (!ctx.result) {
      const { url, element, params } = ctx;

      if (element) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;

        const root = element.getRootNode();

        if (root === document) {
          root.head.append(link);
        } else {
          root.appendChild(link);
        }

        let f;
        element.addEventListener(
          "disconnected",
          (f = (e) => {
            link.remove();
            element.removeEventListener("disconnected", f);
          })
        );
      } else {
        ctx.result = await wrapFetch(url, params).then((e) => e.text());
      }
    }

    await next();
  });

  const aliasMap = {};

  async function config(opts) {
    const { alias } = opts;

    if (alias) {
      Object.entries(alias).forEach(([name, path]) => {
        if (!/^@.+/.test(name)) {
          throw getErr("config_alias_name_error", {
            name,
          });
        }

        if (!aliasMap[name]) {
          if (!/^\./.test(path)) {
            aliasMap[name] = path;
          } else {
            throw getErr("alias_relate_name", {
              name,
              path,
            });
          }
        } else {
          throw getErr("alias_already", {
            name,
          });
        }
      });
    }
    return true;
  }

  const path = (moduleName, baseURI) => {
    if (moduleName.startsWith("http://") || moduleName.startsWith("https://")) {
      return moduleName;
    }

    const [url, ...params] = moduleName.split(" ");

    let lastUrl = url;

    if (/^@/.test(url)) {
      const [first, ...args] = url.split("/");

      if (aliasMap[first]) {
        lastUrl = [aliasMap[first].replace(/\/$/, ""), ...args].join("/");
      } else {
        throw getErr("no_alias", {
          name: first,
          url: moduleName,
        });
      }
    }

    if (typeof location !== "undefined") {
      const base = baseURI ? new URL(baseURI, location.href) : location.href;

      const moduleURL = new URL(lastUrl, base);

      lastUrl = moduleURL.href;
    }

    if (params.length) {
      return `${lastUrl} ${params.join(" ")}`;
    }

    return lastUrl;
  };

  const LOADED = Symbol("loaded");

  const createLoad = (meta, opts) => {
    if (!meta) {
      meta = {
        url: document.location.href,
      };
    }
    const load = (ourl) => {
      let [url, ...params] = ourl.split(" ");

      const reurl = path(url, meta.url);

      return agent(reurl, { params, ...opts });
    };
    return load;
  };

  const agent = async (url, opts) => {
    const urldata = new URL(url);
    const { pathname } = urldata;

    let type;
    let realUrl = null;

    opts.params &&
      opts.params.forEach((e) => {
        if (/^\..+/.test(e)) {
          type = e.replace(/^\.(.+)/, "$1");
        } else if (/^\-\-real/.test(e)) {
          realUrl = e.replace(/^\-\-real\:/, "");
        }
      });

    if (!type) {
      type = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    const ctx = {
      url,
      result: null,
      realUrl,
      ...opts,
    };

    const oni = processor[type];

    if (oni) {
      await oni.run(ctx);
    } else {
      const result = await fetch(url);
      const contentType = result.headers.get("Content-Type");

      const targetMapObject = [
        ["application/javascript", "js"],
        ["application/json", "json"],
        ["text/html", "html"],
        ["text/xml", "xml"],
      ].find((e) => contentType.includes(e[0]));

      let newOni;
      if (targetMapObject) {
        newOni = processor[targetMapObject[1]];
      }

      if (newOni) {
        await newOni.run(ctx);
      } else {
        ctx.result = result;
      }
    }

    if (opts && opts.element) {
      const { element } = opts;
      element[LOADED] = true;
      const event = new Event("load");
      element.dispatchEvent(event);
    }

    if (opts.params && opts.params.includes("-ctx")) {
      return ctx;
    }

    return ctx.result;
  };

  function lm$1(meta, opts) {
    return createLoad(meta, opts);
  }

  Object.defineProperties(lm$1, {
    use: {
      value: use,
    },
    alias: {
      get() {
        return { ...aliasMap };
      },
    },
  });

  class LoadModule extends HTMLElement {
    constructor(...args) {
      super(...args);

      this[LOADED] = false;

      Object.defineProperties(this, {
        loaded: {
          get: () => this[LOADED],
        },
      });

      this._init();
    }

    _init() {
      if (this.__initSrc || this.attributes.hasOwnProperty("pause")) {
        return;
      }

      let src = this.getAttribute("src");

      if (!src) {
        return;
        // throw `The ${this.tagName.toLowerCase()} element requires the src attribut `;
      }
      this.__initSrc = src;

      const load = lm(undefined, {
        element: this,
      });

      load(src);

      Object.defineProperties(this, {
        src: {
          configurable: true,
          value: src,
        },
      });
    }

    connectedCallback() {
      const event = new CustomEvent("connected");
      event.root = this._root = this.getRootNode();
      this.dispatchEvent(event);
    }

    disconnectedCallback() {
      const event = new CustomEvent("disconnected");
      event.root = this._root;
      delete this._root;
      this.dispatchEvent(event);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "src") {
        if (newValue && oldValue === null) {
          this._init();
        } else if (this.__initSrc && oldValue && newValue !== this.__initSrc) {
          this.setAttribute("src", this.__initSrc);

          throw getErr("change_lm_src", {
            tag: this.tagName.toLowerCase(),
          });
        }
      } else if (name === "pause" && newValue === null) {
        this._init();
      }
    }

    static get observedAttributes() {
      return ["src", "pause"];
    }
  }

  class LM extends LoadModule {
    constructor(...args) {
      super(...args);
    }
  }

  const ready = () => {
    customElements.define("load-module", LoadModule);
    customElements.define("l-m", LM);
    window.removeEventListener("load", ready);
  };

  if (document.readyState === "complete") {
    ready();
  } else {
    window.addEventListener("load", ready);
  }

  lm$1.config = config;
  lm$1.path = path;
  Object.freeze(lm$1);

  window.lm = lm$1;

  const resolvePath = path;

  function fixRelate(ele, path) {
    searchEle(ele, "[href],[src]").forEach((el) => {
      ["href", "src"].forEach((name) => {
        const val = el.getAttribute(name);

        if (/^#/.test(val)) {
          return;
        }

        if (val && !/^(https?:)?\/\/\S+/.test(val)) {
          el.setAttribute(name, resolvePath(val, path));
        }
      });
    });

    searchEle(ele, "template").forEach((el) => {
      fixRelate(el.content, path);
    });
  }

  function fixRelatePathContent(content, path) {
    const template = document.createElement("template");
    template.innerHTML = content;

    fixRelate(template.content, path);

    // fix Resource references within style
    searchEle(template.content, "style").forEach((styleEl) => {
      const html = styleEl.innerHTML;

      styleEl.innerHTML = html.replace(/url\((.+)\)/g, (original, adapted) => {
        return `url(${resolvePath(adapted, path)})`;
      });
    });

    return template.innerHTML;
  }

  const ISERROR = Symbol("loadError");

  const getPagesData = async (src) => {
    const load = lm({
      url: src,
    });
    const pagesData = [];
    let defaults;
    let pageSrc = src;
    let beforeSrc;
    let errorObj;

    while (true) {
      try {
        let lastSrc = pageSrc;
        const [realPageSrc] = pageSrc.split(" ");
        const pageSrcObj = new URL(realPageSrc);
        if (/\/$/.test(pageSrcObj.pathname)) {
          lastSrc += " .html";
        }

        defaults = await load(lastSrc);
      } catch (error) {
        let err;
        if (beforeSrc) {
          err = getErr(
            "page_wrap_fetch",
            {
              before: beforeSrc,
              current: pageSrc,
            },
            error
          );
        } else {
          err = getErr(
            "load_page_module",
            {
              url: pageSrc,
            },
            error
          );
        }
        errorObj = err;

        console.error(errorObj);
      }

      if (errorObj) {
        pagesData.unshift({
          src,
          ISERROR,
          error: errorObj,
        });
        break;
      }

      pagesData.unshift({
        src: pageSrc,
        defaults,
      });

      if (!defaults.parent) {
        break;
      }

      beforeSrc = pageSrc;
      pageSrc = resolvePath(defaults.parent, pageSrc);
    }

    return pagesData;
  };

  const createPage = (src, defaults) => {
    // The $generated elements are not initialized immediately, so they need to be rendered in a normal container.
    const tempCon = document.createElement("div");

    tempCon.innerHTML = `<o-page src="${src}" data-pause-init="1"></o-page>`;

    const targetPage = eleX(tempCon.children[0]);

    nextTick(async () => {
      if (!targetPage._renderDefault) {
        await waitPageReaded(targetPage);
      }

      targetPage._renderDefault(defaults);
      targetPage.attr("data-pause-init", null);
    });

    return targetPage;
  };

  // In the firefox environment, there will be a problem that the page component is not initialized, but the routing starts to be initialized in advance, resulting in an error. Therefore, wait for the page component to be initialized before continuing with the subsequent operations.
  const waitPageReaded = (page) => {
    if (page._rendered) {
      return;
    }

    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (page._rendered) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  };

  const oldRender = renderExtends.render;
  renderExtends.render = (e) => {
    oldRender && oldRender(e);

    const { step, name, target } = e;

    const { link } = $.extensions;

    if (step === "init") {
      // Renders the component or page only once
      if (target.host && link) {
        $(target)
          .all("a")
          .forEach((e) => link(e));
      }
    } else if (
      name === "attr" &&
      step === "refresh" &&
      target.attr("olink") === ""
    ) {
      const top = target.parents.pop() || target;

      if (top.__fixLinkTimer) {
        return;
      }

      top.__fixLinkTimer = nextTick(() => {
        const { host } = target;

        if (host && host.tag === "o-page") {
          fixRelate(top.ele, host.src);
        }

        if (link) {
          $(top)
            .all("a")
            .forEach((e) => link(e));
        }
        delete top.__fixLinkTimer;
      });
    }
  };

  const initLink = (_this) => {
    const $ele = $(_this);

    // olink click to amend
    $ele.on("click", (e) => {
      if (e.__processed) {
        return;
      }

      const $tar = $(e.target);
      const all = [$tar, ...$tar.parents];

      let currentTarget = all.find((e) => e.tag === "a");
      if (currentTarget) {
        currentTarget = currentTarget.ele;
      }

      if (!currentTarget) {
        return;
      }

      const targetVal = currentTarget.getAttribute("target");
      if (targetVal || currentTarget.getAttribute("download")) {
        return;
      }

      if (currentTarget.attributes.hasOwnProperty("olink")) {
        if ($ele.app) {
          if (e.metaKey || e.shiftKey) {
            return;
          }

          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();

          // Whether to abort the goto event
          let prevented = false;
          e.preventDefault = () => {
            prevented = true;
          };

          e.__processed = true;

          if (currentTarget.tagName === "A") {
            const originHref = currentTarget.getAttribute("origin-href");
            // Prioritize the use of origin links
            setTimeout(() => {
              const finalHref = originHref || currentTarget.href;
              finalHref && !prevented && $ele.app.goto(finalHref);
            });
          }
        } else {
          console.warn(getErr("olink_out_app"), _this);
        }
      }
    });
  };

  const strToBase64DataURI = async (str, mime, isb64 = true) => {
    const file = new File([str], "genfile", { type: mime });

    if (!isb64) {
      return URL.createObjectURL(file);
    }

    const result = await new Promise((resolve) => {
      const fr = new FileReader();

      fr.onload = (e) => {
        resolve(e.target.result);
      };

      fr.readAsDataURL(file);
    });

    return result;
  };

  /**
   * In the actual logical code, the generated code and the source code actually use the exact same logic, with only a change in line numbers. Therefore, it is only necessary to map the generated valid code back to the corresponding line numbers in the source file.
   *  */
  const getSourcemapUrl = async (
    filePath,
    originStarRowIndex,
    originEndRowIndex,
    originContent,
    startLine
  ) => {
    const originLineArr = originContent.split("\n");

    let mappings = "";

    for (let i = 0; i <= startLine; i++) {
      mappings += ";";
    }

    let beforeRowIndex = 0;
    let beforeColIndex = 0;

    for (let rowId = originStarRowIndex + 1; rowId < originEndRowIndex; rowId++) {
      const target = originLineArr[rowId] || "";

      let rowStr = "";

      Array.from(target).forEach((e, colId) => {
        const currentStr = `AA${vlcEncode(rowId - beforeRowIndex)}${vlcEncode(
        colId - beforeColIndex
      )}`;

        if (!rowStr) {
          rowStr = currentStr;
        } else {
          rowStr += `,${currentStr}`;
        }

        beforeRowIndex = rowId;
        beforeColIndex = colId;
      });

      mappings += `${rowStr};`;
    }

    const sourcesContent = JSON.stringify([originContent])
      .replace(/^\[/, "")
      .replace(/\]$/, "");

    const str = `{"version": 3,
    "sources": ["${filePath.replace(/\?.+/, "")}"],
    "sourcesContent":[${sourcesContent}],
    "mappings": "${mappings}"}`;

    return await strToBase64DataURI(str, "application/json");
  };

  // 将 style 映射为 sourcemap 的 base64 link 标签，方便调试
  const addStyleSourcemap = async (temp, originContent, filePath) => {
    let reTemp = temp;

    // 备份一份可修改的的原始内容
    let backupOriginContent = originContent;

    const tempEl = document.createElement("template");
    tempEl.innerHTML = temp;

    const styleEls = tempEl.content.querySelectorAll("style");

    for (let e of Array.from(styleEls)) {
      const styleContent = e.innerHTML;
      const { outerHTML } = e;

      // 编译后开始的行数
      let startLine = 0;

      // 拆分原内容
      const matchArr = backupOriginContent.split(outerHTML);

      // 编译前开始的行数
      const originStarRowIndex = matchArr[0].split("\n").length - 1;

      // 编译前结束的行数
      const originEndRowIndex =
        originStarRowIndex + styleContent.split("\n").length - 1;

      // 替换 backupOriginContent 中已经sourcemap过的代码为换行符
      let middleStr = "";
      for (let i = 0, len = outerHTML.split("\n").length - 1; i < len; i++) {
        middleStr += "\n";
      }
      backupOriginContent = [matchArr[0], middleStr, matchArr[1]].join("");

      const sourceMapJSONURL = await getSourcemapUrl(
        filePath,
        originStarRowIndex,
        originEndRowIndex,
        originContent,
        startLine
      );

      const sourcemapStr = `/*# sourceMappingURL=${sourceMapJSONURL}*/`;

      reTemp = reTemp.replace(
        outerHTML,
        `${outerHTML.replace("</style>", "")}\n${sourcemapStr}</style>`
      );
    }

    return reTemp;
  };

  const cacheLink = new Map();

  async function drawUrl(content, url, isPage = true) {
    let targetUrl = cacheLink.get(url);
    if (targetUrl) {
      return targetUrl;
    }

    let isDebug = true;

    if ($.hasOwnProperty("debugMode")) {
      isDebug = $.debugMode;
    }

    const tempEl = $("<template></template>");
    tempEl.html = content;
    const titleEl = tempEl.$("title");

    const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
    const scriptEl = targetTemp.$("script");

    scriptEl && scriptEl.remove();

    // If there is no content other than the <script>, then the shadow root is not set.
    const hasTemp = !!targetTemp.html
      .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, "")
      .trim();
    let temp = "";

    if (hasTemp) {
      temp = targetTemp.html
        .replace(/\s+$/, "")
        .replace(/`/g, "\\`")
        .replace(/\$\{/g, "\\${");

      if (isDebug) {
        temp = await addStyleSourcemap(temp, content, url);
      }

      temp = "<style>*:not(:defined){display:none;}</style>" + temp;
    }

    // 原来html文件中，转译后，属于前半部分的内容（后半部分就是script标签内的内容）
    const beforeContent = `
  export const type = ${isPage ? "ofa.PAGE" : "ofa.COMP"};
  ${isPage && titleEl ? `export const title = '${titleEl.text}';` : ""}
  export const temp = \`${temp}\`;`;

    let scriptContent = "";
    if (scriptEl) {
      scriptContent = scriptEl.html
        .split(/;/g)
        .map((content) => {
          const t_content = content.trim();
          // Confirm it is an import reference and correct the address
          if (/^import[ \{'"]/.test(t_content)) {
            // Update address string directly
            return content.replace(/['"]([\s\S]+)['"]/, (arg0, pathStr) => {
              return `"${resolvePath(pathStr, url)}"`;
            });
          }
          return content;
        })
        .join(";");
    }

    const fileContent = `${beforeContent};
${scriptContent}`;

    let sourcemapStr = "";

    if (isDebug) {
      const originLineArr = content.split("\n");

      // Determine the starting line number of the source file.
      const originStarRowIndex = originLineArr.findIndex(
        (lineContent) => lineContent.trim() === "<script>"
      );

      // Determine the ending line number of the source file.
      const originEndRowIndex = originLineArr.findIndex(
        (lineContent) => lineContent.trim() === "</script>"
      );

      sourcemapStr = `//# sourceMappingURL=${await getSourcemapUrl(
      url,
      originStarRowIndex,
      originEndRowIndex,
      content,
      beforeContent.split("\n").length
    )}`;
    }

    const finalContent = `${fileContent}\n${sourcemapStr}`;

    const isFirefox = navigator.userAgent.includes("Firefox");

    targetUrl = strToBase64DataURI(
      finalContent,
      "text/javascript",
      isFirefox ? false : true
    );

    cacheLink.set(url, targetUrl);

    return targetUrl;
  }

  const base64 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function toVLQSigned(value) {
    return value < 0 ? (-value << 1) + 1 : (value << 1) + 0;
  }

  function vlcEncode(value) {
    let encoded = "";
    let vlq = toVLQSigned(value);

    do {
      let digit = vlq & 0b11111;
      vlq >>>= 5;
      if (vlq > 0) {
        digit |= 0b100000;
      }
      encoded += base64[digit];
    } while (vlq > 0);

    return encoded;
  }

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const PAGE = Symbol("Page");

  Object.defineProperty($, "PAGE", {
    value: PAGE,
  });

  lm$1.use(["html", "htm"], async (ctx, next) => {
    const { result: content, params } = ctx;

    if (
      content &&
      /<template +page *>/.test(content) &&
      !params.includes("-ignore-temp")
    ) {
      try {
        const url = await drawUrl(content, ctx.url);
        ctx.result = await lm$1()(`${url} .mjs --real:${ctx.url}`);
      } catch (error) {
        throw getErr(
          "load_page_module",
          {
            url: ctx.url,
          },
          error
        );
      }
      ctx.resultContent = content;
    }

    await next();
  });

  lm$1.use(["js", "mjs"], async (ctx, next) => {
    const { result: moduleData, url, realUrl } = ctx;
    if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
      await next();
      return;
    }

    const defaultsData = await getDefault(moduleData, realUrl || url);

    let tempSrc = defaultsData.temp;

    if (!/<.+>/.test(tempSrc)) {
      if (tempSrc) {
        tempSrc = resolvePath(tempSrc, url);
      } else {
        tempSrc = url.replace(/\.m?js.*/, ".html");
      }

      try {
        defaultsData.temp = await fetch(tempSrc).then((e) => e.text());
      } catch (error) {
        const err = getErr(
          "fetch_temp_err",
          {
            url: realUrl || url,
            tempSrc,
          },
          error
        );
        self.emit("error", { data: { error: err } });
        throw err;
      }
    }

    ctx.result = defaultsData;

    await next();
  });

  setTimeout(() => {
    // Let the pod's running time be slower than the `type="module"` time
    $.register({
      tag: "o-page",
      attrs: {
        src: null,
      },
      data: {
        pageIsReady: null,
      },
      watch: {
        async src(src) {
          if (!src) {
            return;
          }

          if (!src.startsWith("//") && !/[a-z]+:\/\//.test(src)) {
            src = resolvePath(src);
            this.src = src;
            return;
          }

          if (this.__init_src) {
            if (this.__init_src !== src) {
              throw Error(
                "A page that has already been initialized cannot be set with the src attribute"
              );
            }
            return;
          }

          this.__init_src = src;

          if (this._defaults || this.attr("data-pause-init")) {
            return;
          }

          const pagesData = await getPagesData(src);

          if (this._defaults) {
            return;
          }

          const target = pagesData.pop();

          pagesData.forEach((e, i) => {
            const parentPage = createPage(e.src, e.defaults);

            if (this.parent) {
              this.wrap(parentPage);
            } else {
              const needWraps = this.__need_wraps || (this.__need_wraps = []);
              needWraps.push(parentPage);
            }
          });

          if (target.ISERROR === ISERROR) {
            const failContent = getFailContent(
              src,
              target,
              this?.app?._module?.fail
            );

            this._renderDefault({
              type: PAGE,
              temp: failContent,
            });
          } else {
            this._renderDefault(target.defaults);
          }
        },
      },
      attached() {
        // this.css.display = "block";

        const needWraps = this.__need_wraps;
        if (needWraps) {
          needWraps.forEach((page) => {
            this.wrap(page);
          });
          delete this.__need_wraps;
        }

        if (this.__not_run_attached) {
          if (this._defaults.attached) {
            this._defaults.attached.call(this);
          }
          delete this.__not_run_attached;
        }
      },
      detached() {
        const { _defaults } = this;

        if (_defaults && _defaults.detached) {
          _defaults.detached.call(this);
        }
      },
      proto: {
        async _renderDefault(defaults) {
          const { src } = this;

          if (defaults.data) {
            // 检查 proto 和 data 上的key，是否和fn上的key冲突
            Object.keys(defaults.data).forEach((name) => {
              if (name in this) {
                throw getErr("page_invalid_key", {
                  src,
                  targetName: "data",
                  name,
                });
              }
            });
          }

          if (defaults.proto) {
            Object.keys(defaults.proto).forEach((name) => {
              if (name in this) {
                console.warn(
                  getErrDesc("page_invalid_key", {
                    src,
                    targetName: "proto",
                    name,
                  }),
                  defaults
                );
              }
            });
          }

          if (this._defaults) {
            const err = getErr("page_no_defaults", { src });
            console.warn(err, this);
            throw err;
          }

          this._defaults = defaults;

          if (defaults.pageAnime) {
            this._pageAnime = defaults.pageAnime;
          }

          if (!defaults || defaults.type !== PAGE) {
            const err = getErr("not_page_module", { src });
            console.warn(err, this);
            this.emit("error", { data: { error: err } });
            this.__reject(err);
            throw err;
          }

          const template = document.createElement("template");
          template.innerHTML = fixRelatePathContent(defaults.temp, src);
          const temps = convert(template);

          try {
            renderElement({
              defaults,
              ele: this.ele,
              template,
              temps,
            });
          } catch (error) {
            const err = getErr("page_failed", { src }, error);
            console.error(err);
            console.warn(err, this);
          }

          await dispatchLoad(this, defaults.loaded);

          initLink(this.shadow);

          this.emit("page-loaded");

          this.__resolve();

          this.pageIsReady = 1;

          const { app } = this;
          if (app && !app.appIsReady) {
            nextTick(() => {
              app.appIsReady = 1;
            });
          }

          if (this.ele.isConnected) {
            if (defaults.attached) {
              defaults.attached.call(this);
            }
          } else {
            this.__not_run_attached = 1;
          }
        },
        back() {
          this.app.back();
        },
        goto(src) {
          this.app.goto(resolvePath(src, this.src));
        },
        replace(src) {
          this.app.replace(resolvePath(src, this.src));
        },
        get pageAnime() {
          const { app, _pageAnime } = this;

          const { pageAnime } = app?._module || {};

          return clone({ ...pageAnime, ...(_pageAnime || {}) });
        },
        set pageAnime(val) {
          this._pageAnime = val;
        },
      },

      ready() {
        this._rendered = new Promise((resolve, reject) => {
          this.__resolve = () => {
            delete this.__resolve;
            delete this.__reject;
            resolve();
          };
          this.__reject = () => {
            delete this.__resolve;
            delete this.__reject;
            reject();
          };
        });
      },
    });
  });

  const dispatchLoad = async (_this, loaded) => {
    const shadow = _this.ele.shadowRoot;

    if (shadow) {
      const srcEles = searchEle(shadow, `l-m,load-module`);
      const pms = srcEles.map(
        (el) =>
          new Promise((res) => {
            el.addEventListener("load", (e) => {
              res();
            });
          })
      );

      const links = searchEle(shadow, `link`);

      links.forEach((link) => {
        if (link.rel === "stylesheet") {
          pms.push(
            new Promise((res) => {
              let resolve = () => {
                clearInterval(timer);
                link.removeEventListener("load", resolve);
                link.removeEventListener("error", resolve);
                res();
              };
              const timer = setInterval(() => {
                if (!link.parentNode) {
                  resolve();
                }
              }, 100);

              if (link.sheet) {
                resolve();
              } else {
                link.addEventListener("load", resolve);
                link.addEventListener("error", resolve);
              }
            })
          );
        }
      });

      await Promise.all(pms);
    }

    if (loaded) {
      loaded.call(_this);
    }
  };

  const getDefault = async (moduleData, url) => {
    let finnalDefault = {};

    const { default: defaultData } = moduleData;

    const relateLoad = lm$1({
      url,
    });

    if (isFunction(defaultData)) {
      finnalDefault = await defaultData({
        load: relateLoad,
        url,
        get query() {
          const urlObj = new URL(url);
          return Object.fromEntries(Array.from(urlObj.searchParams.entries()));
        },
      });
    } else if (defaultData instanceof Object) {
      finnalDefault = { ...defaultData };
    }

    const defaults = {
      proto: {},
      ...moduleData,
      ...finnalDefault,
    };

    return defaults;
  };

  const getFailContent = (src, target, fail) => {
    let failContent;

    if (fail) {
      failContent = fail({
        src,
        error: target.error,
      });
    } else {
      failContent = `<div style="padding:20px;color:red;">${target.error.stack
      .replace(/\n/g, "<br>")
      .replace(/ /g, "&nbsp;")}</div>`;
    }

    return failContent;
  };

  const COMP = Symbol("Component");
  const COMPONENT_PATH = Symbol("PATH");

  Object.defineProperty($, "COMP", {
    value: COMP,
  });

  const cacheComps = {};

  lm$1.use(["html", "htm"], async (ctx, next) => {
    const { result: content, params } = ctx;

    if (
      content &&
      /<template +component *>/.test(content) &&
      !params.includes("-ignore-temp")
    ) {
      try {
        const url = await drawUrl(content, ctx.url, false);
        ctx.result = await lm$1()(`${url} .mjs --real:${ctx.url}`);
      } catch (err) {
        throw getErr(
          "load_comp_module",
          {
            url: ctx.url,
          },
          err
        );
      }
      ctx.resultContent = content;
    }

    await next();
  });

  lm$1.use(["js", "mjs"], async (ctx, next) => {
    const { result: moduleData, url, realUrl } = ctx;
    if (typeof moduleData !== "object" || moduleData.type !== COMP) {
      next();
      return;
    }

    let finnalDefault = {};

    const { default: defaultData } = moduleData;

    const path = realUrl || url;

    if (isFunction(defaultData)) {
      finnalDefault = await defaultData({
        load: lm$1({
          url: path,
        }),
      });
    } else if (defaultData instanceof Object) {
      finnalDefault = { ...defaultData };
    }

    const { tag, temp } = { ...moduleData, ...finnalDefault };

    let tagName = tag;
    const matchName = path.match(/\/([^/]+)\.m?(js|htm|html)$/);

    if (!tagName) {
      if (matchName) {
        tagName = toDashCase(matchName[1]);
      }
    }

    const cacheUrl = cacheComps[tagName];
    if (cacheUrl) {
      if (path !== cacheUrl) {
        throw getErr("comp_registered", {
          name: tagName,
        });
      }

      await next();
      return;
    }

    cacheComps[tagName] = path;

    let tempUrl,
      tempContent = "";

    if (/<.+>/.test(temp)) {
      tempUrl = path;
      tempContent = temp;
    } else if (temp !== "") {
      // An empty string means the shadow root is not needed.
      if (!temp) {
        tempUrl = resolvePath(`${matchName[1]}.html`, path);
      } else {
        tempUrl = resolvePath(temp, path);
      }

      tempContent = await fetch(tempUrl).then((e) => e.text());
    }

    const registerOpts = {
      ...moduleData,
      ...finnalDefault,
    };

    const oldReady = registerOpts.ready;
    const { loaded } = registerOpts;
    registerOpts.ready = async function (...args) {
      oldReady && oldReady.apply(this, args);
      loaded && dispatchLoad(this, loaded);
      this.shadow && initLink(this.shadow);
    };

    const oldCreated = registerOpts.created;
    registerOpts.created = function (...args) {
      this[COMPONENT_PATH] = path;
      oldCreated && oldCreated.call(this, ...args);
    };

    const regTemp = fixRelatePathContent(tempContent, path || tempUrl);

    $.register({
      ...registerOpts,
      tag: tagName,
      temp: regTemp,
    });

    await next();
  });

  // import lm from "../drill.js/base.mjs";

  const HISTORY = "_history";

  const appendPage = async ({ src, app }) => {
    const { loading, fail } = app._module || {};

    let loadingEl;
    if (loading) {
      loadingEl = createXEle(loading());

      if (!loadingEl) {
        const err = getErr("loading_nothing");
        console.warn(err, loading);
        throw err;
      }

      app.push(loadingEl);
    }

    const currentPages = [];
    {
      const { current } = app;
      if (current) {
        currentPages.push(current);
        for (let page of current.parents) {
          if (page.tag !== "o-page") {
            break;
          }

          currentPages.unshift(page);
        }
      }
    }

    const oriNextPages = await getPagesData(src);

    let container = app;

    const publicParents = []; // Public parent pages that have not been cleared
    const finalPages = [];
    let old;

    // Nested routing code
    // Keep the parent page with the same src
    let isSame = true;
    oriNextPages.forEach((e, index) => {
      const current = currentPages[index];

      if (!isSame) {
        finalPages.push(e);
        return;
      }

      if (!current || current.src !== e.src) {
        isSame = false;
        finalPages.push(e);
        old = current;
        return;
      }

      publicParents.push(current);

      container = current;
    });

    // In the case of only the parent page, the old variable needs to be corrected
    if (currentPages.length > oriNextPages.length && !old) {
      currentPages.some((e, index) => {
        const current = oriNextPages[index];

        if (!current || current.src !== e.src) {
          old = e;
          return true;
        }
      });
    }

    let topPage, innerPage;

    finalPages.forEach((pageData) => {
      const { ISERROR: isError } = pageData;

      let page;
      if (isError) {
        const failContent = getFailContent(pageData.src, pageData, fail);

        page = createPage(pageData.src, {
          type: $.PAGE,
          temp: failContent,
        });
      } else {
        page = createPage(pageData.src, pageData.defaults);
      }

      if (!topPage) {
        topPage = page;
        return;
      }

      if (!innerPage) {
        topPage.push(page);
        innerPage = page;
        return;
      }

      innerPage.push(page);
      innerPage = page;
    });

    if (topPage) {
      container.push(topPage);
    }

    loadingEl && loadingEl.remove();

    return { current: topPage, old, publics: publicParents };
  };

  const emitRouterChange = (_this, publics, type) => {
    if (publics && publics.length) {
      const { current } = _this;
      publics.forEach((page) => {
        // const { page } = e;
        const { routerChange } = page._defaults;

        if (routerChange) {
          routerChange.call(page, { type, current });
        }
      });
    }
  };

  $.register({
    tag: "o-app",
    temp: `<style>:host{position:relative;display:block}::slotted(*){display:block;width:100%;height:100%;}</style><slot></slot>`,
    attrs: {
      src: null,
    },
    data: {
      [HISTORY]: [],
      appIsReady: null,
    },
    watch: {
      async src(val) {
        if (this.__init_src) {
          if (this.__init_src !== val) {
            throw getErr("app_src_change");
          }
          return;
        }

        if (!val) {
          return;
        }

        this.__init_src = val;

        let selfUrl = val;
        if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
          selfUrl = resolvePath(val);
        }

        const load = lm();

        const moduleData = await load(selfUrl);

        const defaults = await getDefault(moduleData, selfUrl);

        this._module = defaults;

        this.extend(defaults.proto);

        if (defaults.ready) {
          defaults.ready.call(this);
        }

        if (this._settedRouters) {
          return;
        }

        if (!this.$("o-page") && !this._initHome && defaults.home) {
          const homeUrl = new URL(defaults.home, selfUrl).href;
          this.push(`<o-page src="${homeUrl}"></o-page>`);
        }
      },
    },
    proto: {
      async back(delta = 1) {
        if (!this[HISTORY].length) {
          const err = getErr("app_noback");
          console.warn(err, {
            app: this,
          });
          return;
        }

        const oldRouters = this.routers;

        const { _noanime } = this;

        // Delete historical data for response numbers
        delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

        const newCurrent = this[HISTORY].splice(-delta)[0];

        let {
          current: page,
          old: needRemovePage,
          publics,
        } = await appendPage({
          src: newCurrent.src,
          app: this,
        });

        if (!_noanime && page) {
          await pageInAnime({
            page,
            key: "previous",
          });
        }

        if (needRemovePage) {
          needRemovePage = resetOldPage(needRemovePage);
        }

        this.emit("router-change", {
          data: { name: "back", delta, historys: oldRouters.slice(-1 * delta) },
        });

        emitRouterChange(this, publics, "back");

        if (!_noanime && needRemovePage) {
          await pageOutAnime({
            page: needRemovePage,
            key: "next",
          });
        }

        if (needRemovePage) {
          needRemovePage.remove();
        }
      },
      async _navigate({ type, src }) {
        const { _noanime } = this;
        const { current: oldCurrent } = this;
        // src = new URL(src, location.href).href;
        src = resolvePath(src);

        runAccess(this, src);

        if (!oldCurrent) {
          this._initHome = src;
        }

        let {
          current: page,
          old: needRemovePage,
          publics,
        } = await appendPage({
          src,
          app: this,
        });

        if (!page) {
          return;
        }

        if (!_noanime && page) {
          await pageInAnime({
            page,
            key: "next",
          });
        }

        if (needRemovePage) {
          needRemovePage = resetOldPage(needRemovePage);
        }

        if (type === "goto") {
          oldCurrent && this[HISTORY].push({ src: oldCurrent.src });
        }

        this.emit("router-change", {
          data: { name: type, src },
        });

        emitRouterChange(this, publics, type);

        if (oldCurrent && needRemovePage) {
          if (!_noanime) {
            await pageOutAnime({
              page: needRemovePage,
              key: "previous",
            });
          }
          needRemovePage.remove();
        }
      },
      goto(src) {
        return this._navigate({ type: "goto", src });
      },
      replace(src) {
        return this._navigate({ type: "replace", src });
      },
      get current() {
        return this.all("o-page")
          .reverse()
          .find((page) => {
            let target = page;
            while (target.tag === "o-page") {
              if (target.data.willRemoved) {
                return false;
              }
              target = target.parent;
            }

            return true;
          });
      },
      get routers() {
        let { current } = this;

        if (!current) {
          return [];
        }

        const routers = [
          ...this[HISTORY],
          {
            src: current.src,
          },
        ];

        return routers;
      },
      set routers(_routers) {
        _routers = _routers.map((e) => {
          runAccess(this, e.src);

          return { src: e.src };
        });

        this._settedRouters = 1;

        this.html = "";

        const historyRouters = _routers.slice();

        const currentRouter = historyRouters.pop();

        this[HISTORY].length = 0;
        this[HISTORY].push(...historyRouters);

        this.push({
          tag: "o-page",
          src: currentRouter.src,
        });
      },
    },
  });

  // Ensure that the page is available, handle cross-domain pages and other operations
  const runAccess = (app, src) => {
    const access = app?._module?.access;

    const srcObj = new URL(src);

    if (srcObj.origin !== location.origin && !access) {
      const err = getErr("no_cross_access_func");
      console.warn(err, app.ele, app?._module);
      throw err;
    }

    if (access) {
      const result = access(src);

      if (result !== true) {
        const err = getErr(
          "access_return_error",
          { src },
          result instanceof Error ? result : undefined
        );
        console.warn(err, app);
        throw err;
      }
    }
  };

  const pageInAnime = async ({ page, key }) => {
    if (!page._rendered) {
      // firefox bug
      await waitPageReaded(page);
    }

    const { pageAnime } = page;

    const targetAnime = pageAnime[key];

    if (targetAnime) {
      page.css = {
        ...page.css,
        ...targetAnime,
      };

      nextAnimeFrame(() => {
        page.css = {
          ...page.css,
          transition: "all ease .3s",
          ...(pageAnime.current || {}),
        };
      });
    }
  };

  const pageOutAnime = ({ page, key }) =>
    new Promise((resolve) => {
      const targetAnime = page.pageAnime[key];

      if (targetAnime) {
        nextAnimeFrame(() => {
          page.one("transitionend", resolve);

          page.css = {
            ...page.css,
            transition: "all ease .3s",
            ...targetAnime,
          };
        });
      } else {
        resolve();
      }
    });

  const nextAnimeFrame = (func) =>
    requestAnimationFrame(() => {
      setTimeout(func, 5);
    });

  const resetOldPage = (needRemovePage) => {
    needRemovePage.css = {
      position: "absolute",
      width: `${needRemovePage.width}px`,
      height: `${needRemovePage.height}px`,
    };
    needRemovePage.data.willRemoved = 1;

    return needRemovePage;
  };

  const oldAttr = $.fn.attr;

  function attr(...args) {
    let [name, value, options] = args;

    if (isFunction(value)) {
      value = value();
    }

    const { host } = this;

    if (host && ["href", "src"].includes(name) && /^\./.test(value)) {
      const { PATH } = host;

      if (PATH) {
        const { href } = new URL(value, PATH);

        return oldAttr.call(this, name, href);
      }
    }

    return oldAttr.call(this, ...args);
  }

  attr.always = oldAttr.always;

  $.fn.extend({
    get app() {
      let target = this;

      while (target && target !== "o-app") {
        if (target.tag === "o-page") {
          const result = target.parents.find((el) => el.tag === "o-app");

          if (result) {
            target = result;
            break;
          }
        }

        target = target.host;

        if (!target) {
          break;
        }
      }

      return target;
    },
    get PATH() {
      // component or page file path
      return this[COMPONENT_PATH] || this.src || null;
    },
    attr,
  });

  // 根provider
  const rootProviders = {};

  const temp = `<style>:host{display:contents}</style><slot></slot>`;

  const CONSUMERS = Symbol("consumers");
  const PROVIDER = Symbol("provider");

  Object.defineProperty($, "getRootProvider", {
    value(name) {
      return rootProviders[name];
    },
  });

  // 获取对应name的上一级 provider 元素
  $.fn.getProvider = function (name) {
    let reval = null;

    this.emit("update-consumer", {
      data: {
        method: "getProvider",
        name,
        callback(target) {
          reval = target;
        },
      },
    });

    return reval;
  };

  $("html").on("update-consumer", (e) => {
    const { name, consumer } = e.data;

    const targetRootProvider = rootProviders[name];

    if (targetRootProvider) {
      targetRootProvider[CONSUMERS].add(consumer);
      consumer[PROVIDER] = targetRootProvider;
      consumer._refresh();
      return;
    } else {
      // 提示后面加入的根provider需要遍历
      rootProviders[name] = null;
    }

    if (consumer && consumer.tag === "o-consumer") {
      let hasData = false;

      // 清空冒泡到根的 consumer 数据
      Object.keys(consumer[SELF]).forEach((key) => {
        if (InvalidKeys.includes(key)) {
          return;
        }
        consumer[key] = undefined;

        hasData = true;
      });

      if (hasData) {
        console.warn(getErrDesc("no_provider", { name: consumer.name }), target);
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

      // if (provider) {
      //   this[PROVIDER] = provider;
      //   provider[CONSUMERS].add(this);
      //   return;
      // }

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

  const InvalidKeys = [
    "tag",
    "name",
    "class",
    "style",
    "id",
    "x-bind-data",
    "is-root",
  ];

  const providerOptions = {
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
      _refresh() {
        // 辅助consumer刷新数据
        this.consumers.forEach((e) => e._refresh());
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

        const { name, consumer, method } = e.data;

        if (name && this.name === name && method === "getProvider") {
          // 查找provider
          e.data.callback(this);
          e.stopPropagation();
          return;
        }

        if (name && this.name === name) {
          this[CONSUMERS].add(consumer);
          consumer[PROVIDER] = this;

          // 查找到对应的provider后，禁止向上冒泡
          e.stopPropagation();

          consumer._refresh();
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
  };

  $.register({
    tag: "o-root-provider",
    attrs: {
      name: null,
    },
    watch: {
      name() {
        // 是否已经设置过
        if (!this.__named) {
          this.__named = 1;
          return;
        }

        const err = getErr("root_provider_name_change", {
          name: this.name,
        });

        console.warn(err, this.ele);

        throw err;
      },
    },
    proto: {
      _update() {
        // 根节点不需要 update
      },
      _refresh: providerOptions.proto._refresh,
      _setConsumer: providerOptions.proto._setConsumer,
      get consumers() {
        return [...Array.from(this[CONSUMERS])];
      },
    },
    ready() {
      providerOptions.ready.call(this);
    },
    attached() {
      if (rootProviders[this.name]) {
        const err = getErr("root_provider_exist", { name: this.name });
        console.warn(
          err,
          "exist:",
          rootProviders[this.name],
          ", current:",
          this.ele
        );
        throw err;
      }

      const isDeleted = rootProviders[this.name] === null;

      rootProviders[this.name] = this;

      if (isDeleted) {
        // 曾经被删除过，再次加入就要遍历
        emitAllConsumer(document.body, this);
      }

      providerOptions.attached.call(this);
    },
    detached() {
      if (rootProviders[this.name] === this) {
        rootProviders[this.name] = null;
        this[CONSUMERS].forEach((e) => {
          e._clear();
          e._refresh();
        });
      }
    },
  });

  $.register(providerOptions);

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
    if (ele.tagName === "O-ROOT-PROVIDER") {
      return;
    } else if (ele.tagName === "O-CONSUMER" || ele.tagName === "O-PROVIDER") {
      const $ele = $(ele);
      if ($ele.name === rootProvider.name) {
        // 重新冒泡
        $ele._update(rootProvider);
        $ele._refresh();
        return;
      }
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
      _refresh() {
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

  const version = "ofa.js@4.5.8";
  $.version = version.replace("ofa.js@", "");

  if (document.currentScript) {
    Object.defineProperty($, "debugMode", {
      get: () => isDebug.value,
    });
  }

  if (typeof window !== "undefined") {
    window.$ = $;
  }

  Object.defineProperty(globalThis, "ofa", {
    value: $,
  });

  return $;

}));
