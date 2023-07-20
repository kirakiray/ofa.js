// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { resolvePath, getPagesData, ISERROR, createPage } from "./public.mjs";
import { getDefault } from "./page.mjs";
import { createXEle } from "../xhear/util.mjs";
import { getRandomId } from "../stanz/public.mjs";

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

  const currentPages = [];

  // 需要删除的页面
  let oldPage = _this.current;
  // 下一页
  let page;

  {
    let target = oldPage;

    do {
      currentPages.unshift({
        page: target,
        src: target.src,
      });
      target = target.parent;
    } while (target.tag === "o-page");
  }

  let loadingEl;
  if (loading) {
    loadingEl = createXEle(loading());

    _this.push(loadingEl);
  }

  // 用更塞入新 page 的容器；默认是 o-app，子路由的模式下或是 o-page
  let container = _this;

  const oriNextPages = await getPagesData(src);

  console.log("nextPages => ", oriNextPages);

  // Finding shared parent pages in the case of subroutes
  const publicPages = [];
  let targetIndex = -1;
  currentPages.some((e, i) => {
    const next = oriNextPages[i];

    if (next.src === e.src) {
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

  return { page, old: oldPage };
};

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(o-page){display:block;position:absolute;left:0;top:0;width:100%;height:100%}</style><slot></slot>`,
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

      // It is convenient to know that this current and the following current are not the same object
      const { current: oldCurrent } = this;

      delta = delta < this[HISTORY].length ? delta : this[HISTORY].length;

      const newCurrent = this[HISTORY].splice(-delta)[0];

      this.push({
        ...newCurrent,
      });

      pageInAnime({
        page: this.current,
        key: "previous",
      });

      this.emit("router-change", {
        name: "back",
        delta,
      });

      const targetPage = getTopPage(oldCurrent);

      await pageOutAnime({
        page: targetPage,
        key: "next",
      });

      targetPage.remove();
    },
    async goto(src) {
      const { current: oldCurrent } = this;

      if (!oldCurrent) {
        this._initHome = src;
      }

      // When the page element is initialized, the parent element is already available within the ready function
      const { page, old: needRemovePage } = await appendPage({
        src,
        _this: this,
      });

      pageInAnime({
        page,
        key: "next",
      });

      oldCurrent && this[HISTORY].push(removeSubs(oldCurrent.toJSON()));

      this.emit("router-change", {
        name: "goto",
        src,
      });

      if (oldCurrent) {
        await pageOutAnime({
          page: needRemovePage,
          key: "previous",
        });

        needRemovePage.remove();
      }
    },
    async replace(src) {
      const { current: oldCurrent } = this;

      const { page } = await appendPage({ src, _this: this });

      pageInAnime({
        page,
        key: "next",
      });

      this.emit("router-change", {
        name: "replace",
        src,
      });

      if (oldCurrent) {
        const targetOldPage = getTopPage(oldCurrent);

        await pageOutAnime({
          page: targetOldPage,
          key: "previous",
        });

        targetOldPage.remove();
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
});

const getTopPage = (page) => {
  let targetPage = page;

  while (targetPage.parent.tag === "o-page") {
    targetPage = targetPage.parent;
  }

  return targetPage;
};

const pageInAnime = ({ page, key }) => {
  const { pageAnime } = page;

  const targetAnime = pageAnime[key];

  if (targetAnime) {
    page.css = {
      ...page.css,
      transition: "all ease .3s",
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
