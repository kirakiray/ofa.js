// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { resolvePath, getPagesData, ISERROR, createPage } from "./public.mjs";
import { getDefault, getFailContent } from "./page.mjs";
import { createXEle } from "../xhear/util.mjs";

const HISTORY = "_history";

const appendPage = async ({ src, app }) => {
  const { loading, fail } = app._module || {};

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    if (!loadingEl) {
      const errDesc = `loading function returns no content`;
      console.log(errDesc, ":", loading);
      throw new Error(errDesc);
    }

    app.push(loadingEl);
  }

  const currentPages = [];
  {
    const { current } = app;
    if (current) {
      currentPages.push(current);
      for (let page of current.parents) {
        if (page.tag !== "o-page") {
          break;
        }

        currentPages.unshift(page);
      }
    }
  }

  const oriNextPages = await getPagesData(src);

  let container = app;

  const publicParents = []; // Public parent pages that have not been cleared
  const finalPages = [];
  let old;

  // Nested routing code
  // Keep the parent page with the same src
  let isSame = true;
  oriNextPages.forEach((e, index) => {
    const current = currentPages[index];

    if (!isSame) {
      finalPages.push(e);
      return;
    }

    if (!current || current.src !== e.src) {
      isSame = false;
      finalPages.push(e);
      old = current;
      return;
    }

    publicParents.push(current);

    container = current;
  });

  // In the case of only the parent page, the old variable needs to be corrected
  if (currentPages.length > oriNextPages.length && !old) {
    currentPages.some((e, index) => {
      const current = oriNextPages[index];

      if (!current || current.src !== e.src) {
        old = e;
        return true;
      }
    });
  }

  let topPage, innerPage;

  finalPages.forEach((pageData) => {
    const { ISERROR: isError } = pageData;

    let page;
    if (isError) {
      const failContent = getFailContent(pageData.src, pageData, fail);

      page = createPage(pageData.src, {
        type: $.PAGE,
        temp: failContent,
      });
    } else {
      page = createPage(pageData.src, pageData.defaults);
    }

    if (!topPage) {
      topPage = page;
      return;
    }

    if (!innerPage) {
      topPage.push(page);
      innerPage = page;
      return;
    }

    innerPage.push(page);
    innerPage = page;
  });

  if (topPage) {
    container.push(topPage);
  }

  loadingEl && loadingEl.remove();

  return { current: topPage, old, publics: publicParents };
};

const emitRouterChange = (_this, publics, type) => {
  if (publics && publics.length) {
    const { current } = _this;
    publics.forEach((page) => {
      // const { page } = e;
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
    appIsReady: null,
  },
  watch: {
    async src(val) {
      if (this.__init_src) {
        if (this.__init_src !== val) {
          throw new Error(
            "The App that has already been initialized cannot be set with the src attribute"
          );
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

      this.extend(defaults.proto);

      if (defaults.ready) {
        defaults.ready.call(this);
      }

      if (this._settedRouters) {
        return;
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

      const { _noanime } = this;

      // Delete historical data for response numbers
      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src: newCurrent.src,
        app: this,
      });

      if (!_noanime && page) {
        pageInAnime({
          page,
          key: "previous",
        });
      }

      if (needRemovePage) {
        needRemovePage = resetOldPage(needRemovePage);
      }

      this.emit("router-change", {
        data: { name: "back", delta },
      });

      emitRouterChange(this, publics, "back");

      if (!_noanime && needRemovePage) {
        await pageOutAnime({
          page: needRemovePage,
          key: "next",
        });
      }

      if (needRemovePage) {
        needRemovePage.remove();
      }
    },
    async _navigate({ type, src }) {
      const { _noanime } = this;
      const { current: oldCurrent } = this;
      // src = new URL(src, location.href).href;
      src = resolvePath(src);

      runAccess(this, src);

      if (!oldCurrent) {
        this._initHome = src;
      }

      let {
        current: page,
        old: needRemovePage,
        publics,
      } = await appendPage({
        src,
        app: this,
      });

      if (!page) {
        return;
      }

      if (!_noanime) {
        pageInAnime({
          page,
          key: "next",
        });
      }

      if (needRemovePage) {
        needRemovePage = resetOldPage(needRemovePage);
      }

      if (type === "goto") {
        oldCurrent && this[HISTORY].push({ src: oldCurrent.src });
      }

      this.emit("router-change", {
        data: { name: type, src },
      });

      emitRouterChange(this, publics, type);

      if (oldCurrent && needRemovePage) {
        if (!_noanime) {
          await pageOutAnime({
            page: needRemovePage,
            key: "previous",
          });
        }
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
      return this.all("o-page")
        .reverse()
        .find((page) => {
          let target = page;
          while (target.tag === "o-page") {
            if (target.data.willRemoved) {
              return false;
            }
            target = target.parent;
          }

          return true;
        });
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
        runAccess(this, e.src);

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

// Ensure that the page is available, handle cross-domain pages and other operations
const runAccess = (app, src) => {
  const access = app?._module?.access;

  const srcObj = new URL(src);

  if (srcObj.origin !== location.origin && !access) {
    const NoAccessErrDesc =
      "To jump across domains, the access function must be set";
    console.log(NoAccessErrDesc, app.ele, app?._module);
    throw new Error(NoAccessErrDesc);
  }

  if (access) {
    const result = access(src);

    if (result !== true) {
      if (result instanceof Error) {
        throw result;
      }

      throw new Error(`Access to current address is not allowed: ${src}`);
    }
  }
};

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
    setTimeout(func, 5);
  });

const resetOldPage = (needRemovePage) => {
  needRemovePage.css = {
    position: "absolute",
    width: `${needRemovePage.width}px`,
    height: `${needRemovePage.height}px`,
  };
  needRemovePage.data.willRemoved = 1;

  return needRemovePage;
};
