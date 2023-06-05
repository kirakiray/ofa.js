import { agent, LOADED } from "./main.mjs";

class LoadModule extends HTMLElement {
  constructor(...args) {
    super(...args);

    this[LOADED] = false;

    Object.defineProperties(this, {
      loaded: {
        get: () => this[LOADED],
      },
    });

    this._init();
  }

  _init() {
    if (this.__initSrc || this.attributes.hasOwnProperty("pause")) {
      return;
    }

    let src = this.getAttribute("src");

    if (!src) {
      return;
      // throw `The ${this.tagName.toLowerCase()} element requires the src attribut `;
    }
    this.__initSrc = src;

    src = new URL(src, location.href).href;
    Object.defineProperties(this, {
      src: {
        configurable: true,
        value: src,
      },
    });

    const [url, ...params] = src.split(" ");

    agent(url, {
      element: this,
      params,
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      if (newValue && oldValue === null) {
        this._init();
      } else if (this.__initSrc && oldValue && newValue !== this.__initSrc) {
        console.warn(
          `${this.tagName.toLowerCase()} change src is invalid, only the first change will be loaded`
        );
        this.setAttribute("src", this.__initSrc);
      }
    } else if (name === "pause" && newValue === null) {
      this._init();
    }
  }

  static get observedAttributes() {
    return ["src", "pause"];
  }
}

class LM extends LoadModule {
  constructor(...args) {
    super(...args);
  }
}

customElements.define("load-module", LoadModule);
customElements.define("l-m", LM);
