export default {
  on(name, func, options) {
    if (options && options.isExpr && !/[^\d\w_\$\.]/.test(func)) {
      const oriName = func;
      func = options.data.get(func);

      if (!func) {
        throw new Error(`${oriName} method does not exist`);
      }
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
