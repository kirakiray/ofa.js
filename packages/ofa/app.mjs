// import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { initSrc } from "./page.mjs";
import { convert } from "../xhear/render/render.mjs";
import { renderElement } from "../xhear/register.mjs";
import { getRandomId } from "../stanz/public.mjs";

const HISTORY = Symbol("history");

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
    src: "",
    _opts: {},
  },
  watch: {
    async src(val) {
      const result = await initSrc(this, val);

      if (result === false) {
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
    async back() {
      if (!this[HISTORY].length) {
        console.warn(`It's already the first page, can't go back`);
        return;
      }

      // It is convenient to know that this current and the following current are not the same object
      const { current: oldCurrent } = this;

      this.push(this[HISTORY].pop());

      pageAddAnime({ page: this.current, key: "previous" });

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

      await outPage({
        page: oldCurrent,
        key: "previous",
      });

      // Removing child node data from historical routes
      oldCurrent.forEach((el) => el.remove());

      this[HISTORY].push(oldCurrent.toJSON());

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
      const routers = [...this[HISTORY], this.current.toJSON()];

      return routers;
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

    requestAnimationFrame(() => {
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
      requestAnimationFrame(() => {
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
