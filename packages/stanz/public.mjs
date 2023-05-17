export const getRandomId = () => Math.random().toString(32).slice(2);

const objectToString = Object.prototype.toString;
export const getType = (value) =>
  objectToString
    .call(value)
    .toLowerCase()
    .replace(/(\[object )|(])/g, "");

export const isObject = (obj) => {
  const type = getType(obj);
  return type === "array" || type === "object";
};

const tickSets = new Set();
export function nextTick(callback) {
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
export const clearTick = (id) => tickSets.delete(id);

export function debounce(func, wait = 0) {
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
export const extend = (_this, proto, descriptor = {}) => {
  Object.keys(proto).forEach((k) => {
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
