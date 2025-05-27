import $ from "../xhear/base.mjs";
import { getRenderData } from "../xhear/render/condition.mjs";
import { eleX, revokeAll } from "../xhear/util.mjs";
import { createItem } from "../xhear/render/fill.mjs";
import { getErr } from "../ofa-error/main.js";
import { renderExtends } from "../xhear/render/render.mjs";

$.register({
  tag: "o-fill",
  temp: `<style>:host{display:contents;}</style><slot></slot>`,
  data: {
    value: null,
  },
  proto: {
    refreshView() {
      const arr = this.value;
      const tempName = this.attr("name");

      if (
        !arr ||
        !arr.length ||
        (this.__oldTempName && this.__oldTempName !== tempName)
      ) {
        // 没有值，清空内容
        Array.from(this.ele.childNodes).forEach((e) => {
          revokeAll(e);
          e.remove();
        });
        return;
      }

      const { data, target, temps = {} } = getRenderData(this.ele);

      const keyName = this.attr("fill-key") || "xid";

      let targetTemp = temps[tempName];

      if (!targetTemp) {
        // 没有找到模板，查看是否有默认的模板
        if (this.__originHTML) {
          targetTemp = $(`<template>${this.__originHTML}</template>`).ele;
        } else {
          throw new Error("o-fill - Template not found: " + tempName);
        }
      }

      this.__oldTempName = tempName;

      if (!this.length) {
        // 没有子元素，优化性能的添加方式
        const frag = document.createDocumentFragment();

        // 渲染模板
        for (let i = 0, len = arr.length; i < len; i++) {
          const item = arr[i];

          const $ele = createItem(
            item,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName
          );

          frag.appendChild($ele.ele);
        }

        this.ele.appendChild(frag);
        return;
      }

      // 有子元素，优化性能的方式更新方式
      const keyValsArr = arr.map((e) => e[keyName]);

      // 先删除不存在的元素
      for (let e of Array.from(this.ele.children)) {
        const renderedItem = e.__render_data;

        const currentKeyVal = renderedItem.$data[keyName];

        if (currentKeyVal === undefined || currentKeyVal === null) {
          throw new Error(
            "o-fill - The key value cannot be empty: " + currentKeyVal
          );
        }

        // 不存在的id，需要删除
        if (!keyValsArr.includes(currentKeyVal)) {
          e.remove();
          revokeAll(e);
        }
      }

      const { children } = this.ele;

      // 获取当前所有的key值
      let keyVals = [];
      const refreshKeyVals = () => {
        keyVals = Array.from(children).map(
          (e) => e.__render_data.$data[keyName]
        );
      };
      refreshKeyVals();

      const selfEl = this.ele;

      // 遍历一遍进行更新数据
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        const keyVal = item[keyName];

        // 查找是否存在
        const index = keyVals.indexOf(keyVal);

        if (index > -1) {
          // 存在，更新数据
          const $ele = eleX(children[index]);

          // 如果不是目标元素，则进行位置调整
          if (children[i] !== $ele.ele) {
            selfEl.insertBefore($ele.ele, children[i]);
            refreshKeyVals();
          }

          // 按需更新绑定的数据
          if ($ele.__item.$data !== item) {
            $ele.__item.$data = item;
          }
          if ($ele.__item.$index !== i) {
            $ele.__item.$index = i;
          }
        } else {
          // 不存在，添加新的元素
          const $ele = createItem(
            item,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName
          );

          selfEl.insertBefore($ele.ele, children[i]);
          refreshKeyVals();
        }
      }
    },
  },
  ready() {
    this.watchTick((e) => {
      if (e.hasModified("value")) {
        // value发生变动，重新渲染
        this.refreshView();
      }
    });
  },
  attached() {
    if (this.value) {
      this.refreshView();
    }
  },
  created() {
    // 检查内部是否包含无name的o-fill
    const fillEls = this.all("o-fill:not([name])");

    if (fillEls.length > 0) {
      const err = getErr("xhear_dbfill_noname");
      console.warn(err, this.ele, {
        content: this.html.trim(),
      });
      fillEls.forEach((e) => {
        e.remove();
      });
      throw err;
    }

    if (this.length > 1 || (this.length === 0 && this.html.trim())) {
      const err = getErr("temp_multi_child");
      console.warn(err, this.ele, {
        content: this.html.trim(),
      });

      this.__originHTML = `<div style="display: contents;">${this.html}</div>`;
    } else {
      console.log("o-fill created: ", this.ele, this.html);

      if (this[0].is("template[inner-code]")) {
        this.__originHTML = this[0].html.trim();
        this.html = "";
      }
      // 创建的时候，将内容抽取成模板
      // this.__originHTML = this.html.trim();
      // this.__originHTML = decodeURIComponent(this.data.originCode);
    }

    this.html = "";
  },
});

// 修正转换前的内容
const oldAfterConvert = renderExtends.afterConvert;
renderExtends.afterConvert = (e) => {
  oldAfterConvert(e);
  const { template, temps } = e;
  wrapTemp(template);
};

// 给需要预处理的元素的外部添加一个template包裹标签，防止被提前污染代码
const needWrapTags = ["o-fill", "o-if", "o-else-if", "o-else"];

// const oldBeforeRender = renderExtends.beforeRender;
// renderExtends.beforeRender = (e) => {
//   oldBeforeRender(e);

//   // 解除包裹
//   // if (e?.target?.querySelectorAll) {
//   //   const innerCodes = e.target.querySelectorAll(`template[inner-code]`);
//   //   console.log("content: ", e.target);
//   //   innerCodes.forEach((temp) => {
//   //     debugger;
//   //   });
//   // }

//   // // 解除包裹
//   // if (e?.target?.querySelectorAll) {
//   //   const wrappers = e.target.querySelectorAll(`template[wrapper]`);

//   //   wrappers.forEach((temp) => {
//   //     const { parentNode } = temp;
//   //     const cloneTemp = temp.content.cloneNode(true);
//   //     parentNode.insertBefore(cloneTemp, temp);
//   //     temp.remove();
//   //   });
//   // }
// };

export const wrapTemp = (template) => {
  const eles = Array.from(
    template.content.querySelectorAll(needWrapTags.join(","))
  );

  // 先修正底层的元素，性能会更好
  eles.reverse();
  // TODO: 应该改用循环templte嵌套

  eles.forEach((e) => {
    const originCode = e.innerHTML;
    // e.dataset.originCode = encodeURIComponent(originCode);
    // e.innerHTML = "";
    // debugger;
    console.log("originCode: ", originCode);
    e.innerHTML = `<template inner-code>${originCode}</template>`;

    // 先隐藏内部代码
    // if (e.parentNode.tagName !== "TEMPLATE") {
    // // 如果不是已经被包裹在template中，则进行包裹
    // const temp = document.createElement("template");
    // temp.setAttribute("wrapper", "1");
    // e.parentNode.insertBefore(temp, e);
    // temp.innerHTML = e.outerHTML;
    // e.remove();
    // }
  });
};
