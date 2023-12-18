import { hyphenToUpperCase } from "../public.mjs";
const syncFn = {
  sync(propName, targetName, options) {
    if (!options) {
      throw `Sync is only allowed within the renderer`;
    }

    [propName, targetName] = options.beforeArgs;

    propName = hyphenToUpperCase(propName);
    targetName = hyphenToUpperCase(targetName);

    const { data } = options;

    const val = data.get(targetName);

    if (val instanceof Object) {
      const err = `Object values cannot be synchronized using the sync function : ${targetName}`;
      console.log(err, data);
      throw new Error(err);
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
      data.unwatch(wid2);
    };
  },
};

syncFn.sync.revoke = (e) => {
  e.result();
};

export default syncFn;
