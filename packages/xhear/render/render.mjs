import {
  isFunction,
  hyphenToUpperCase,
  meetsEle,
  isEmptyObject,
  searchEle,
  removeArrayValue as remove,
} from "../public.mjs";
import { eleX } from "../util.mjs";

export const renderExtends = {
  render() {},
};

const getRevokes = (target) => target.__revokes || (target.__revokes = []);
const addRevoke = (target, revoke) => getRevokes(target).push(revoke);

const convertToFunc = (expr, data) => {
  const funcStr = `
const [$event] = $args;
try{
  with(this){
    return ${expr};
  }
}catch(error){
  console.error(error);
}
`;
  return new Function("...$args", funcStr).bind(data);
};

export function render({
  data,
  target,
  template,
  temps,
  isRenderSelf,
  ...otherOpts
}) {
  const content = template && template.innerHTML;

  if (content) {
    target.innerHTML = content;
  }

  const texts = searchEle(target, "xtext");

  const tasks = [];
  const revokes = getRevokes(target);

  texts.forEach((el) => {
    const textEl = document.createTextNode("");
    const { parentNode } = el;
    parentNode.insertBefore(textEl, el);
    parentNode.removeChild(el);

    const func = convertToFunc(el.getAttribute("expr"), data);
    const renderFunc = () => {
      textEl.textContent = func();
    };
    tasks.push(renderFunc);

    const textRevoke = () => {
      remove(revokes, textRevoke);
      remove(tasks, renderFunc);
      remove(getRevokes(textEl), textRevoke);
    };
    revokes.push(textRevoke);
    addRevoke(textEl, textRevoke);
  });

  const eles = searchEle(target, `[x-bind-data]`);

  if (isRenderSelf && meetsEle(target, `[x-bind-data]`)) {
    eles.unshift(target);
  }

  eles.forEach((el) => {
    const bindData = JSON.parse(el.getAttribute("x-bind-data"));

    const $el = eleX(el);

    for (let [actionName, arr] of Object.entries(bindData)) {
      arr.forEach((args) => {
        try {
          const { always } = $el[actionName];

          const func = () => {
            const revoker = $el[actionName](...args, {
              isExpr: true,
              data,
              temps,
              ...otherOpts,
            });

            renderExtends.render({
              step: "refresh",
              args,
              name: actionName,
              target: $el,
            });

            return revoker;
          };

          let actionRevoke;

          if (always) {
            // Run every data update
            tasks.push(func);

            actionRevoke = () => {
              remove(revokes, actionRevoke);
              remove(tasks, func);
              remove(getRevokes(el), actionRevoke);
              // delete el.__revoke;
            };
          } else {
            const revokeFunc = func();

            if (isFunction(revokeFunc)) {
              actionRevoke = () => {
                remove(revokes, actionRevoke);
                remove(getRevokes(el), actionRevoke);
                revokeFunc();
                // delete el.__revoke;
              };
            } else {
              console.warn(`${actionName} render method need return revoke`);
            }
            // el.__revoke = actionRevoke;
          }

          revokes.push(actionRevoke);
          addRevoke(el, actionRevoke);
        } catch (error) {
          const err = new Error(
            `Execution of the ${actionName} method reports an error :\n ${error.stack}`
          );
          err.error = error;
          throw err;
        }
      });
    }

    el.removeAttribute("x-bind-data");
  });

  if (!target.__render_temps && !isEmptyObject(temps)) {
    target.__render_temps = temps;
  }

  if (tasks.length) {
    if (target.__render_data && target.__render_data !== data) {
      const error = new Error(
        `An old listener already exists and the rendering of this element may be wrong`
      );

      Object.assign(error, {
        element: target,
        old: target.__render_data,
        new: data,
      });

      throw error;
    }

    target.__render_data = data;

    tasks.forEach((func) => func());

    const wid = data.watchTick((e) => {
      if (tasks.length) {
        tasks.forEach((func) => func());
      } else {
        data.unwatch(wid);
      }
    });
  }

  renderExtends.render({ step: "init", target });
}

export function convert(el) {
  let temps = {};

  const { tagName } = el;
  if (tagName === "TEMPLATE") {
    let content = el.innerHTML;
    const matchs = content.match(/{{.+?}}/g);

    if (matchs) {
      matchs.forEach((str) => {
        content = content.replace(
          str,
          `<xtext expr="${str.replace(/{{(.+?)}}/, "$1")}"></xtext>`
        );
      });

      el.innerHTML = content;
    }

    const tempName = el.getAttribute("name");

    if (tempName) {
      if (el.content.children.length > 1) {
        console.warn({
          target: el,
          content: el.innerHTML,
          desc: `Only the first child element inside the template will be used`,
        });
      }
      temps[tempName] = el;
      el.remove();
    }

    temps = { ...temps, ...convert(el.content) };
  } else if (tagName) {
    const obj = {};

    Array.from(el.attributes).forEach((attr) => {
      const matchData = /(.*):(.+)/.exec(attr.name);

      if (!matchData) {
        return;
      }

      let [, actionName, param0] = matchData;

      if (!actionName) {
        actionName = "prop";
      }

      const targetActions = obj[actionName] || (obj[actionName] = []);

      targetActions.push([param0, attr.value]);

      el.removeAttribute(attr.name);
    });

    const keys = Object.keys(obj);

    if (keys.length) {
      el.setAttribute("x-bind-data", JSON.stringify(obj));
    }
  }

  if (el.children) {
    Array.from(el.children).forEach((el) => {
      temps = { ...temps, ...convert(el) };
    });
  }

  return temps;
}

const getVal = (val) => {
  if (isFunction(val)) {
    return val();
  }

  return val;
};

const defaultData = {
  _convertExpr(options = {}, expr) {
    const { isExpr, data } = options;

    if (!isExpr) {
      return expr;
    }

    return convertToFunc(expr, data);
  },
  prop(...args) {
    let [name, value, options] = args;

    if (args.length === 1) {
      return this[name];
    }

    value = this._convertExpr(options, value);
    value = getVal(value);
    name = hyphenToUpperCase(name);

    this[name] = value;
  },
  attr(...args) {
    let [name, value, options] = args;

    if (args.length === 1) {
      return this.ele.getAttribute(name);
    }

    value = this._convertExpr(options, value);
    value = getVal(value);

    this.ele.setAttribute(name, value);
  },
  class(...args) {
    let [name, value, options] = args;

    if (args.length === 1) {
      return this.ele.classList.contains(name);
    }

    value = this._convertExpr(options, value);
    value = getVal(value);

    if (value) {
      this.ele.classList.add(name);
    } else {
      this.ele.classList.remove(name);
    }
  },
};

defaultData.prop.always = true;
defaultData.attr.always = true;
defaultData.class.always = true;

export default defaultData;
