import $ from "../xhear/base.mjs";
import { getHash } from "./public.mjs";

$.register({
  tag: "inject-host",
  temp: `<slot></slot>`,
  data: {},
  proto: {
    refresh() {
      if (!this.ele.isConnected) {
        return;
      }

      const targetHost = this.host.host;

      // 当有相同内容的 style 或 link，只添加一个标记，不添加重复的内容
      this.forEach(async (e) => {
        if (e.__targetLink) {
          // 已经初始化过的元素
          return;
        }

        let hostLink;

        switch (e.tag) {
          case "link":
            // 替换掉原来的 link ，防止污染自身的
            const replaceLinkEl = $(
              `<link href="${e.attr("href")}" rel="host" />`
            );

            e.before(replaceLinkEl);
            e.remove();
            const oldLink = e;
            e = replaceLinkEl;

            // 先查找是否已存在目标
            hostLink = targetHost.shadow.$(
              `link[href="${e.attr("href")}"][inject-host]`
            );

            hostLink = this._initTargetLink(e, hostLink, targetHost, () => {
              return oldLink.clone();
            });

            break;
          case "style":
            const html = e.html;
            const styleId = await getHash(html);

            if (e.__targetLink) {
              return;
            }

            // 先查找是否已存在目标
            hostLink = targetHost.shadow.$(
              `style[inject-host][styleid='${styleId}']`
            );

            hostLink = this._initTargetLink(e, hostLink, targetHost);

            e.__originHTML = e.html;

            const com = new Comment(e.__originHTML);
            e.html = "";
            e.push(com);

            const _this = this;

            // 重新修正元素上的属性
            ["html", "text"].forEach((name) => {
              e.extend({
                get [name]() {
                  return e.__originHTML;
                },
                set [name](val) {
                  if (val !== e.__originHTML) {
                    _this._fixStyle(e, val, targetHost);
                  }

                  e.__originHTML = val;
                },
              });
            });

            hostLink.attr("styleid", styleId);

            break;
        }
      });
    },
    _initTargetLink(e, hostLink, targetHost, cloneFunc) {
      if (hostLink) {
        hostLink.__items.add(e);
        e.__targetLink = hostLink;
        return hostLink;
      }

      if (cloneFunc) {
        hostLink = cloneFunc();
      } else {
        hostLink = e.clone();
      }
      hostLink.attr("inject-host", "");

      hostLink.__items = new Set([e]);
      targetHost.shadow.push(hostLink);
      e.__targetLink = hostLink;

      return hostLink;
    },
    async _fixStyle(e, styleContent, targetHost) {
      const styleId = await getHash(styleContent);

      const currentStyleId = e.__targetLink.attr("styleid");

      // 内容不一样的话，更新为新的style
      if (styleId !== currentStyleId) {
        // 先去除旧的绑定
        revokeLink(e);

        // 判断是否已经存在新的

        let hostLink = targetHost.shadow.$(
          `style[inject-host][styleid='${styleId}']`
        );

        const com = new Comment(styleContent);
        e.ele.innerHTML = "";
        e.push(com);

        hostLink = this._initTargetLink(e, hostLink, targetHost, () => {
          return $(`<style> ${styleContent} </style>`);
        });

        hostLink.attr("styleid", styleId);
      }
    },
  },
  attached() {
    this.refresh();

    // 创建 MutationObserver 实例
    const observer = new MutationObserver((mutationsList, observer) => {
      console.log("mutationsList:", mutationsList);
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          // 属性变化的处理逻辑
        } else if (mutation.type === "childList") {
          // 子节点变化的处理逻辑
        } else if (mutation.type === "characterData") {
          // 文本内容变化的处理逻辑
        }
      }
    });

    const config = { attributes: true, childList: true, subtree: true };

    // 开始观察目标元素
    this._obs = observer.observe(this.ele, config);
  },
  detached() {
    this.forEach((e) => revokeLink(e));

    this._obs.disconnect();
  },
});

const revokeLink = (e) => {
  const hostLink = e.__targetLink;
  // 删除关联
  hostLink.__items.delete(e);
  e.__targetLink = null;

  // 当关联数为0时，删除host元素
  if (!hostLink.__items.size) {
    hostLink.remove();
  }
};
