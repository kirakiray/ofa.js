import $ from "../xhear/base.mjs";
import { getHash } from "./public.mjs";

function initTargetLink(e, hostLink, targetHost) {
  if (hostLink) {
    hostLink.__items.add(e);
    this._hosteds.push(e);
    e.__targetLink = hostLink;
    return hostLink;
  }

  hostLink = e.clone();
  hostLink.attr("inject-host", "");

  hostLink.__items = new Set([e]);
  targetHost.shadow.push(hostLink);
  this._hosteds.push(e);
  e.__targetLink = hostLink;

  return hostLink;
}

$.register({
  tag: "inject-host",
  temp: `<slot></slot>`,
  data: {
    // 挂载数据
    _hosteds: [],
  },
  ready() {
    this.shadow.on("slotchange", () => {
      console.log("is change!");
      this.refresh();
    });
  },
  proto: {
    refresh() {
      if (!this.ele.isConnected) {
        return;
      }

      const targetHost = this.host.host;

      // 当有相同内容的 style 或 link，只添加一个标记，不添加重复的内容
      this.forEach(async (e) => {
        if (e.__targetLink) {
          return;
        }

        let hostLink;

        switch (e.tag) {
          case "link":
            // 先查找是否已存在目标
            hostLink = targetHost.shadow.$(
              `link[href="${e.attr("href")}"][inject-host]`
            );

            hostLink = initTargetLink.call(this, e, hostLink, targetHost);

            break;
          case "style":
            const html = e.html;
            const styleId = await getHash(html);

            if (e.__targetLink) {
              return;
            }

            // // 先查找是否已存在目标
            hostLink = targetHost.shadow.$(
              `style[inject-host][styleid='${styleId}']`
            );

            hostLink = initTargetLink.call(this, e, hostLink, targetHost);

            hostLink.attr("styleid", styleId);

            break;
        }
      });
    },
  },
  attached() {
    this.refresh();
  },
  detached() {
    this._hosteds.forEach((e) => {
      const hostLink = e.__targetLink;
      // 删除关联
      hostLink.__items.delete(e);
      e.__targetLink = null;

      // 当关联数为0时，删除host元素
      if (!hostLink.__items.size) {
        hostLink.remove();
      }
    });
  },
});
