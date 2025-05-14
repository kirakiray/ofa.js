import $ from "../xhear/base.mjs";
import { getRenderData } from "../xhear/render/condition.mjs";
import { eleX, revokeAll } from "../xhear/util.mjs";
import { createItem } from "../xhear/render/fill.mjs";
import { getErr } from "../ofa-error/main.js";

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
          const err = new Error(
            `o-fill - The key value cannot be empty: ${keyName} - ${currentKeyVal}`
          );

          console.log(err, this);

          throw err;
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
      // 创建的时候，将内容抽取成模板
      this.__originHTML = this.html.trim();
    }

    this.html = "";
  },
});
