import { getRandomId, isRevokedErr } from "../../stanz/public.mjs";
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

const convertToFunc = (expr, data, opts) => {
  const funcStr = `
${isRevokedErr.toString()}
const [$event] = $args;
const {data, errCall} = this;
try{
  with(data){
    return ${expr};
  }
}catch(error){
  if(isRevokedErr(error)){
    return;
  }
  if(data.ele && !data.ele.isConnected){
    return;
  }
  if(errCall){
    const result = errCall(error);
    if(result !== false){
      console.error(error);
    }
  }
}
`;
  return new Function("...$args", funcStr).bind({ data, ...opts });
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
          let afterArgs = [];

          let workResult;

          const work = () => {
            const [key, expr] = args;

            const func = convertToFunc(expr, data, {
              errCall: (error) => {
                const stack = `Rendering of target element failed: ${$el.ele.outerHTML} \n  ${error.stack}`;
                console.error(stack);
                console.error({ stack, element: $el.ele, target, error });

                return false;
              },
            });

            afterArgs = [key, func];

            const reval = $el[actionName](...afterArgs, {
              actionName,
              target: $el,
              data,
              beforeArgs: args,
              args: afterArgs,
            });

            renderExtends.render({
              step: "refresh",
              args,
              name: actionName,
              target: $el,
            });

            return reval;
          };

          let clearRevs = () => {
            const { revoke: methodRevoke } = $el[actionName];

            if (methodRevoke) {
              methodRevoke({
                actionName,
                target: $el,
                data,
                beforeArgs: args,
                args: afterArgs,
                result: workResult,
              });
            }

            remove(revokes, clearRevs);
            remove(getRevokes(el), clearRevs);
            remove(tasks, work);
            clearRevs = null;
          };

          if (always) {
            // Run every data update
            tasks.push(work);
          } else {
            workResult = work();
          }

          revokes.push(clearRevs);
          if (el !== target) {
            addRevoke(el, clearRevs);
          }
        } catch (error) {
          const err = new Error(
            `Execution of the ${actionName} method reports an error: ${actionName}:${args[0]}="${args[1]}"  \n ${error.stack}`
          );
          err.error = error;
          throw err;
        }
      });
    }

    el.removeAttribute("x-bind-data");

    el._bindingRendered = true;
    el.dispatchEvent(new Event("binding-rendered"));
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

    tasks.forEach((f) => f());

    const wid = data.watchTick((e) => {
      if (tasks.length) {
        tasks.forEach((f) => f());
      } else {
        data.unwatch(wid);
      }
    });
  }

  renderExtends.render({ step: "init", target });
}

const fixFillAndIf = (template) => {
  template.content.querySelectorAll("x-fill:not([name])").forEach((fillEl) => {
    if (fillEl.querySelector("x-fill:not([name])")) {
      throw `Don't fill unnamed x-fills with unnamed x-fill elements!!!\n${fillEl.outerHTML}`;
    }

    const tid = `t${getRandomId()}`;
    fillEl.setAttribute("name", tid);

    const temp = document.createElement("template");
    temp.setAttribute("name", tid);
    temp.innerHTML = fillEl.innerHTML;
    fillEl.innerHTML = "";
    fillEl.appendChild(temp);
  });

  const conditions = Array.from(
    template.content.querySelectorAll("x-if,x-else-if,x-else")
  );

  conditions.forEach((condiEl) => {
    const firstChild = condiEl.children[0];
    if (!firstChild || firstChild.tagName !== "TEMPLATE") {
      condiEl.innerHTML = `<template condition>${condiEl.innerHTML}</template>`;
    }
  });

  template.content.querySelectorAll("template").forEach((e) => {
    fixFillAndIf(e);
  });
};

let isWarned;

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
        if (!isWarned) {
          console.warn(
            `Only one child element can be contained within a template element. If multiple child elements appear, the child elements will be rewrapped within a <div> element`
          );
          isWarned = 1;
        }

        const wrapName = `wrapper-${tempName}`;
        el.innerHTML = `<div ${wrapName} style="display:contents">${el.innerHTML}</div>`;
        console.warn(
          `The template "${tempName}" contains ${el.content.children.length} child elements that have been wrapped in a div element with attribute "${wrapName}".`
        );
      }
      temps[tempName] = el;
      el.remove();
    } else {
      // The initialized template can be run here
      fixFillAndIf(el);
    }

    temps = { ...temps, ...convert(el.content) };
  } else if (tagName) {
    // Converting elements
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
    // template content
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
  prop(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this[name];
    }

    value = getVal(value);
    name = hyphenToUpperCase(name);

    this.set(name, value);
  },
  attr(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this.ele.getAttribute(name);
    }

    value = getVal(value);

    if (value === null) {
      this.ele.removeAttribute(name);
    } else {
      this.ele.setAttribute(name, value);
    }
  },
  class(...args) {
    let [name, value] = args;

    if (args.length === 1) {
      return this.ele.classList.contains(name);
    }

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

defaultData.prop.revoke = ({ target, args, $ele, data }) => {
  const propName = args[0];
  // target[propName] = null;
  target.set(propName, null);
};

export default defaultData;
