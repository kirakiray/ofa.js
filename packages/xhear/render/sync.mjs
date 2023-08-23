export default {
  sync(propName, targetName, options) {
    if (!options) {
      throw `Sync is only allowed within the renderer`;
    }

    [propName, targetName] = options.beforeArgs;

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
