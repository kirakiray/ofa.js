drill.ext(({ addProcess }) => {
  addProcess("Page", async ({ respone, record, relativeLoad }) => {
    let result = respone;

    if (isFunction(respone)) {
      result = await respone({
        load: relativeLoad,
        FILE: record.src,
      });
    }

    // Conversion Templates
    const defaults = await getDefaults(record, relativeLoad, result);
    let d = transTemp(defaults.temp);
    defaults.temp = d.html;

    // Get settable keys
    const cansetKeys = getCansetKeys(defaults);

    record.done(async (pkg) => {
      return { defaults, cansetKeys, temps: d.temps };
    });
  });
});

const PAGESTATUS = Symbol("page_status");

// Get the o-page on the o-app layer
const getCurrentPage = (host) => {
  if (host.parent.is("o-app")) {
    return host;
  }

  while (host.host) {
    host = host.host;
    if (host.is("o-page") && host.parent.is("o-app")) {
      return host;
    }
  }
};

register({
  tag: "o-page",
  attrs: {
    // Resource Address
    src: null,
  },
  data: {
    // Status of the current page
    // empty: blank state, waiting for the page to be loaded
    // loading : loading
    // loaded: loaded successfully
    // error: loading resource failed
    [PAGESTATUS]: "empty",
  },
  proto: {
    get status() {
      return this[PAGESTATUS];
    },
    get app() {
      let target = getCurrentPage(this);

      if (target) {
        return target.parent;
      }
      console.warn({
        desc: `cannot find the app`,
        target: this,
      });
      return null;
    },
    get query() {
      const searchParams = new URLSearchParams(
        this.src.replace(/.+(\?.+)/, "$1")
      );

      let obj = {};

      for (const [key, value] of searchParams.entries()) {
        obj[key] = value;
      }

      return obj;
    },
    // Jump to the corresponding page
    navigateTo(src) {
      let cPage = getCurrentPage(this);

      if (!cPage) {
        throw {
          desc: "cannot use navigateTo without in app",
          target: this,
        };
      }

      // Find the id of the current page
      const { router } = this.app;
      let id = router.findIndex((e) => e._page == cPage);

      router.splice(id + 1, router.length, src);
    },
    // Replacement Jump
    replaceTo(src) {
      let cPage = getCurrentPage(this);

      if (!cPage) {
        throw {
          desc: "cannot use replaceTo without in app",
          target: this,
        };
      }

      // Find the id of the current page
      const { router } = this.app;
      let id = router.findIndex((e) => e._page == cPage);

      router.splice(id, router.length, src);
    },
    // back page
    back() {
      let { app } = this;
      app && app.back();
    },
  },
  watch: {
    async src(src) {
      if (!src) {
        return;
      }
      if (this[PAGESTATUS] !== "empty") {
        throw {
          desc: "src can only be set once",
          target: this,
        };
      }

      this[PAGESTATUS] = "loading";

      if (this._waiting) {
        // Waiting to load
        await this._waiting;
      }

      let defaults;

      // Get rendering data
      try {
        let data = await load(src);

        this._realsrc = await load(src + " -link");

        // Revise modifiable fields
        const n_keys = new Set([
          ...Array.from(this[CANSETKEYS]),
          ...data.cansetKeys,
        ]);
        n_keys.delete("src");
        this[CANSETKEYS] = n_keys;

        defaults = data.defaults;

        // Merging data in the prototype chain
        extend(this, defaults.proto);

        // Render the element again
        renderXEle({
          xele: this,
          defs: Object.assign({}, defaults, {
            // o-page does not allow attrs
            attrs: {},
          }),
          temps: data.temps,
          _this: this.ele,
        }).then((e) => {
          this.ele.x_render = 2;
          this.attr("x-render", 2);
        });
      } catch (err) {
        if (glo.ofa) {
          this.html = ofa.onState.loadError(err);
          this[PAGESTATUS] = "error";
        }
        return;
      }

      this[PAGESTATUS] = "loaded";

      emitUpdate(this, {
        xid: this.xid,
        name: "setData",
        args: ["status", this[PAGESTATUS]],
      });

      defaults.attached &&
        this.__attached_pms.then(() => defaults.attached.call(this));
      defaults.detached &&
        this.__detached_pms.then(() => defaults.detached.call(this));
    },
  },
  created() {
    this.__attached_pms = new Promise((res) => (this.__attached_resolve = res));
    this.__detached_pms = new Promise((res) => (this.__detached_resolve = res));
    this.__loaded
  },
  attached() {
    this.__attached_resolve();
  },
  detached() {
    this.__detached_resolve();
  },
});
