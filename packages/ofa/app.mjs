import lm from "../drill.js/base.mjs";
import $ from "../xhear/base.mjs";
import { initSrc } from "./page.mjs";

const HISTORY = Symbol("history");

$.register({
  tag: "o-app",
  temp: `<style>:host{position:relative;display:block}::slotted(o-page){display:block;position:absolute;left:0;top:0;width:100%;height:100%}</style><slot></slot>`,
  attrs: {
    src: "",
  },
  watch: {
    async src(val) {
      const result = await initSrc(this, val);

      if (result === false) {
        return;
      }

      const { selfUrl, defaults } = result;

      this.extend(defaults.proto);

      if (defaults.ready) {
        defaults.ready.call(this);
      }

      const homeUrl = new URL(defaults.home, selfUrl).href;

      this.push(`<o-page src="${homeUrl}"></o-page>`);
    },
  },
  proto: {
    [HISTORY]: [],
    back() {
      if (!this[HISTORY].length) {
        console.warn(`It's already the first page, can't go back`);
        return;
      }
      this.current.remove();

      const newCurrent = this[HISTORY].pop();

      this.push(newCurrent);
    },
    goto(src) {
      const { current } = this;
      this[HISTORY].push(current.toJSON());

      this.push(`<o-page src="${src}"></o-page>`);

      current.remove();
    },
    replace(src) {
      this.current.remove();
      this.push(`<o-page src="${src}"></o-page>`);
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
