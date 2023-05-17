export default {
  sync(propName, targetName, options) {
    if (!options) {
      throw `Sync is only allowed within the renderer`;
    }

    const { data } = options;

    this[propName] = data[targetName];

    const wid1 = this.watch((e) => {
      if (e.hasModified(propName)) {
        data[targetName] = this[propName];
      }
    });

    const wid2 = data.watch((e) => {
      if (e.hasModified(targetName)) {
        this[propName] = data[targetName];
      }
    });

    return () => {
      this.unwatch(wid1);
      data.unwatch(wid2);
    };
  },
};
