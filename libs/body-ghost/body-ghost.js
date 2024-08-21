(() => {
  const MAPPGING_ELE = Symbol("mapping-element");
  const ORIGIN_ELE = Symbol("origin-element");

  $.register({
    tag: "body-ghost-mapping",
    temp: `<style>:host{display:contents}</style>`,
  });

  $.register({
    tag: "body-ghost",
    data: {
      ghostId: Math.random().toString(32).slice(2),
    },
    temp: `<style>:host{display:none}</style>`,
    proto: {
      get mapping() {
        return this[MAPPGING_ELE];
      },
    },
    ready() {
      this[MAPPGING_ELE] = null;
    },
    attached() {
      const mappingEl = (this[MAPPGING_ELE] =
        document.createElement("body-ghost-mapping"));

      mappingEl[ORIGIN_ELE] = this.ele;

      const originChildNodes = this.ele.childNodes;

      // 伪装 childNodes
      Object.defineProperties(this.ele, {
        childNodes: {
          get: () => {
            return this[MAPPGING_ELE].childNodes;
          },
        },
        _childNodes: {
          get() {
            return originChildNodes;
          },
        },
      });

      $.nextTick(() => {
        Array.from(originChildNodes).forEach((el) => {
          el.__internal = 1;
          mappingEl.shadowRoot.appendChild(el);
          delete el.__internal;
        });
      });

      document.body.appendChild(mappingEl);
    },
    detached() {
      if (this[MAPPGING_ELE]) {
        this[MAPPGING_ELE].remove();
        this[MAPPGING_ELE] = null;
      }
    },
  });
})();
