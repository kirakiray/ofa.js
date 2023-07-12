// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { convert } from "../xhear/render/render.mjs";
import { renderElement } from "../xhear/register.mjs";
import { resolvePath } from "./public.mjs";
import { getDefault } from "./page.mjs";
import { eleX } from "../xhear/util.mjs";

const HISTORY = "_history";

const removeSubs = (current) => {
  Object.keys(current).forEach((key) => {
    if (!isNaN(key)) {
      delete current[key];
    }
  });

  return current;
};

const getLoading = ({ self: _this, src, type }) => {
  const { loading } = _this._opts;

  let loadingContent = "";
  if (loading) {
    loadingContent = loading({ src, type });
  }

  return loadingContent;
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(o-page){display:block;position:absolute;left:0;top:0;width:100%;height:100%}</style><slot></slot>`,
  attrs: {
    src: null,
  },
  data: {
    _opts: {},
  },
  watch: {
    async src(val) {
      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw "The App that has already been initialized cannot be set with the src attribute";
        }
        return;
      }

      if (!val) {
        return;
      }

      this.__init_src = val;

      let selfUrl = val;
      if (val && !val.startsWith("//") && !/[a-z]+:\/\//.test(val)) {
        selfUrl = resolvePath(val);
      }

      const load = lm();

      const moduleData = await load(selfUrl);

      const defaults = await getDefault(moduleData, selfUrl);

      this._module = defaults;

      if (this._settedRouters) {
        return;
      }

      this.extend(defaults.proto);

      if (defaults.ready) {
        defaults.ready.call(this);
      }

      const { loading, fail } = defaults;

      this.on("error", (e) => {
        let failContent = ``;

        if (fail) {
          failContent = fail({
            target: e.target,
            src: e.target.getAttribute("src"),
            error: e.error,
          });
        }

        const template = document.createElement("template");
        template.innerHTML = failContent;
        const temps = convert(template);

        renderElement({
          defaults: {
            temp: " ",
          },
          ele: e.target,
          template,
          temps,
        });

        e.target.innerHTML = "";
      });

      if (!this.$("o-page") && !this._initHome && defaults.home) {
        const homeUrl = new URL(defaults.home, selfUrl).href;
        this.push(`<o-page src="${homeUrl}"></o-page>`);
      }

      Object.assign(this._opts, {
        loading,
        fail,
      });
    },
  },
  proto: {
    [HISTORY]: [],
    async back(delta = 1) {
      if (!this[HISTORY].length) {
        console.warn(`It's already the first page, can't go back`);
        return;
      }

      // It is convenient to know that this current and the following current are not the same object
      const { current: oldCurrent } = this;

      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];
      this.push({
        ...newCurrent,
        html: getLoading({
          self: this,
          src: newCurrent.src,
          type: "back",
        }),
      });

      pageAddAnime({ page: this.current, key: "previous" });

      this.emit("router-change", {
        name: "back",
        delta,
      });

      await outPage({
        page: oldCurrent,
        key: "next",
      });

      oldCurrent.remove();
    },
    async goto(src) {
      const { current: oldCurrent } = this;

      if (!oldCurrent) {
        this._initHome = src;
      }

      const page = await new Promise((resolve) => {
        const tempCon = document.createElement("div");
        tempCon.innerHTML = `<o-page src="${src}"></o-page>`;
        const pageEl = eleX(tempCon.querySelector("o-page"));

        pageEl.one("page-loaded", () => {
          // In the case of a child route, the parent page should be returned.
          resolve(eleX(tempCon.querySelector("o-page")));
        });
      });

      // When the page element is initialized, the parent element is already available within the ready function
      this.push(page);

      pageAddAnime({ page, key: "next" });

      oldCurrent && this[HISTORY].push(removeSubs(oldCurrent.toJSON()));

      this.emit("router-change", {
        name: "goto",
        src,
      });

      if (oldCurrent) {
        await outPage({
          page: oldCurrent,
          key: "previous",
        });

        oldCurrent.remove();
      }
    },
    async replace(src) {
      const { current: oldCurrent } = this;

      this.push(
        `<o-page src="${src}">${getLoading({
          self: this,
          src,
          type: "replace",
        })}</o-page>`
      );

      pageAddAnime({
        page: this.current,
        key: "next",
      });

      this.emit("router-change", {
        name: "replace",
        src,
      });
      if (oldCurrent) {
        await outPage({
          page: oldCurrent,
          key: "previous",
        });

        oldCurrent.remove();
      }
    },
    get current() {
      return this.all("o-page").slice(-1)[0];
    },
    get routers() {
      let { current } = this;

      if (!current) {
        return [];
      }

      current = current.toJSON();

      removeSubs(current);

      const routers = [...this[HISTORY], current];

      return routers;
    },
    set routers(_routers) {
      this._settedRouters = 1;

      this.html = "";

      const historyRouters = _routers.slice();

      const currentRouter = historyRouters.pop();

      this[HISTORY].length = 0;
      this[HISTORY].push(...historyRouters);

      this.push(currentRouter);
    },
  },
  ready() {},
});

const pageAddAnime = ({ page, key }) => {
  const { pageAnime } = page;

  const targetAnime = pageAnime[key];

  if (targetAnime) {
    page.style = {
      transition: "all ease .3s",
      ...targetAnime,
    };

    nextAnimeFrame(() => {
      page.style = {
        transition: "all ease .3s",
        ...(pageAnime.current || {}),
      };
    });
  }
};

const outPage = ({ page, key }) =>
  new Promise((resolve) => {
    const targetAnime = page.pageAnime[key];

    if (targetAnime) {
      nextAnimeFrame(() => {
        page.one("transitionend", resolve);

        page.style = {
          transition: "all ease .3s",
          ...targetAnime,
        };
      });
    } else {
      resolve();
    }
  });

const nextAnimeFrame = (func) =>
  requestAnimationFrame(() => {
    setTimeout(func, 5);
  });
