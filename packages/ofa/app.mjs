// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { resolvePath, getPagesData, ISERROR, createPage } from "./public.mjs";
import { getDefault } from "./page.mjs";
import { createXEle } from "../xhear/util.mjs";

const HISTORY = "_history";

const appendPage = async ({ src, _this }) => {
  const { loading, fail } = _this._module || {};

  const currentPages = [];

  // Pages to be deleted
  let oldPage = _this.current;

  // The next page to appear
  let page;

  if (oldPage) {
    let target = oldPage;

    do {
      currentPages.unshift({
        page: target,
        src: target.src,
      });
      oldPage = target;
      target = target.parent;
    } while (target.tag === "o-page");
  }

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    _this.push(loadingEl);
  }

  // Container for stuffing new pages; o-app by default, or o-page in subrouting mode.
  let container = _this;

  const oriNextPages = await getPagesData(src);

  // Finding shared parent pages in the case of subroutes
  const publicPages = [];
  let targetIndex = -1;
  const lastIndex = currentPages.length - 1;
  currentPages.some((e, i) => {
    const next = oriNextPages[i];

    if (next.src === e.src && i !== lastIndex) {
      publicPages.push(e);
      targetIndex = i;
      return false;
    }

    return true;
  });

  let nextPages = oriNextPages;

  if (targetIndex >= 0) {
    container = publicPages.slice(-1)[0].page;
    oldPage = container[0];
    nextPages = oriNextPages.slice(targetIndex + 1);
  }

  let targetPage;

  nextPages.some((e) => {
    const { defaults, ISERROR: isError } = e;

    if (isError === ISERROR) {
      if (fail) {
        const failContent = fail({
          src,
          error: e.error,
        });

        page = createPage(e.src, {
          type: $.PAGE,
          temp: failContent,
        });
      }
      return false;
    }

    const subPage = createPage(e.src, defaults);

    if (!targetPage) {
      page = subPage;
    }

    if (targetPage) {
      targetPage.push(subPage);
    }

    targetPage = subPage;
  });

  loadingEl && loadingEl.remove();

  container.push(page);

  return { current: page, old: oldPage, publics: publicPages };
};

const emitRouterChange = (_this, publics, type) => {
  if (publics && publics.length) {
    const { current } = _this;
    publics.forEach((e) => {
      const { page } = e;
      const { routerChange } = page._defaults;

      if (routerChange) {
        routerChange.call(page, { type, current });
      }
    });
  }
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(*){display:block;width:100%;height:100%;}</style><slot></slot>`,
  attrs: {
    src: null,
  },
  data: {
    [HISTORY]: [],
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

      if (!this.$("o-page") && !this._initHome && defaults.home) {
        const homeUrl = new URL(defaults.home, selfUrl).href;
        this.push(`<o-page src="${homeUrl}"></o-page>`);
      }
    },
  },
  proto: {
    async back(delta = 1) {
      if (!this[HISTORY].length) {
        console.warn(`It's already the first page, can't go back`);
        return;
      }

      // Delete historical data for response numbers
      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src: newCurrent.src,
        _this: this,
      });

      pageInAnime({
        page,
        key: "previous",
      });

      needRemovePage = resetOldPage(needRemovePage);

      this.emit("router-change", {
        name: "back",
        delta,
      });

      emitRouterChange(this, publics, "back");

      await pageOutAnime({
        page: needRemovePage,
        key: "next",
      });

      needRemovePage.remove();
    },
    async _navigate({ type, src }) {
      const { current: oldCurrent } = this;
      src = new URL(src, location.href).href;

      if (!oldCurrent) {
        this._initHome = src;
      }

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src,
        _this: this,
      });

      pageInAnime({
        page,
        key: "next",
      });

      needRemovePage = resetOldPage(needRemovePage);

      if (type === "goto") {
        oldCurrent && this[HISTORY].push({ src: oldCurrent.src });
      }

      this.emit("router-change", {
        name: type,
        src,
      });

      emitRouterChange(this, publics, type);

      if (oldCurrent) {
        await pageOutAnime({
          page: needRemovePage,
          key: "previous",
        });

        needRemovePage.remove();
      }
    },
    goto(src) {
      return this._navigate({ type: "goto", src });
    },
    replace(src) {
      return this._navigate({ type: "replace", src });
    },
    get current() {
      return this.all("o-page").slice(-1)[0];
    },
    get routers() {
      let { current } = this;

      if (!current) {
        return [];
      }

      const routers = [
        ...this[HISTORY],
        {
          src: current.src,
        },
      ];

      return routers;
    },
    set routers(_routers) {
      _routers = _routers.map((e) => {
        return { src: e.src };
      });

      this._settedRouters = 1;

      this.html = "";

      const historyRouters = _routers.slice();

      const currentRouter = historyRouters.pop();

      this[HISTORY].length = 0;
      this[HISTORY].push(...historyRouters);

      this.push({
        tag: "o-page",
        src: currentRouter.src,
      });
    },
  },
});

const pageInAnime = ({ page, key }) => {
  const { pageAnime } = page;

  const targetAnime = pageAnime[key];

  if (targetAnime) {
    page.css = {
      ...page.css,
      ...targetAnime,
    };

    nextAnimeFrame(() => {
      page.css = {
        ...page.css,
        transition: "all ease .3s",
        ...(pageAnime.current || {}),
      };
    });
  }
};

const pageOutAnime = ({ page, key }) =>
  new Promise((resolve) => {
    const targetAnime = page.pageAnime[key];

    if (targetAnime) {
      nextAnimeFrame(() => {
        page.one("transitionend", resolve);

        page.css = {
          ...page.css,
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
    setTimeout(func, 50);
  });

const resetOldPage = (needRemovePage) => {
  needRemovePage.css = {
    position: "absolute",
    width: `${needRemovePage.width}px`,
    height: `${needRemovePage.height}px`,
  };

  return needRemovePage;
};
