import { getRandomId, debounce } from "./public.mjs";
import { WATCHS } from "./main.mjs";
const { assign, freeze } = Object;

class Watcher {
  constructor(opts) {
    assign(this, opts);
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
