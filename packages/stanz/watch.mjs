import { getRandomId, debounce } from "./public.mjs";
import { WATCHS } from "./main.mjs";
const { assign, freeze } = Object;

class Watcher {
  constructor(opts) {
    assign(this, opts);
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

export const emitUpdate = ({
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

export default {
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
