import { getErr } from "../ofa-error/main.js";

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

    event.data = data;

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

export default eventFn;
