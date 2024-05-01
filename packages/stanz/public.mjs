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

export const isDebug = {
  value: null,
};

if (typeof document !== "undefined") {
  if (document.currentScript) {
    isDebug.value = document.currentScript.attributes.hasOwnProperty("debug");
  } else {
    isDebug.value = true;
  }
}

let asyncsCounter = 0;
let afterTimer;
const tickSets = new Set();
export function nextTick(callback) {
  clearTimeout(afterTimer);
  afterTimer = setTimeout(() => {
    asyncsCounter = 0;
  });

  if (isDebug.value) {
    Promise.resolve().then(() => {
      asyncsCounter++;
      if (asyncsCounter > 100000) {
        const desc = `nextTick exceeds thread limit`;
        console.error({
          desc,
          lastCall: callback,
        });
        throw new Error(desc);
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
      const desc = `nextTick exceeds thread limit`;
      console.error({
        desc,
        lastCall: callback,
      });
      throw new Error(desc);
    }
    if (tickSets.has(tickId)) {
      callback();
      tickSets.delete(tickId);
    }
  });
  return tickId;
}

// export const clearTick = (id) => tickSets.delete(id);

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
export const extend = (_this, proto, descriptor = {}) => {
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

export function dataRevoked(data) {
  try {
    data.xid;
  } catch (err) {
    return isRevokedErr(err);
  }

  return false;
}

export function isRevokedErr(error) {
  const firstLine = error.stack.split(/\\n/)[0].toLowerCase();
  if (firstLine.includes("proxy") && firstLine.includes("revoked")) {
    return true;
  }

  return false;
}
