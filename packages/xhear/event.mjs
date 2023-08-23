const eventFn = {
  on(name, func, options) {
    if (options) {
      const beforeValue = options.beforeArgs[1];

      const oldFunc = func;

      const caches = this.__on_caches || (this.__on_caches = new Map());

      if (!/[^\d\w_\$\.]/.test(beforeValue)) {
        func = options.data.get(beforeValue).bind(options.data);

        caches.set(oldFunc, oldFunc);
      }
    }

    this.ele.addEventListener(name, func);

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

eventFn.on.revoke = ({ target, args }) => {
  const caches = target.__on_caches || (target.__on_caches = new Map());

  const currentFunc = caches.get(args[1]);
  caches.delete(args[1]);

  target.ele.removeEventListener(args[0], currentFunc);
};

export default eventFn;
