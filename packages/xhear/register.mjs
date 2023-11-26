import {
  hyphenToUpperCase,
  capitalizeFirstLetter,
  toDashCase,
} from "./public.mjs";
import { convert, render } from "./render/render.mjs";
import { eleX } from "./util.mjs";

const COMPS = {};

export const renderElement = ({ defaults, ele, template, temps }) => {
  let $ele;

  try {
    const data = {
      ...deepCopyData(defaults.data),
      ...defaults.attrs,
    };

    defaults.attrs &&
      Object.keys(defaults.attrs).forEach((name) => {
        const value = ele.getAttribute(toDashCase(name));
        if (value !== null && value !== undefined) {
          data[name] = value;
        }
      });

    $ele = eleX(ele);

    defaults.proto && $ele.extend(defaults.proto, { enumerable: false });

    for (let [key, value] of Object.entries(data)) {
      if (!$ele.hasOwnProperty(key)) {
        $ele[key] = value;
      }
    }

    if (defaults.temp) {
      const root = ele.attachShadow({ mode: "open" });

      root.innerHTML = template.innerHTML;

      render({
        target: root,
        data: $ele,
        temps,
      });
    }

    defaults.ready && defaults.ready.call($ele);
  } catch (error) {
    const err = new Error(
      `Render element error: ${ele.tagName} \n  ${error.stack}`
    );
    err.error = error;
    throw err;
  }

  if (defaults.watch) {
    const wen = Object.entries(defaults.watch);

    $ele.watchTick((e) => {
      for (let [name, func] of wen) {
        if (e.hasModified(name)) {
          func.call($ele, $ele[name], {
            watchers: e,
          });
        }
      }
    });

    for (let [name, func] of wen) {
      func.call($ele, $ele[name], {});
    }
  }
};

export const register = (opts = {}) => {
  const defaults = {
    // Registered component name
    tag: "",
    // Body content string
    temp: "",
    // Initialization data after element creation
    data: {},
    // Values that will not be traversed
    proto: {},
    // Keys bound to attributes
    // attrs: {},
    // The listener function for the element
    // watch: {},
    // Function triggered when the component is created (data initialization complete)
    // created() { },
    // Function triggered after component data initialization is complete (initial rendering completed)
    // ready() { },
    // Functions that are added to the document trigger
    // attached() { },
    // Functions triggered by moving out of the document
    // detached() { },
    // The container element is changed
    // slotchange() { }
    ...opts,
  };

  let template, temps, name;

  try {
    validateTagName(defaults.tag);

    defaults.data = deepCopyData(defaults.data);

    name = capitalizeFirstLetter(hyphenToUpperCase(defaults.tag));

    if (COMPS[name]) {
      throw `Component ${name} already exists`;
    }

    template = document.createElement("template");
    template.innerHTML = defaults.temp;
    temps = convert(template);
  } catch (error) {
    const err = new Error(
      `Register Component Error: ${defaults.tag} \n  ${error.stack}`
    );
    err.error = error;
    throw err;
  }

  const getAttrKeys = (attrs) => {
    let attrKeys;

    if (attrs instanceof Array) {
      attrKeys = [...attrs];
    } else {
      attrKeys = Object.keys(attrs);
    }

    return attrKeys;
  };

  const XElement = (COMPS[name] = class extends HTMLElement {
    constructor(...args) {
      super(...args);

      const $ele = eleX(this);

      defaults.created && defaults.created.call($ele);

      if (defaults.attrs) {
        const attrKeys = getAttrKeys(defaults.attrs);

        // fix self attribule value
        $ele.watchTick((e) => {
          attrKeys.forEach((key) => {
            if (e.hasModified(key)) {
              const val = $ele[key];
              const attrName = toDashCase(key);
              if (val === null || val === undefined) {
                this.removeAttribute(attrName);
              } else {
                this.setAttribute(attrName, val);
              }
            }
          });
        });
      }

      renderElement({
        defaults,
        ele: this,
        template,
        temps,
      });
    }

    connectedCallback() {
      if (isInternal(this)) {
        return;
      }

      defaults.attached && defaults.attached.call(eleX(this));
    }

    disconnectedCallback() {
      if (isInternal(this)) {
        return;
      }

      defaults.detached && defaults.detached.call(eleX(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const $ele = eleX(this);

      if (!/[^\d.]/.test(newValue) && typeof $ele[name] === "number") {
        newValue = Number(newValue);
      }

      $ele[hyphenToUpperCase(name)] = newValue;
    }

    static get observedAttributes() {
      return getAttrKeys(defaults.attrs || {}).map((e) => toDashCase(e));
    }
  });

  if (document.readyState !== "loading") {
    customElements.define(defaults.tag, XElement);
  } else {
    const READYSTATE = "readystatechange";
    let f;
    document.addEventListener(
      READYSTATE,
      (f = () => {
        customElements.define(defaults.tag, XElement);
        document.removeEventListener(READYSTATE, f);
      })
    );
  }
};

function isInternal(ele) {
  let target = ele;

  while (target) {
    if (target.__internal) {
      return true;
    }

    target = target.parentNode || target.host;

    if (!target || (target.tagName && target.tagName === "BODY")) {
      break;
    }
  }

  return false;
}

function validateTagName(str) {
  // Check if the string starts or ends with '-'
  if (str.charAt(0) === "-" || str.charAt(str.length - 1) === "-") {
    throw new Error(`The string "${str}" cannot start or end with "-"`);
  }

  // Check if the string has consecutive '-' characters
  for (let i = 0; i < str.length - 1; i++) {
    if (str.charAt(i) === "-" && str.charAt(i + 1) === "-") {
      throw new Error(
        `The string "${str}" cannot have consecutive "-" characters`
      );
    }
  }

  // Check if the string has at least one '-' character
  if (!str.includes("-")) {
    throw new Error(`The string "${str}" must contain at least one "-"`);
  }

  return true;
}

function deepCopyData(obj) {
  if (obj instanceof Set || obj instanceof Map) {
    throw "The data of the registered component should contain only regular data types such as String, Number, Object and Array. for other data types, please set them after ready.";
  }

  if (obj instanceof Function) {
    throw `Please write the function in the 'proto' property object.`;
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const copy = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopyData(obj[key]);
    }
  }

  return copy;
}
