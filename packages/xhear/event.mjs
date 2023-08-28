const eventFn = {
  on(name, func, options) {
    let revoker;
    if (options) {
      const beforeValue = options.beforeArgs[1];

      if (!/[^\d\w_\$\.]/.test(beforeValue)) {
        func = options.data.get(beforeValue).bind(options.data);
      }

      revoker = () => this.ele.removeEventListener(name, func);
    }

    this.ele.addEventListener(name, func);

    if (revoker) {
      return revoker;
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

export default eventFn;
