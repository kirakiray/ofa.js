//! ofa - v4.0.0 https://github.com/kirakiray/ofa.js  (c) 2018-2023 YAO
const getRandomId = () => Math.random().toString(32).slice(2);

const objectToString = Object.prototype.toString;
const getType = (value) =>
  objectToString
    .call(value)
    .toLowerCase()
    .replace(/(\[object )|(])/g, "");

const isObject = (obj) => {
  const type = getType(obj);
  return type === "array" || type === "object";
};

const tickSets = new Set();
function nextTick(callback) {
  const tickId = `t-${getRandomId()}`;
  tickSets.add(tickId);
  Promise.resolve().then(() => {
    if (tickSets.has(tickId)) {
      callback();
      tickSets.delete(tickId);
    }
  });
  return tickId;
}

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
          func.call(this, hisArgs);
          hisArgs = [];
          timeout = null;
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

const isFunction = (val) => getType(val).includes("function");

const hyphenToUpperCase = (str) =>
  str.replace(/-([a-z])/g, (match, p1) => {
    return p1.toUpperCase();
  });

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const isArrayEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

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

function moveArrayValue(arr, oldValue, newIndex) {
  const oldIndex = arr.indexOf(oldValue);

  if (oldIndex === -1) {
    throw new Error("Value not found in array");
  }

  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
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

const { assign: assign$1, freeze } = Object;

class Watcher {
  constructor(opts) {
    assign$1(this, opts);
    freeze(this);
  }

  _getCurrent(key) {
    let { currentTarget } = this;

    if (/\./.test(key)) {
      const matchs = key.split(".");
      key = matchs.pop();
      currentTarget = currentTarget.get(matchs.join("."));
    }

    return {
      current: currentTarget,
      key,
    };
  }

  hasModified(k) {
    if (this.type === "array") {
      return this.path.includes(this.currentTarget.get(k));
    }

    if (/\./.test(k)) {
      const { current, key } = this._getCurrent(k);
      const last = this.path.slice(-1)[0];
      if (current === last) {
        if (this.name === key) {
          return true;
        }

        return false;
      }

      return this.path.includes(current);
    }

    if (!this.path.length) {
      return this.name === k;
    }

    return this.path.includes(this.currentTarget[k]);
  }

  hasReplaced(k) {
    if (this.type !== "set") {
      return false;
    }

    if (/\./.test(k)) {
      const { current, key } = this._getCurrent(k);
      const last = this.path.slice(-1)[0];
      if (current === last && this.name === key) {
        return true;
      }

      return false;
    }

    if (!this.path.length && this.name === k) {
      return true;
    }

    return false;
  }
}

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
    console.warn("Circular references appear");
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
    const wid = "w-" + getRandomId();

    this[WATCHS].set(wid, callback);

    return wid;
  },

  unwatch(wid) {
    return this[WATCHS].delete(wid);
  },

  watchTick(callback, wait) {
    return this.watch(
      debounce((arr) => {
        try {
          this.xid;
        } catch (err) {
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
    let maxId = 0;

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
          const err = new Error(
            `Failed to get data : ${keys.slice(0, i).join(".")} \n${
              error.stack
            }`
          );
          Object.assign(err, {
            error,
            target,
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
          const err = new Error(
            `Failed to get data : ${keys.slice(0, i).join(".")} \n${
              error.stack
            }`
          );
          Object.assign(err, {
            error,
            target,
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
  let data = value;
  if (isxdata(data)) {
    data._owner.push(receiver);
  } else if (isObject(value)) {
    const desc = Object.getOwnPropertyDescriptor(target, key);
    if (!desc || desc.hasOwnProperty("value")) {
      data = new Stanz(value);
      data._owner.push(receiver);
    }
  }

  const oldValue = receiver[key];
  const isSame = oldValue === value;

  if (!isSame && isxdata(oldValue)) {
    clearData(oldValue, receiver);
  }

  const reval = succeed(data);

  !isSame &&
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
      console.error({
        desc: "This data is wrong, the owner has no boarding object at the time of deletion",
        target,
        mismatch: val,
      });
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
      const err = new Error(`failed to set ${key} \n ${error.stack}`);

      Object.assign(err, {
        key,
        value,
        target: receiver,
        error,
      });

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

const handler = {
  set(target, key, value, receiver) {
    if (!/\D/.test(key)) {
      return Reflect.set(target, key, value, receiver);
    }

    return handler$1.set(target, key, value, receiver);
  },
  get(target, key, value, receiver) {
    if (!/\D/.test(String(key))) {
      return eleX(target.ele.children[key]);
    }

    return Reflect.get(target, key, value, receiver);
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

const getRevokes = (target) => target.__revokes || (target.__revokes = []);
const addRevoke = (target, revoke) => getRevokes(target).push(revoke);

const convertToFunc = (expr, data) => {
  const funcStr = `
const [$event] = $args;
try{
  with(this){
    return ${expr};
  }
}catch(error){
  console.error(error);
}
`;
  return new Function("...$args", funcStr).bind(data);
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

  const texts = searchEle(target, "xtext");

  const tasks = [];
  const revokes = getRevokes(target);

  texts.forEach((el) => {
    const textEl = document.createTextNode("");
    const { parentNode } = el;
    parentNode.insertBefore(textEl, el);
    parentNode.removeChild(el);

    const func = convertToFunc(el.getAttribute("expr"), data);
    const renderFunc = () => {
      textEl.textContent = func();
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

  eles.forEach((el) => {
    const bindData = JSON.parse(el.getAttribute("x-bind-data"));

    const $el = eleX(el);

    for (let [actionName, arr] of Object.entries(bindData)) {
      arr.forEach((args) => {
        try {
          const { always } = $el[actionName];

          const func = () =>
            $el[actionName](...args, {
              isExpr: true,
              data,
              temps,
              ...otherOpts,
            });

          let actionRevoke;

          if (always) {
            // Run every data update
            tasks.push(func);

            actionRevoke = () => {
              removeArrayValue(revokes, actionRevoke);
              removeArrayValue(tasks, func);
              removeArrayValue(getRevokes(el), actionRevoke);
              // delete el.__revoke;
            };
          } else {
            const revokeFunc = func();

            if (isFunction(revokeFunc)) {
              actionRevoke = () => {
                removeArrayValue(revokes, actionRevoke);
                removeArrayValue(getRevokes(el), actionRevoke);
                revokeFunc();
                // delete el.__revoke;
              };
            } else {
              console.warn(`${actionName} render method need return revoke`);
            }
            // el.__revoke = actionRevoke;
          }

          revokes.push(actionRevoke);
          addRevoke(el, actionRevoke);
        } catch (error) {
          const err = new Error(
            `Execution of the ${actionName} method reports an error :\n ${error.stack}`
          );
          err.error = error;
          throw err;
        }
      });
    }

    el.removeAttribute("x-bind-data");
  });

  if (!target.__render_temps && !isEmptyObject(temps)) {
    target.__render_temps = temps;
  }

  if (tasks.length) {
    if (target.__render_data && target.__render_data !== data) {
      const error = new Error(
        `An old listener already exists and the rendering of this element may be wrong`
      );

      Object.assign(error, {
        element: target,
        old: target.__render_data,
        new: data,
      });

      throw error;
    }

    target.__render_data = data;

    tasks.forEach((func) => func());

    const wid = data.watchTick((e) => {
      if (tasks.length) {
        tasks.forEach((func) => func());
      } else {
        data.unwatch(wid);
      }
    });
  }
}

function convert(el) {
  let temps = {};

  const { tagName } = el;
  if (tagName === "TEMPLATE") {
    let content = el.innerHTML;
    const matchs = content.match(/{{.+?}}/g);

    if (matchs) {
      matchs.forEach((str) => {
        content = content.replace(
          str,
          `<xtext expr="${str.replace(/{{(.+?)}}/, "$1")}"></xtext>`
        );
      });

      el.innerHTML = content;
    }

    const tempName = el.getAttribute("name");

    if (tempName) {
      if (el.content.children.length > 1) {
        console.warn({
          target: el,
          content: el.innerHTML,
          desc: `Only the first child element inside the template will be used`,
        });
      }
      temps[tempName] = el;
      el.remove();
    }

    temps = { ...temps, ...convert(el.content) };
  } else if (tagName) {
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

  if (el.children) {
    Array.from(el.children).forEach((el) => {
      temps = { ...temps, ...convert(el) };
    });
  }

  return temps;
}

const getVal = (val) => {
  if (isFunction(val)) {
    return val();
  }

  return val;
};

const defaultData = {
  _convertExpr(options = {}, expr) {
    const { isExpr, data } = options;

    if (!isExpr) {
      return expr;
    }

    return convertToFunc(expr, data);
  },
  prop(...args) {
    let [name, value, options] = args;

    if (args.length === 1) {
      return this[name];
    }

    value = this._convertExpr(options, value);
    value = getVal(value);
    name = hyphenToUpperCase(name);

    this[name] = value;
  },
  attr(...args) {
    let [name, value, options] = args;

    if (args.length === 1) {
      return this.ele.getAttribute(name);
    }

    value = this._convertExpr(options, value);
    value = getVal(value);

    this.ele.setAttribute(name, value);
  },
};

defaultData.prop.always = true;
defaultData.attr.always = true;

var syncFn = {
  sync(propName, targetName, options) {
    if (!options) {
      throw `Sync is only allowed within the renderer`;
    }

    const { data } = options;

    this[propName] = data.get(targetName);

    const wid1 = this.watch((e) => {
      if (e.hasModified(propName)) {
        data.set(targetName, this.get(propName));
      }
    });

    const wid2 = data.watch((e) => {
      if (e.hasModified(targetName)) {
        this.set(propName, data.get(targetName));
      }
    });

    return () => {
      this.unwatch(wid1);
      data.unwatch(wid2);
    };
  },
};

var eventFn = {
  on(name, func, options) {
    if (options && options.isExpr && !/[^\d\w_\$\.]/.test(func)) {
      func = options.data.get(func);
    } else {
      func = this._convertExpr(options, func);
    }

    if (options && options.data) {
      func = func.bind(options.data);
    }

    this.ele.addEventListener(name, func);

    if (options) {
      return () => this.ele.removeEventListener(name, func);
    }

    return this;
  },
  one(name, func, options) {
    const callback = (e) => {
      this.off(name, callback);
      func(e);
    };

    this.on(name, callback, options);

    return this;
  },
  off(name, func) {
    this.ele.removeEventListener(name, func);
    return this;
  },
  emit(name, data, opts) {
    let event;

    if (name instanceof Event) {
      event = name;
    } else if (name) {
      event = new Event(name, { bubbles: true, ...opts });
    }

    data && Object.assign(event, data);

    this.ele.dispatchEvent(event);

    return this;
  },
};

const originSplice = (ele, start, count, ...items) => {
  const { children } = ele;
  const removes = [];
  for (let i = start, len = start + count; i < len; i++) {
    const target = children[i];
    removes.push(target);
  }

  removes.forEach((el) => el.remove());

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
          if (isNum) {
            return Number(ele[k]);
          }
          return ele[k];
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
      setKeys(["value"], $ele);
      bindProp($ele, { name: "value", type: "change" });
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
      setKeys(["checked", "multiple"], $ele);
      bindProp($ele, { name: "checked", type: "change" });
      break;
    case "radio":
      setKeys(["checked"], $ele);
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

    this.watchTick((e) => {
      assign(data, getFormData(this, expr || "input,select,textarea"));
    }, opts.wait);

    return data;
  },
};

const COMPS = {};

const renderElement = ({ defaults, ele, template, temps }) => {
  const data = {
    ...defaults.data,
    ...defaults.attrs,
  };

  const $ele = eleX(ele);

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

  if (defaults.watch) {
    const wen = Object.entries(defaults.watch);

    $ele.watchTick((e) => {
      for (let [name, func] of wen) {
        if (e.hasModified(name)) {
          func.call($ele, $ele[name], {
            watchers: e,
          });
        }
      }
    });

    for (let [name, func] of wen) {
      func.call($ele, $ele[name], {});
    }
  }
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

  validateTagName(defaults.tag);

  const name = capitalizeFirstLetter(hyphenToUpperCase(defaults.tag));

  if (COMPS[name]) {
    throw `Component ${name} already exists`;
  }

  const template = document.createElement("template");
  template.innerHTML = defaults.temp;
  const temps = convert(template);

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
              if (val === null || val === undefined) {
                this.removeAttribute(attrName);
              } else {
                this.setAttribute(attrName, val);
              }
            }
          });
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
      defaults.attached &&
        !isInternal(this) &&
        defaults.attached.call(eleX(this));
    }

    disconnectedCallback() {
      defaults.detached &&
        !isInternal(this) &&
        defaults.detached.call(eleX(this));
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
  // Check if the string starts or ends with '-'
  if (str.charAt(0) === "-" || str.charAt(str.length - 1) === "-") {
    throw new Error(`The string "${str}" cannot start or end with "-"`);
  }

  // Check if the string has consecutive '-' characters
  for (let i = 0; i < str.length - 1; i++) {
    if (str.charAt(i) === "-" && str.charAt(i + 1) === "-") {
      throw new Error(
        `The string "${str}" cannot have consecutive "-" characters`
      );
    }
  }

  // Check if the string has at least one '-' character
  if (!str.includes("-")) {
    throw new Error(`The string "${str}" must contain at least one "-"`);
  }

  return true;
}

function getConditionEles(_this, isEnd = true) {
  const $eles = [];

  let target = isEnd ? _this.__marked_end : _this.__marked_start;
  while (true) {
    target = isEnd ? target.nextSibling : target.previousSibling;
    if (target instanceof Comment) {
      if (target.__$ele) {
        $eles.push(target.__$ele);
        target = isEnd ? target.__end : target.__start;
      }
    } else if (!(target instanceof Text)) {
      break;
    }
  }

  return $eles;
}
const proto$1 = {
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
  },
  _refreshCondition() {
    const $eles = [this];

    if (this._refreshing) {
      return;
    }

    switch (this.tag) {
      case "x-if":
        $eles.push(...getConditionEles(this));
        break;
      case "x-else-if":
        $eles.unshift(...getConditionEles(this, false));
        $eles.push(...getConditionEles(this));
        break;
    }

    $eles.forEach((e) => (e._refreshing = true));
    nextTick(() => {
      let isOK = false;
      $eles.forEach(($ele) => {
        delete $ele._refreshing;

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
    });
  },
};

const xifComponentOpts = {
  tag: "x-if",
  data: {
    value: null,
  },
  watch: {
    value() {
      this._refreshCondition();
    },
  },
  proto: proto$1,
  ready() {
    this.__originHTML = this.html;
    this.html = "";
    this._renderMarked();

    nextTick(() => this.ele.remove());
  },
};

register(xifComponentOpts);

register({
  ...xifComponentOpts,
  tag: "x-else-if",
});

register({
  tag: "x-else",
  proto: proto$1,
  ready: xifComponentOpts.ready,
});

const createItem = (d, targetTemp, temps, $host) => {
  const itemData = new Stanz({
    $data: d,
    $host,
  });

  const $ele = createXEle(targetTemp.innerHTML);
  const { ele } = $ele;

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
  _getRenderData: proto$1._getRenderData,
  _renderMarked: proto$1._renderMarked,
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

      const targetTemp = temps[hyphenToUpperCase(tempName)];

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

const { defineProperties } = Object;

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
    return this.ele.children.length;
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

  get css() {
    return getComputedStyle(this.ele);
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
    return host ? eleX(host) : null;
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

  get next() {
    const nextEle = this.ele.nextElementSibling;
    return nextEle ? eleX(nextEle) : null;
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

  set style(d) {
    if (getType(d) == "string") {
      this.ele.style = d;
      return;
    }

    let { style } = this;

    // Covering the old style
    let hasKeys = Array.from(style);
    let nextKeys = Object.keys(d);

    // Clear the unused key
    hasKeys.forEach((k) => {
      if (!nextKeys.includes(k)) {
        style[k] = "";
      }
    });

    Object.assign(style, d);
  }

  get width() {
    return parseInt(getComputedStyle(this.ele).width);
  }

  get height() {
    return parseInt(getComputedStyle(this.ele).height);
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
    this.ele.remove();
  }

  clone(bool = true) {
    return eleX(this.ele.cloneNode(bool));
  }

  wrap(content) {
    const $el = createXEle(content);

    const { ele } = this;

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
      throw `The target has a sibling element, so you can't use unwrap.`;
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

const temp = document.createElement("template");

const strToXEle = (str) => {
  temp.innerHTML = str;
  const ele = temp.content.children[0] || temp.content.childNodes[0];
  temp.innerHTML = "";

  return eleX(ele);
};

const createXEle = (expr, exprType) => {
  if (expr instanceof Xhear) {
    return expr;
  }

  if (expr instanceof Node || expr === window) {
    return eleX(expr);
  }

  const type = getType(expr);

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
};

function $(expr) {
  if (getType(expr) === "string" && !/<.+>/.test(expr)) {
    const ele = document.querySelector(expr);

    return eleX(ele);
  }

  return createXEle(expr);
}

Object.assign($, {
  stanz,
  render,
  convert,
  register,
  fn: Xhear.prototype,
  all: (expr) => searchEle(document, expr).map(eleX),
});

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
    if (
      /^blob:/.test(url) ||
      /^data:/.test(url) ||
      params.includes("-direct")
    ) {
      ctx.result = await import(url);
    } else {
      ctx.result = await import(`${d.origin}${d.pathname}`);
    }
  }

  await next();
});

use(["txt", "html", "htm"], async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;
    ctx.result = await fetch(url).then((e) => e.text());
  }

  await next();
});

use("json", async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    ctx.result = await fetch(url).then((e) => e.json());
  }

  await next();
});

use("wasm", async (ctx, next) => {
  if (!ctx.result) {
    const { url } = ctx;

    const data = await fetch(url).then((e) => e.arrayBuffer());

    const module = await WebAssembly.compile(data);
    const instance = new WebAssembly.Instance(module);

    ctx.result = instance.exports;
  }

  await next();
});

use("css", async (ctx, next) => {
  if (!ctx.result) {
    const { url, element } = ctx;

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
      ctx.result = await fetch(url).then((e) => e.text());
    }
  }

  await next();
});

const LOADED = Symbol("loaded");

const createLoad = (meta) => {
  if (!meta) {
    meta = {
      url: document.location.href,
    };
  }
  const load = (ourl) => {
    let reurl = "";
    const [url, ...params] = ourl.split(" ");

    if (meta.resolve) {
      reurl = meta.resolve(url);
    } else {
      const currentUrl = new URL(meta.url);
      const resolvedUrl = new URL(url, currentUrl);
      reurl = resolvedUrl.href;
    }

    return agent(reurl, { params });
  };
  return load;
};

const agent = async (url, opts) => {
  const urldata = new URL(url);
  const { pathname } = urldata;

  let type;

  opts.params &&
    opts.params.forEach((e) => {
      if (/^\..+/.test(e)) {
        type = e.replace(/^\.(.+)/, "$1");
      }
    });

  if (!type) {
    type = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  const ctx = {
    url,
    result: null,
    ...opts,
  };

  const oni = processor[type];

  if (oni) {
    await oni.run(ctx);
  } else {
    ctx.result = fetch(url);
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

function lm$1(meta) {
  return createLoad(meta);
}

Object.assign(lm$1, {
  use,
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

    src = new URL(src, location.href).href;
    Object.defineProperties(this, {
      src: {
        configurable: true,
        value: src,
      },
    });

    const [url, ...params] = src.split(" ");

    agent(url, {
      element: this,
      params,
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
        console.warn(
          `${this.tagName.toLowerCase()} change src is invalid, only the first change will be loaded`
        );
        this.setAttribute("src", this.__initSrc);
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

window.lm = lm$1;

function resolvePath(moduleName, baseURI) {
  const [url, ...params] = moduleName.split(" ");

  const baseURL = new URL(baseURI || location.href);
  if (
    // moduleName.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  const moduleURL = new URL(url, baseURL);

  if (params.length) {
    return `${moduleURL.href} ${params.join(" ")}`;
  }

  return moduleURL.href;
}

function fixRelateSource(content, path) {
  const template = document.createElement("template");
  template.innerHTML = content;

  searchEle(template.content, "[href],[src]").forEach((el) => {
    ["href", "src"].forEach((name) => {
      let val = el.getAttribute(name);
      if (val) {
        el.setAttribute(name, resolvePath(val, path));
      }
    });
  });

  return template.innerHTML;
}

const wrapErrorCall = async (callback, { self, desc, ...rest }) => {
  try {
    await callback();
  } catch (error) {
    const err = new Error(`${desc}\n  ${error.stack}`);
    err.error = error;
    self.emit("error", { error: err, ...rest });
    throw err;
  }
};

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const PAGE = Symbol("Page");

Object.defineProperty($, "PAGE", {
  value: PAGE,
});

lm$1.use("page", async (ctx, next) => {
  if (!ctx.result) {
    const content = await fetch(ctx.url).then((e) => e.text());

    const url = getContentInfo(content, ctx.url);

    ctx.result = await lm$1()(`${url} .mjs`);
    ctx.resultContent = content;
  }

  await next();
});

lm$1.use(["html", "htm"], async (ctx, next) => {
  const { result: content, params } = ctx;

  if (
    content &&
    /<template +page *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    const url = getContentInfo(content, ctx.url);

    ctx.result = await lm$1()(`${url} .mjs`);
    ctx.resultContent = content;
  }

  await next();
});

// const strToBase64DataURI = (str) => `data:application/json;base64,${btoa(str)}`;

function getContentInfo(content, url, isPage = true) {
  const tempEl = $("<template></template>");
  tempEl.html = content;
  const titleEl = tempEl.$("title");

  const targetTemp = tempEl.$(`template[${isPage ? "page" : "component"}]`);
  const scriptEl = targetTemp.$("script");

  scriptEl && scriptEl.remove();

  const fileContent = `
  export const type = ${isPage ? "$.PAGE" : "$.COMP"};
  export const PATH = '${url}';
  ${isPage && titleEl ? `export const title = '${titleEl.text}';` : ""}
  export const temp = \`${targetTemp.html.replace(/\s+$/, "")}\`;
  ${scriptEl ? scriptEl.html : ""}`;

  const file = new File(
    [fileContent],
    location.pathname.replace(/.+\/(.+)/, "$1"),
    { type: "text/javascript" }
  );

  return URL.createObjectURL(file);
}

lm$1.use(["js", "mjs"], async (ctx, next) => {
  const { result: moduleData, url } = ctx;
  if (typeof moduleData !== "object" || moduleData.type !== PAGE) {
    await next();
    return;
  }

  const defaultsData = await getDefault(moduleData, url);

  let tempSrc = defaultsData.temp;

  if (!/<.+>/.test(tempSrc)) {
    if (!tempSrc) {
      tempSrc = url.replace(/\.m?js.*/, ".html");
    }

    await wrapErrorCall(
      async () => {
        defaultsData.temp = await fetch(tempSrc).then((e) => e.text());
      },
      {
        targetModule: import.meta.url,
        desc: `${url} module request for ${tempSrc} template page failed`,
      }
    );
  }

  ctx.result = defaultsData;

  await next();
});

$.register({
  tag: "o-page",
  attrs: {
    src: null,
  },
  watch: {
    async src(val) {
      if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
        val = resolvePath(val);
        this.ele.setAttribute("src", val);
      }

      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw "A page that has already been initialized cannot be set with the src attribute";
        }
        return;
      }

      if (!val) {
        return;
      }

      this.__init_src = val;

      const load = lm$1();

      let defaults;

      await wrapErrorCall(
        async () => {
          const ctx = await load(`${val} -ctx`);
          const { resultContent } = ctx;

          const tempEl = $({ tag: "template" });
          tempEl.html = resultContent;

          defaults = ctx.result;
          // defaults = await load(val);
        },
        {
          self: this,
          desc: `Request for ${val} module failed`,
        }
      );

      if (!defaults || defaults.type !== PAGE) {
        const err = new Error(
          `The currently loaded module is not a page \nLoaded string => '${val}'`
        );
        this.emit("error", { error: err });
        throw err;
      }

      const parentPath = defaults.parent;

      if (parentPath) {
        await new Promise((resolve) => {
          const newParentPath = resolvePath(parentPath, val);

          // Passing $ is an element generated within the template and does not depart from the component's registered functions.
          // const parentPage = $(`<o-page src="${newParentPath}"></o-page>`);
          let parentPage = document.createElement("o-page");
          parentPage = eleX(parentPage);
          parentPage.src = newParentPath;

          this.wrap(parentPage);

          if (parentPage._loaded) {
            resolve();
            return;
          }

          parentPage.one("page-loaded", resolve);
        });
      }

      this._defaults = defaults;

      const template = document.createElement("template");
      template.innerHTML = fixRelateSource(defaults.temp, val);
      const temps = convert(template);

      renderElement({
        defaults,
        ele: this.ele,
        template,
        temps,
      });

      await dispatchLoad(this, defaults.loaded);

      this._loaded = true;

      this.emit("page-loaded");

      initLink(this);
    },
  },
  proto: {
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
});

const initLink = (_this) => {
  _this.shadow.on("click", (e) => {
    const { target } = e;
    if (
      _this.app &&
      target.tagName === "A" &&
      target.attributes.hasOwnProperty("olink")
    ) {
      if (e.metaKey || e.shiftKey) {
        return;
      }
      e.preventDefault();
      _this.app.goto(target.href);
    }
  });
};

const dispatchLoad = async (_this, loaded) => {
  const shadow = _this.ele.shadowRoot;
  if (shadow) {
    const srcEles = searchEle(shadow, `l-m,load-module`);
    await Promise.all(
      srcEles.map(
        (el) =>
          new Promise((res) => {
            el.addEventListener("load", (e) => {
              res();
            });
          })
      )
    );
  }

  if (loaded) {
    loaded.call(_this);
  }
};

const getDefault = async (moduleData, oriUrl) => {
  let finnalDefault = {};

  const { default: defaultData, PATH } = moduleData;

  const url = PATH || oriUrl;

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
    finnalDefault = defaultData;
  }

  const defaults = {
    proto: {},
    ...moduleData,
    ...finnalDefault,
  };

  return defaults;
};

const COMP = Symbol("Component");

Object.defineProperty($, "COMP", {
  value: COMP,
});

const cacheComps = {};

lm$1.use(["html", "htm"], async (ctx, next) => {
  const { url, result: content, params } = ctx;

  if (
    content &&
    /<template +component *>/.test(content) &&
    !params.includes("-ignore-temp")
  ) {
    const url = getContentInfo(content, ctx.url, false);

    ctx.result = await lm$1()(`${url} .mjs`);
    ctx.resultContent = content;
  }

  await next();
});

lm$1.use(["js", "mjs"], async ({ result: moduleData, url }, next) => {
  if (typeof moduleData !== "object" || moduleData.type !== COMP) {
    next();
    return;
  }

  let finnalDefault = {};

  const { default: defaultData } = moduleData;

  if (isFunction(defaultData)) {
    finnalDefault = await defaultData({
      load: lm$1({
        url,
      }),
    });
  } else if (defaultData instanceof Object) {
    finnalDefault = defaultData;
  }

  const { tag, temp, PATH } = { ...moduleData, ...finnalDefault };

  const path = PATH || url;

  let tagName = tag;
  const matchName = path.match(/\/([^/]+)\.m?(js|htm|html)$/);

  if (!tagName) {
    if (matchName) {
      tagName = toDashCase(matchName[1]);
    }
  }

  const cacheUrl = cacheComps[tagName];
  if (cacheUrl) {
    if (path !== PATH) {
      throw `${tagName} components have been registered`;
    }

    await next();
    return;
  }

  cacheComps[tagName] = path;

  let tempUrl, tempContent;

  if (/<.+>/.test(temp)) {
    tempUrl = path;
    tempContent = temp;
  } else {
    if (!temp) {
      if (tag) {
        tempUrl = resolvePath(`${tag}.html`, path);
      } else {
        tempUrl = resolvePath(`${matchName[1]}.html`, path);
      }
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
    initLink(this);
  };

  $.register({
    ...registerOpts,
    tag: tagName,
    temp: fixRelateSource(tempContent, PATH || tempUrl),
  });

  await next();
});

// import lm from "../drill.js/base.mjs";

const HISTORY = "_history";

const removeSubs = (current) => {
  Object.keys(current).forEach((key) => {
    if (!isNaN(key)) {
      delete current[key];
    }
  });

  return current;
};

const createPage = async ({ src, _this }) => {
  const { loading, fail } = _this._module || {};

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    _this.push(loadingEl);
  }

  const page = await new Promise((resolve) => {
    const tempCon = document.createElement("div");
    tempCon.innerHTML = `<o-page src="${src}"></o-page>`;
    const pageEl = eleX(tempCon.querySelector("o-page"));

    const loadedEventId = pageEl.one("page-loaded", () => {
      // In the case of a child route, the parent page should be returned.
      resolve(eleX(tempCon.querySelector("o-page")));

      pageEl.off(errorEventId);
    });

    const errorEventId = pageEl.one("error", (e) => {
      let failContent = ``;

      if (fail) {
        failContent = fail({
          target: e.target,
          src: e.target.getAttribute("src"),
          error: e.error,
        });
      }

      const template = document.createElement("template");
      template.innerHTML = failContent;
      const temps = convert(template);

      renderElement({
        defaults: {
          temp: " ",
        },
        ele: e.target,
        template,
        temps,
      });

      e.target.innerHTML = "";

      resolve(eleX(tempCon.querySelector("o-page")));

      pageEl.off(loadedEventId);
    });
  });

  loadingEl && loadingEl.remove();

  return page;
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(o-page){display:block;position:absolute;left:0;top:0;width:100%;height:100%}</style><slot></slot>`,
  attrs: {
    src: null,
  },
  data: {},
  watch: {
    async src(val) {
      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw "The App that has already been initialized cannot be set with the src attribute";
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

      if (this._settedRouters) {
        return;
      }

      this.extend(defaults.proto);

      if (defaults.ready) {
        defaults.ready.call(this);
      }

      if (!this.$("o-page") && !this._initHome && defaults.home) {
        const homeUrl = new URL(defaults.home, selfUrl).href;
        this.push(`<o-page src="${homeUrl}"></o-page>`);
      }
    },
  },
  proto: {
    [HISTORY]: [],
    async back(delta = 1) {
      if (!this[HISTORY].length) {
        console.warn(`It's already the first page, can't go back`);
        return;
      }

      // It is convenient to know that this current and the following current are not the same object
      const { current: oldCurrent } = this;

      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];

      this.push({
        ...newCurrent,
      });

      pageAddAnime({
        page: this.current,
        key: "previous",
      });

      this.emit("router-change", {
        name: "back",
        delta,
      });

      let targetPage = oldCurrent;

      while (targetPage.parent.tag === "o-page") {
        targetPage = targetPage.parent;
      }

      await outPage({
        page: targetPage,
        key: "next",
      });

      oldCurrent.remove();
    },
    async goto(src) {
      const { current: oldCurrent } = this;

      if (!oldCurrent) {
        this._initHome = src;
      }

      const page = await createPage({ src, _this: this });

      // When the page element is initialized, the parent element is already available within the ready function
      this.push(page);

      pageAddAnime({
        page,
        key: "next",
      });

      oldCurrent && this[HISTORY].push(removeSubs(oldCurrent.toJSON()));

      this.emit("router-change", {
        name: "goto",
        src,
      });

      if (oldCurrent) {
        await outPage({
          page: oldCurrent,
          key: "previous",
        });

        oldCurrent.remove();
      }
    },
    async replace(src) {
      const { current: oldCurrent } = this;

      const page = await createPage({ _this: this, src });

      this.push(page);

      pageAddAnime({
        page,
        key: "next",
      });

      this.emit("router-change", {
        name: "replace",
        src,
      });

      if (oldCurrent) {
        await outPage({
          page: oldCurrent,
          key: "previous",
        });

        oldCurrent.remove();
      }
    },
    get current() {
      return this.all("o-page").slice(-1)[0];
    },
    get routers() {
      let { current } = this;

      if (!current) {
        return [];
      }

      current = current.toJSON();

      removeSubs(current);

      const routers = [...this[HISTORY], current];

      return routers;
    },
    set routers(_routers) {
      this._settedRouters = 1;

      this.html = "";

      const historyRouters = _routers.slice();

      const currentRouter = historyRouters.pop();

      this[HISTORY].length = 0;
      this[HISTORY].push(...historyRouters);

      this.push(currentRouter);
    },
  },
  ready() {},
});

const pageAddAnime = ({ page, key }) => {
  const { pageAnime } = page;

  const targetAnime = pageAnime[key];

  if (targetAnime) {
    page.style = {
      transition: "all ease .3s",
      ...targetAnime,
    };

    nextAnimeFrame(() => {
      page.style = {
        transition: "all ease .3s",
        ...(pageAnime.current || {}),
      };
    });
  }
};

const outPage = ({ page, key }) =>
  new Promise((resolve) => {
    const targetAnime = page.pageAnime[key];

    if (targetAnime) {
      nextAnimeFrame(() => {
        page.one("transitionend", resolve);

        page.style = {
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
});

if (typeof window !== "undefined") {
  window.$ = $;
}

export { $ as default };
