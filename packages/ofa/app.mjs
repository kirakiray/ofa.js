// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { initSrc } from "./page.mjs";
import { convert } from "../xhear/render/render.mjs";
import { renderElement } from "../xhear/register.mjs";
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
      const result = await initSrc(this, val);

      if (result === false || this._settedRouters) {
        return;
      }

      this._module = result;

      const { selfUrl, defaults } = result;

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

      const homeUrl = new URL(defaults.home, selfUrl).href;

      this.push(`<o-page src="${homeUrl}"></o-page>`);

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

      const markID = "m_" + getRandomId();

      // When the page element is initialized, the parent element is already available within the ready function
      this.push(
        `<o-page src="${src}" ${markID}>${getLoading({
          self: this,
          src,
          type: "goto",
        })}</o-page>`
      );

      const newCurrent = this.$(`[${markID}]`);
      newCurrent.ele.removeAttribute(markID);

      pageAddAnime({ page: newCurrent, key: "next" });

      this[HISTORY].push(removeSubs(oldCurrent.toJSON()));

      this.emit("router-change", {
        name: "goto",
        src,
      });

      await outPage({
        page: oldCurrent,
        key: "previous",
      });

      oldCurrent.remove();
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

      await outPage({
        page: oldCurrent,
        key: "previous",
      });

      oldCurrent.remove();
    },
    get current() {
      return this.$("o-page:last-of-type");
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
