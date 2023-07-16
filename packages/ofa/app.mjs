// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { convert } from "../xhear/render/render.mjs";
import { renderElement } from "../xhear/register.mjs";
import { resolvePath, getPagesData, ISERROR, createPage } from "./public.mjs";
import { getDefault } from "./page.mjs";
import { createXEle, eleX } from "../xhear/util.mjs";

const HISTORY = "_history";

const removeSubs = (current) => {
  Object.keys(current).forEach((key) => {
    if (!isNaN(key)) {
      delete current[key];
    }
  });

  return current;
};

const appendPage = async ({ src, _this }) => {
  const { loading, fail } = _this._module || {};

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    _this.push(loadingEl);
  }

  const page = await new Promise(async (resolve) => {
    const pagesData = await getPagesData(src);

    let topPage, targetPage;

    pagesData.some((e) => {
      const { defaults, ISERROR } = e;

      if (ISERROR) {
        if (fail) {
          const failContent = fail({
            src,
            error: e.error,
          });

          topPage = createPage(e.src, {
            type: $.PAGE,
            temp: failContent,
          });
        }
        return false;
      }

      const subPage = createPage(src, defaults);

      if (!targetPage) {
        topPage = subPage;
      }

      if (targetPage) {
        targetPage.push(subPage);
      }

      targetPage = subPage;
    });

    resolve(topPage);
  });

  loadingEl && loadingEl.remove();

  _this.push(page);

  return page;
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(o-page){display:block;position:absolute;left:0;top:0;width:100%;height:100%}</style><slot></slot>`,
  attrs: {
    src: null,
  },
  data: {},
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

      if (!this.$("o-page") && !this._initHome && defaults.home) {
        const homeUrl = new URL(defaults.home, selfUrl).href;
        this.push(`<o-page src="${homeUrl}"></o-page>`);
      }
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
      });

      pageAddAnime({
        page: this.current,
        key: "previous",
      });

      this.emit("router-change", {
        name: "back",
        delta,
      });

      let targetPage = oldCurrent;

      while (targetPage.parent.tag === "o-page") {
        targetPage = targetPage.parent;
      }

      await outPage({
        page: targetPage,
        key: "next",
      });

      oldCurrent.remove();
    },
    async goto(src) {
      const { current: oldCurrent } = this;

      if (!oldCurrent) {
        this._initHome = src;
      }

      // When the page element is initialized, the parent element is already available within the ready function
      const page = await appendPage({ src, _this: this });

      pageAddAnime({
        page,
        key: "next",
      });

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

      const page = await appendPage({ src, _this: this });

      pageAddAnime({
        page,
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
